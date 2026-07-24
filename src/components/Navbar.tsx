import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { AuthUser } from '../context/AuthContext';
import {
  Search, Sun, Moon, Bell, PlusCircle, CreditCard, DollarSign,
  Download, ShieldCheck, LogOut, User, ChevronDown, Settings
} from 'lucide-react';

export const Navbar: React.FC<{
  onOpenNewClient: () => void;
  onOpenNewPayment: () => void;
  onOpenNewExpense: () => void;
  onLogout?: () => void;
  authUser?: AuthUser | null;
}> = ({ onOpenNewClient, onOpenNewPayment, onOpenNewExpense, onLogout, authUser }) => {
  const { globalSearch, setGlobalSearch, metrics, exportBackup } = useData();
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notificationCount = metrics.clientsDueToday + metrics.clientsOverdue + metrics.clientsExpiringSoon;

  const roleLabel: Record<string, string> = {
    admin: 'Administrateur',
    manager: 'Gestionnaire',
    agent: 'Agent',
  };

  const roleBadgeClass: Record<string, string> = {
    admin: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    manager: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    agent: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Recherche instantanée : Nom, Téléphone, Adresse, IP, MAC, Facture FAC-..."
            className="w-full bg-slate-800/80 text-slate-100 placeholder-slate-400 text-sm rounded-xl pl-10 pr-4 py-2 border border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          {globalSearch && (
            <button
              onClick={() => setGlobalSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-slate-700 text-slate-300 hover:text-white px-2 py-0.5 rounded-md"
            >
              Effacer
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 lg:gap-3">
          
          {/* Quick Add Client */}
          <button
            onClick={onOpenNewClient}
            className="hidden sm:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/20 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nouveau Client</span>
          </button>

          {/* Quick Payment */}
          <button
            onClick={onOpenNewPayment}
            className="hidden md:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-95"
          >
            <CreditCard className="w-4 h-4" />
            <span>Encaisser</span>
          </button>

          {/* Quick Expense */}
          <button
            onClick={onOpenNewExpense}
            className="hidden lg:flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-md shadow-amber-600/20 active:scale-95"
          >
            <DollarSign className="w-4 h-4" />
            <span>Dépense</span>
          </button>

          {/* Backup Button */}
          <button
            onClick={exportBackup}
            title="Sauvegarder les données"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-indigo-400 border border-slate-700/60 transition-all"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Notifications Badge */}
          <div className="relative">
            <button className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-all">
              <Bell className="w-4 h-4" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border border-slate-700/60 transition-all"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 pl-2 border-l border-slate-800 hover:opacity-80 transition-opacity"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center font-bold text-white text-xs shadow-inner">
                {authUser?.avatarInitials || 'AD'}
              </div>
              <div className="hidden xl:block text-left text-xs">
                <div className="font-semibold text-slate-200">{authUser?.name || 'Administrateur'}</div>
                <div className={`text-[10px] flex items-center gap-1 px-1.5 py-0.5 rounded-full border font-semibold ${roleBadgeClass[authUser?.role || 'admin']}`}>
                  <ShieldCheck className="w-3 h-3" />
                  {roleLabel[authUser?.role || 'admin']}
                </div>
              </div>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/50">
                  <div className="text-xs font-bold text-slate-200">{authUser?.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{authUser?.email}</div>
                  <div className={`text-[10px] font-bold mt-1 inline-block px-2 py-0.5 rounded-full border ${roleBadgeClass[authUser?.role || 'admin']}`}>
                    {roleLabel[authUser?.role || 'admin']}
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2 space-y-1">
                  <button className="w-full flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-xl transition-all text-left">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    Mon Profil
                  </button>
                  <button className="w-full flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-xl transition-all text-left">
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    Paramètres
                  </button>
                </div>

                {/* Logout */}
                <div className="p-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (onLogout) onLogout();
                    }}
                    className="w-full flex items-center gap-2 text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-600 px-3 py-2 rounded-xl transition-all text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Se déconnecter
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
