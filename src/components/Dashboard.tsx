import React from 'react';
import { useData } from '../context/DataContext';
import {
  Users, CheckCircle2, PauseCircle, XCircle, UserPlus, DollarSign,
  TrendingUp, TrendingDown, AlertTriangle, Clock, ShieldCheck, Receipt,
  PlusCircle, CreditCard, Radio, ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell
} from 'recharts';

export const Dashboard: React.FC<{
  onOpenNewClient: () => void;
  onOpenNewPayment: () => void;
}> = ({ onOpenNewClient, onOpenNewPayment }) => {
  const { metrics, payments, clients, setSelectedInvoice, settings } = useData();

  const formatAriary = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' ' + (settings.currency || 'Ar');
  };

  // Mock revenue chart data
  const revenueChartData = [
    { name: 'Lun', Revenus: 90000, Dépenses: 140000 / 30, Bénéfice: 85000 },
    { name: 'Mar', Revenus: 120000, Dépenses: 140000 / 30 + 15000, Bénéfice: 100000 },
    { name: 'Mer', Revenus: 80000, Dépenses: 140000 / 30, Bénéfice: 75000 },
    { name: 'Jeu', Revenus: 150000, Dépenses: 140000 / 30 + 25000, Bénéfice: 120000 },
    { name: 'Ven', Revenus: 200000, Dépenses: 140000 / 30, Bénéfice: 195000 },
    { name: 'Sam', Revenus: 250000, Dépenses: 140000 / 30, Bénéfice: 245000 },
    { name: 'Dim', Revenus: 180000, Dépenses: 140000 / 30, Bénéfice: 175000 }
  ];

  // Payment mode distribution
  const paymentModeData = [
    { name: 'MVola', value: 45, color: '#f59e0b' },
    { name: 'Orange Money', value: 30, color: '#ea580c' },
    { name: 'Airtel Money', value: 15, color: '#dc2626' },
    { name: 'Espèces', value: 10, color: '#10b981' }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner / Welcome & Key Financial Indicator */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-950 p-6 rounded-3xl border border-indigo-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              Réseau Starlink Madagascar Opérationnel
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Tableau de Bord Financier & Abonnements
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Suivi temps réel des revenus, de la dépense fixe Starlink (140 000 Ar), des bénéfices réels et des abonnements clients.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenNewClient}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              Nouveau Client
            </button>
            <button
              onClick={onOpenNewPayment}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
            >
              <CreditCard className="w-4 h-4" />
              Encaisser Paiement
            </button>
          </div>
        </div>
      </div>

      {/* Financial Health & Starlink Deduction Highlight Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* CA Mensuel */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
            <span>Chiffre d'Affaires Mensuel</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {formatAriary(metrics.revenueMonth)}
          </div>
          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            Total encaissé sur les abonnements
          </p>
        </div>

        {/* Starlink Fixed Expense Deduction */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
            <span>Dépense Fixe Starlink (Obligatoire)</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            -{formatAriary(metrics.starlinkFixedFee)} /mois
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Seuil d'équilibre :</span>
            <span className="font-bold text-slate-200">{metrics.breakevenClientsNeeded} clients actifs minimum</span>
          </div>
        </div>

        {/* Real Net Profit */}
        <div className={`border p-5 rounded-3xl space-y-2 transition-all ${
          metrics.isProfitable
            ? 'bg-emerald-950/20 border-emerald-500/30'
            : 'bg-rose-950/20 border-rose-500/30'
        }`}>
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className={metrics.isProfitable ? 'text-emerald-400' : 'text-rose-400'}>
              Bénéfice Net Réel du Mois
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              metrics.isProfitable ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
            }`}>
              {metrics.isProfitable ? 'Rentable' : 'Déficitaire'}
            </span>
          </div>
          <div className={`text-2xl font-black font-mono ${metrics.isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatAriary(metrics.netProfitMonth)}
          </div>
          <p className="text-[11px] text-slate-400">
            Calculé automatiquement (CA - Starlink & Frais annexes)
          </p>
        </div>

      </div>

      {/* KPI Cards Grid (Clients & Revenues) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Clients */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Total Clients</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-white">{metrics.totalClients}</div>
          <div className="text-[10px] text-emerald-400 font-medium">+ {metrics.newClientsThisMonth} ce mois-ci</div>
        </div>

        {/* Active Clients */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Clients Actifs</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400">{metrics.activeClients}</div>
          <div className="text-[10px] text-slate-400">Connexion activée</div>
        </div>

        {/* Suspended Clients */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Clients Suspendus</span>
            <PauseCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-400">{metrics.suspendedClients}</div>
          <div className="text-[10px] text-slate-400">Accès Wi-Fi bloqué</div>
        </div>

        {/* Customer Debts / Unpaid Balance */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Dettes & Impayés</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-bold text-rose-400 font-mono">{formatAriary(metrics.totalRemainingToCollect)}</div>
          <div className="text-[10px] text-slate-400">Reste à encaisser</div>
        </div>

      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Revenue vs Net Profit Graph */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-100">Évolution des Revenus & Bénéfices Net</h2>
              <p className="text-xs text-slate-400">Comparatif de la performance financière hebdomadaire</p>
            </div>
            <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              Temps Réel
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="colorRevenus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBenefice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  formatter={(val: any) => [formatAriary(Number(val)), '']}
                />
                <Area type="monotone" dataKey="Revenus" stroke="#6366f1" fillOpacity={1} fill="url(#colorRevenus)" strokeWidth={2} />
                <Area type="monotone" dataKey="Bénéfice" stroke="#10b981" fillOpacity={1} fill="url(#colorBenefice)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Modes Pie Chart */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-100">Répartition des Modes de Paiement</h2>
            <p className="text-xs text-slate-400">MVola, Orange Money, Airtel Money & Cash</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentModeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentModeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {paymentModeData.map((mode, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: mode.color }} />
                <span className="text-slate-300">{mode.name} ({mode.value}%)</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Payments Feed & Instant Receipt Trigger */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-100">Derniers Encaissements & Reçus Générés</h2>
            <p className="text-xs text-slate-400">Cliquez sur une transaction pour réimprimer sa facture FAC-2026-XXXX</p>
          </div>
        </div>

        <div className="divide-y divide-slate-800 overflow-hidden">
          {payments.slice(0, 5).map((pay) => (
            <div
              key={pay.id}
              onClick={() => {
                const inv = pay.invoiceId ? { id: pay.invoiceId, invoiceNumber: pay.invoiceNumber || 'FAC-2026-0001', paymentId: pay.id, clientId: pay.clientId, clientName: pay.clientName, clientPhone: '034 12 345 67', clientAddress: 'Antananarivo', clientQuartier: 'Ankorondrano', subscriptionType: 'Mensuel', durationDays: 30, startDate: pay.paymentDate, endDate: '2026-08-23', items: [{ designation: 'Abonnement Wi-Fi Starlink', quantity: 1, unitPrice: pay.amountPaid, total: pay.amountPaid }], subtotal: pay.amountPaid, discount: 0, tax: 0, totalPaid: pay.amountPaid, balanceDue: pay.amountDue, paymentMode: pay.paymentMode, transactionRef: pay.reference, agentName: pay.agentName, qrCodePayload: `${pay.invoiceNumber}|${pay.clientId}|${pay.amountPaid}`, hashSignature: 'SHA256-abc12345', status: 'valid' as const, createdAt: pay.paymentDate } : null;
                if (inv) setSelectedInvoice(inv);
              }}
              className="py-3 flex items-center justify-between gap-4 hover:bg-slate-800/50 px-3 rounded-xl cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-200 text-xs flex items-center gap-2">
                    {pay.clientName}
                    <span className="font-mono text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {pay.invoiceNumber || 'FAC-2026-XXXX'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Mode : <span className="font-semibold text-slate-300">{pay.paymentMode}</span> (Réf : {pay.reference})
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono font-bold text-emerald-400 text-xs">
                  +{formatAriary(pay.amountPaid)}
                </div>
                <div className="text-[10px] text-slate-400">
                  {pay.paymentDate} à {pay.paymentTime}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
