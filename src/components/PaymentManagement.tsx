import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { PaymentMode, PlanType, Client } from '../types';
import { CreditCard, DollarSign, Receipt, CheckCircle2, User, Phone, Tag, Smartphone, AlertTriangle } from 'lucide-react';

export const PaymentManagement: React.FC<{
  initialClient?: Client | null;
  onSuccessClose?: () => void;
}> = ({ initialClient, onSuccessClose }) => {
  const { clients, addPaymentAndInvoice, setSelectedInvoice, settings } = useData();

  const activeClientsList = clients.filter(c => !c.isDeleted);

  const [selectedClientId, setSelectedClientId] = useState<string>(initialClient ? initialClient.id : (activeClientsList[0]?.id || ''));
  const [planType, setPlanType] = useState<PlanType>('Mensuel');
  const [durationDays, setDurationDays] = useState<number>(30);
  const [totalAmount, setTotalAmount] = useState<number>(50000);
  const [amountPaid, setAmountPaid] = useState<number>(50000);
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('MVola');
  const [reference, setReference] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [agentName, setAgentName] = useState<string>('Admin System');

  const selectedClient = clients.find(c => c.id === selectedClientId);
  const finalPrice = Math.max(0, totalAmount - discount);
  const balanceDue = Math.max(0, finalPrice - amountPaid);
  const isPartial = balanceDue > 0;

  const handlePlanChange = (type: PlanType) => {
    setPlanType(type);
    if (type === 'Journalier') {
      setDurationDays(1);
      setTotalAmount(3000);
      setAmountPaid(3000);
    } else if (type === 'Hebdomadaire') {
      setDurationDays(7);
      setTotalAmount(15000);
      setAmountPaid(15000);
    } else if (type === 'Mensuel') {
      setDurationDays(30);
      setTotalAmount(50000);
      setAmountPaid(50000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) return;

    const refToUse = reference.trim() || `${paymentMode.slice(0, 2).toUpperCase()}-${Date.now().toString().slice(-6)}`;

    const result = addPaymentAndInvoice({
      clientId: selectedClientId,
      planType,
      durationDays,
      totalAmount,
      amountPaid,
      discount,
      paymentMode,
      reference: refToUse,
      notes,
      agentName
    });

    // Auto trigger invoice preview modal
    setSelectedInvoice(result.invoice);

    if (onSuccessClose) onSuccessClose();
  };

  const formatAriary = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' ' + (settings.currency || 'Ar');
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full mb-2">
          <CreditCard className="w-3.5 h-3.5" />
          Enregistrement d'un Encaissement & Facturation
        </div>
        <h1 className="text-2xl font-extrabold text-white">Nouveau Paiement Client</h1>
        <p className="text-xs text-slate-400 mt-1">
          Sélectionnez un client, choisissez la formule d'abonnement et enregistrez le règlement via MVola, Orange Money, Airtel Money ou Cash.
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-6 shadow-xl">
        
        {/* Client Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" />
            Sélectionner le Client
          </label>
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="w-full bg-slate-800 text-slate-100 text-sm font-semibold p-3.5 rounded-2xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            {activeClientsList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom} {c.prenom} - 📞 {c.telephone} ({c.quartier}) {c.balanceDue && c.balanceDue > 0 ? ` [Dette: ${formatAriary(c.balanceDue)}]` : ''}
              </option>
            ))}
          </select>

          {selectedClient && (
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-xs flex justify-between items-center text-slate-300">
              <div>
                <span className="font-bold text-slate-100">{selectedClient.nom} {selectedClient.prenom}</span>
                <p className="text-slate-400 text-[11px]">Adresse: {selectedClient.adresse} | IP: {selectedClient.networkInfo.ip}</p>
              </div>
              {selectedClient.balanceDue && selectedClient.balanceDue > 0 ? (
                <div className="text-rose-400 font-bold bg-rose-950/40 px-3 py-1 rounded border border-rose-500/20">
                  Ancienne dette : {formatAriary(selectedClient.balanceDue)}
                </div>
              ) : (
                <div className="text-emerald-400 font-semibold">À jour de paiement</div>
              )}
            </div>
          )}
        </div>

        {/* Subscription Plan Preset Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <Tag className="w-4 h-4 text-indigo-400" />
            Formule d'Abonnement
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['Mensuel', 'Hebdomadaire', 'Journalier', 'Personnalisé'] as PlanType[]).map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => handlePlanChange(type)}
                className={`p-3 rounded-2xl text-xs font-bold border transition-all text-center ${
                  planType === type
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Pack {type}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing & Duration Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Durée (Jours)</label>
            <input
              type="number"
              min={1}
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="w-full bg-slate-800 text-slate-100 font-mono font-bold p-3 rounded-xl border border-slate-700 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Prix de l'abonnement (Ar)</label>
            <input
              type="number"
              min={0}
              value={totalAmount}
              onChange={(e) => setTotalAmount(Number(e.target.value))}
              className="w-full bg-slate-800 text-slate-100 font-mono font-bold p-3 rounded-xl border border-slate-700 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Remise éventuelle (Ar)</label>
            <input
              type="number"
              min={0}
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="w-full bg-slate-800 text-slate-100 font-mono font-bold p-3 rounded-xl border border-slate-700 focus:outline-none"
            />
          </div>
        </div>

        {/* Amount Paid vs Debt handling */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Total à payer après remise :</span>
            <span className="font-mono font-bold text-white text-base">{formatAriary(finalPrice)}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-bold text-emerald-400 block mb-1">Montant réelllement Versé (Ar)</label>
              <input
                type="number"
                min={1}
                max={finalPrice}
                value={amountPaid}
                onChange={(e) => setAmountPaid(Number(e.target.value))}
                className="w-full bg-slate-900 text-emerald-400 font-mono font-bold text-base p-3 rounded-xl border border-emerald-500/40 focus:outline-none"
                required
              />
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-xs font-semibold text-slate-400">Reste à encaissser (Acompte / Dette)</span>
              <div className={`font-mono font-bold text-lg ${isPartial ? 'text-rose-400' : 'text-slate-400'}`}>
                {formatAriary(balanceDue)}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Mode & Transaction Reference */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-amber-400" />
            Mode de Règlement
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(['MVola', 'Orange Money', 'Airtel Money', 'Espèces', 'Virement'] as PaymentMode[]).map((mode) => (
              <button
                type="button"
                key={mode}
                onClick={() => setPaymentMode(mode)}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                  paymentMode === mode
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Référence Transaction Mobile Money / Reçu</label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="ex: MV-982347102, OM-54129841..."
                className="w-full bg-slate-800 text-slate-100 font-mono text-xs p-3 rounded-xl border border-slate-700 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Nom de l'Agent encaisseur</label>
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full bg-slate-800 text-slate-100 text-xs p-3 rounded-xl border border-slate-700 focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-sm px-8 py-4 rounded-2xl shadow-xl shadow-emerald-600/30 transition-all active:scale-95"
          >
            <Receipt className="w-5 h-5" />
            Valider le Paiement & Générer la Facture
          </button>
        </div>

      </form>

    </div>
  );
};
