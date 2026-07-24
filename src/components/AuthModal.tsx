import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  Radio, Eye, EyeOff, Mail, Lock, User, Shield, AlertCircle,
  CheckCircle2, Sparkles, Wifi, Globe, ArrowRight
} from 'lucide-react';

type AuthMode = 'login' | 'register';

export const AuthModal: React.FC = () => {
  const { login, register } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'manager' | 'agent'>('agent');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const { error: loginError } = await login(email, password);
        if (loginError) {
          setError(loginError);
        }
      } else {
        if (!name.trim()) {
          setError('Veuillez entrer votre nom complet.');
          return;
        }
        const { error: registerError } = await register(email, password, name, role);
        if (registerError) {
          setError(registerError);
        } else {
          setSuccess('Compte créé avec succès ! Vérifiez votre email pour confirmer votre inscription.');
          setMode('login');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fill demo credentials
  const fillDemoCredentials = () => {
    setEmail('admin@starlink-wifi.mg');
    setPassword('admin2026!');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">

        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-600 to-cyan-400 shadow-2xl shadow-indigo-600/40 mb-4">
            <Radio className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Starlink Wi-Fi ISP Manager
          </h1>
          <p className="text-sm text-indigo-300 font-medium mt-1">
            Madagascar — Plateforme de Gestion Professionnelle
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden">

          {/* Supabase Status Banner */}
          <div className={`px-6 py-3 flex items-center gap-2 text-xs font-semibold border-b ${
            isSupabaseConfigured
              ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-300'
              : 'bg-amber-950/40 border-amber-500/20 text-amber-300'
          }`}>
            {isSupabaseConfigured ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <Globe className="w-3.5 h-3.5" />
                Connecté à Supabase Cloud — Authentification sécurisée active
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                Mode Local (hors-ligne) — Configurez Supabase dans <code className="mx-1 px-1 bg-amber-900/40 rounded">.env</code> pour le mode cloud
              </>
            )}
          </div>

          {/* Mode Tabs */}
          <div className="flex border-b border-slate-800">
            <button
              onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
              className={`flex-1 py-4 text-sm font-bold transition-all ${
                mode === 'login'
                  ? 'text-white border-b-2 border-indigo-500 bg-indigo-600/5'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Se connecter
            </button>
            <button
              onClick={() => { setMode('register'); setError(null); setSuccess(null); }}
              className={`flex-1 py-4 text-sm font-bold transition-all ${
                mode === 'register'
                  ? 'text-white border-b-2 border-indigo-500 bg-indigo-600/5'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Créer un compte
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">

            {/* Error / Success Alerts */}
            {error && (
              <div className="flex items-start gap-3 bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-xl">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-3 bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs p-3 rounded-xl">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
                <span>{success}</span>
              </div>
            )}

            {/* Nom complet (Register only) */}
            {mode === 'register' && (
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Nom complet *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ex: Jean Marc RAKOTO"
                    className="w-full bg-slate-800 text-slate-100 placeholder-slate-400 text-sm rounded-xl pl-10 pr-4 py-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required={mode === 'register'}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Adresse Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full bg-slate-800 text-slate-100 placeholder-slate-400 text-sm rounded-xl pl-10 pr-4 py-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Mot de passe *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'Minimum 6 caractères' : '••••••••'}
                  className="w-full bg-slate-800 text-slate-100 placeholder-slate-400 text-sm rounded-xl pl-10 pr-12 py-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Rôle (Register only) */}
            {mode === 'register' && (
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Rôle utilisateur *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { value: 'admin', label: 'Administrateur', icon: '👑' },
                    { value: 'manager', label: 'Gestionnaire', icon: '📋' },
                    { value: 'agent', label: 'Agent', icon: '👤' },
                  ] as const).map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                        role === r.value
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <div className="text-base mb-0.5">{r.icon}</div>
                      <div>{r.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-xl shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{mode === 'login' ? 'Connexion...' : 'Création du compte...'}</span>
                </>
              ) : (
                <>
                  {mode === 'login' ? (
                    <>
                      <Shield className="w-4 h-4" />
                      <span>Se connecter à Starlink ISP</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Créer mon compte</span>
                    </>
                  )}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>

            {/* Demo Credentials (mode local uniquement) */}
            {!isSupabaseConfigured && mode === 'login' && (
              <div className="pt-2 border-t border-slate-800">
                <div className="text-center text-xs text-slate-400 mb-2">Mode Démonstration Local</div>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="w-full py-2 rounded-xl text-xs font-semibold bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-all"
                >
                  Utiliser le compte démo admin@starlink-wifi.mg
                </button>
              </div>
            )}

          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Starlink Wi-Fi ISP Manager — Madagascar © 2026
        </p>

      </div>
    </div>
  );
};
