import React from 'react';
import { useData } from '../context/DataContext';
import { CalendarCheck, Search, Clock, CheckCircle2, AlertTriangle, ShieldAlert, PlusCircle } from 'lucide-react';

export const SubscriptionManagement: React.FC<{
  onOpenNewPayment: () => void;
}> = ({ onOpenNewPayment }) => {
  const { subscriptions, settings } = useData();

  const formatAriary = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' ' + (settings.currency || 'Ar');
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            <CalendarCheck className="w-3.5 h-3.5" />
            Suivi & Automatisation des Abonnements
          </div>
          <h1 className="text-2xl font-extrabold text-white">Abonnements En Cours & Échéances</h1>
          <p className="text-xs text-slate-400 mt-1">
            Calcul automatique des dates de fin, alertes d'expiration sous 3 jours et renouvellements.
          </p>
        </div>

        <button
          onClick={onOpenNewPayment}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Renouveler Abonnement
        </button>
      </div>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subscriptions.map((sub) => {
          const isExpired = sub.endDate < todayStr;
          
          // Calculate remaining days
          const diffTime = new Date(sub.endDate).getTime() - new Date().getTime();
          const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const isExpiringSoon = daysLeft > 0 && daysLeft <= 3;

          return (
            <div
              key={sub.id}
              className={`bg-slate-900/90 border p-5 rounded-3xl space-y-3 transition-all ${
                isExpired
                  ? 'border-rose-500/30 bg-rose-950/10'
                  : isExpiringSoon
                    ? 'border-amber-500/30 bg-amber-950/10'
                    : 'border-slate-800'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">{sub.clientName}</h3>
                  <p className="text-xs text-indigo-400 font-semibold mt-0.5">Pack {sub.planType} ({sub.durationDays} Jours)</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  isExpired
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : isExpiringSoon
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {isExpired ? 'Expiré' : isExpiringSoon ? `Reste ${daysLeft}j` : 'Actif'}
                </span>
              </div>

              <div className="text-xs space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Date Début :</span>
                  <span>{sub.startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date Expiration :</span>
                  <span className="font-bold">{sub.endDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tarif du forfait :</span>
                  <span className="font-mono font-bold text-slate-100">{formatAriary(sub.price)}</span>
                </div>
              </div>

              {/* Progress Bar of remaining time */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Progression</span>
                  <span>{isExpired ? '0% (Expiré)' : `${Math.max(0, Math.min(100, Math.round((daysLeft / sub.durationDays) * 100)))}% temps restant`}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isExpired ? 'bg-rose-500' : isExpiringSoon ? 'bg-amber-500' : 'bg-gradient-to-r from-indigo-500 to-emerald-400'
                    }`}
                    style={{ width: `${isExpired ? 0 : Math.max(0, Math.min(100, (daysLeft / sub.durationDays) * 100))}%` }}
                  />
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
