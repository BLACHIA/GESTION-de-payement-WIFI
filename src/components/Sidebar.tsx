import React from 'react';
import { useData } from '../context/DataContext';
import {
  LayoutDashboard, Users, CalendarCheck, CreditCard, Receipt,
  TrendingDown, Radio, BarChart3, Settings, Shield, Sparkles, AlertCircle
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, metrics, settings } = useData();

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, badge: null },
    { id: 'invoices', label: 'Factures & Reçus', icon: Receipt, badge: 'SaaS' },
    { id: 'clients', label: 'Gestion Clients', icon: Users, badge: metrics.totalClients },
    { id: 'subscriptions', label: 'Abonnements', icon: CalendarCheck, badge: metrics.clientsExpiringSoon > 0 ? `${metrics.clientsExpiringSoon} alertes` : null },
    { id: 'payments', label: 'Encaissements', icon: CreditCard, badge: metrics.clientsOverdue > 0 ? `${metrics.clientsOverdue} retard` : null },
    { id: 'expenses', label: 'Dépenses & Starlink', icon: TrendingDown, badge: '140k Ar' },
    { id: 'wifipoints', label: 'Points Wi-Fi', icon: Radio, badge: null },
    { id: 'reports', label: 'Comptabilité & Rapports', icon: BarChart3, badge: null },
    { id: 'settings', label: 'Paramètres & Sécurité', icon: Settings, badge: null }
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Radio className="w-6 h-6 animate-pulse text-cyan-300" />
          </div>
          <div>
            <h1 className="font-extrabold text-slate-100 text-sm tracking-wide leading-tight">STARLINK ISP</h1>
            <p className="text-[11px] text-indigo-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Madagascar
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                    isActive
                      ? 'bg-indigo-500 text-white'
                      : item.badge.toString().includes('retard') || item.badge.toString().includes('alertes')
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Starlink Status Card */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[11px]">Connexion Starlink</span>
            <span className="flex items-center gap-1 text-emerald-400 font-bold text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Opérationnel
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Forfait Fixe :</span>
            <span className="font-bold text-indigo-400">140 000 Ar / mois</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full w-full" />
          </div>
        </div>
      </div>
    </aside>
  );
};
