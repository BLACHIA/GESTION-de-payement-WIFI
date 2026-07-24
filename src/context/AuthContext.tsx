import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'manager' | 'agent';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarInitials: string;
}

interface AuthContextType {
  authUser: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSupabase: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  register: (email: string, password: string, name: string, role?: UserRole) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<{ name: string; role: UserRole }>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Utilisateur par défaut (mode hors-ligne sans Supabase)
const DEFAULT_OFFLINE_USER: AuthUser = {
  id: 'local-admin-001',
  email: 'admin@starlink-wifi.mg',
  name: 'Administrateur Starlink',
  role: 'admin',
  avatarInitials: 'AD',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Résout les initiales d'un nom
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Construit le profil AuthUser depuis les données Supabase
  const buildAuthUser = useCallback(async (user: User): Promise<AuthUser> => {
    let name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur';
    let role: UserRole = user.user_metadata?.role || 'agent';

    // Charge le profil étendu depuis la table `profiles`
    if (supabase) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', user.id)
        .single();

      if (profile) {
        name = profile.full_name || name;
        role = profile.role || role;
      }
    }

    return {
      id: user.id,
      email: user.email || '',
      name,
      role,
      avatarInitials: getInitials(name),
    };
  }, []);

  // Initialisation de la session Supabase au démarrage
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      // Mode hors-ligne : connexion locale automatique avec AdminUser
      const savedUser = localStorage.getItem('starlink_local_auth');
      if (savedUser) {
        setAuthUser(JSON.parse(savedUser));
      } else {
        // Auto-login en mode démo local
        setAuthUser(DEFAULT_OFFLINE_USER);
        localStorage.setItem('starlink_local_auth', JSON.stringify(DEFAULT_OFFLINE_USER));
      }
      setIsLoading(false);
      return;
    }

    // Récupère la session active depuis Supabase
    const initSession = async () => {
      const { data: { session: currentSession } } = await supabase!.auth.getSession();
      setSession(currentSession);

      if (currentSession?.user) {
        const user = await buildAuthUser(currentSession.user);
        setAuthUser(user);
      }
      setIsLoading(false);
    };

    initSession();

    // Écoute les changements d'état d'authentification Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);

      if (event === 'SIGNED_IN' && newSession?.user) {
        const user = await buildAuthUser(newSession.user);
        setAuthUser(user);
      } else if (event === 'SIGNED_OUT') {
        setAuthUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [buildAuthUser]);

  // Connexion avec Email & Mot de passe
  const login = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (!isSupabaseConfigured || !supabase) {
      // Mode local : vérification basique des identifiants de démo
      if (email === 'admin@starlink-wifi.mg' && password === 'admin2026!') {
        setAuthUser(DEFAULT_OFFLINE_USER);
        localStorage.setItem('starlink_local_auth', JSON.stringify(DEFAULT_OFFLINE_USER));
        return { error: null };
      }
      return { error: 'Identifiants incorrects. Utilisez admin@starlink-wifi.mg / admin2026! en mode local.' };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: getReadableError(error.message) };
    }
    return { error: null };
  };

  // Inscription d'un nouvel utilisateur
  const register = async (
    email: string,
    password: string,
    name: string,
    role: UserRole = 'agent'
  ): Promise<{ error: string | null }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { error: 'Inscription non disponible en mode local. Configurez Supabase.' };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, role },
      },
    });

    if (error) return { error: getReadableError(error.message) };

    // Crée la ligne dans la table profiles
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        full_name: name,
        role,
      });
    }

    return { error: null };
  };

  // Déconnexion
  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('starlink_local_auth');
    setAuthUser(null);
    setSession(null);
  };

  // Mise à jour du profil
  const updateProfile = async (updates: Partial<{ name: string; role: UserRole }>) => {
    if (!authUser) return;

    const updatedUser: AuthUser = {
      ...authUser,
      name: updates.name || authUser.name,
      role: updates.role || authUser.role,
      avatarInitials: getInitials(updates.name || authUser.name),
    };

    setAuthUser(updatedUser);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('profiles').update({
        full_name: updates.name,
        role: updates.role,
      }).eq('id', authUser.id);
    }
  };

  // Traduit les messages d'erreur Supabase en français
  const getReadableError = (message: string): string => {
    if (message.includes('Invalid login credentials')) return 'Adresse email ou mot de passe incorrect.';
    if (message.includes('Email not confirmed')) return "Veuillez confirmer votre adresse email avant de vous connecter.";
    if (message.includes('User already registered')) return 'Un compte avec cet email existe déjà.';
    if (message.includes('Password should be at least')) return 'Le mot de passe doit contenir au moins 6 caractères.';
    if (message.includes('rate limit')) return 'Trop de tentatives. Veuillez patienter quelques minutes.';
    return message;
  };

  return (
    <AuthContext.Provider value={{
      authUser,
      session,
      isLoading,
      isAuthenticated: !!authUser,
      isSupabase: isSupabaseConfigured,
      login,
      register,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
