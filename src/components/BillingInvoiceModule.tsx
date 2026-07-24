import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Invoice } from '../types';
import {
  Receipt, Search, Filter, Printer, Download, Eye, Ban, CheckCircle2,
  FileText, ShieldCheck, Share2, Calendar, User, DollarSign, ArrowUpRight
} from 'lucide-react';

export const BillingInvoiceModule: React.FC = () => {
  const { invoices, cancelInvoice, setSelectedInvoice, settings } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'valid' | 'cancelled'>('all');
  const [cancelModalInvoice, setCancelModalInvoice] = useState<Invoice | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const formatAriary = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' ' + (settings.currency || 'Ar');
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.clientPhone.includes(searchTerm) ||
      inv.transactionRef.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const handleConfirmCancel = () => {
    if (cancelModalInvoice && cancelReason.trim()) {
      cancelInvoice(cancelModalInvoice.id, cancelReason);
      setCancelModalInvoice(null);
      setCancelReason('');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            <Receipt className="w-3.5 h-3.5" />
            Module Professionnel de Facturation
          </div>
          <h1 className="text-2xl font-extrabold text-white">Factures & Reçus de Paiement</h1>
          <p className="text-xs text-slate-400 mt-1">
            Génération automatique, numérotation séquentielle FAC-2026-XXXX, impression A4 & Ticket thermique, signature numérique QR code.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800 border border-slate-700/80 px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-200">
            Total Factures : <span className="font-bold text-indigo-400 font-mono">{invoices.length}</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par N° Facture (FAC-2026-...), Client, Téléphone, Réf transaction..."
            className="w-full bg-slate-800 text-slate-100 placeholder-slate-400 text-xs rounded-xl pl-10 pr-4 py-2.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 ml-2" />
          <select
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            className="bg-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none"
          >
            <option value="all">Tous les statuts</option>
            <option value="valid">Valides uniquement</option>
            <option value="cancelled">Annulées uniquement</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-4">N° Facture</th>
                <th className="p-4">Date & Heure</th>
                <th className="p-4">Client</th>
                <th className="p-4">Abonnement</th>
                <th className="p-4">Mode & Réf</th>
                <th className="p-4 text-right">Montant Payé</th>
                <th className="p-4 text-center">Statut</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                  
                  {/* N° Facture */}
                  <td className="p-4 font-mono font-bold text-indigo-400 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-500" />
                    {inv.invoiceNumber}
                  </td>

                  {/* Date */}
                  <td className="p-4 text-slate-300">
                    <div>{inv.createdAt.split('T')[0]}</div>
                    <div className="text-[10px] text-slate-400">{inv.createdAt.split('T')[1]?.slice(0, 5)}</div>
                  </td>

                  {/* Client */}
                  <td className="p-4">
                    <div className="font-bold text-slate-200">{inv.clientName}</div>
                    <div className="text-[11px] text-slate-400">📞 {inv.clientPhone}</div>
                  </td>

                  {/* Subscription */}
                  <td className="p-4 text-slate-300">
                    <div className="font-medium text-slate-200">Pack {inv.subscriptionType}</div>
                    <div className="text-[10px] text-slate-400">{inv.startDate} au {inv.endDate}</div>
                  </td>

                  {/* Payment Mode & Transaction Ref */}
                  <td className="p-4">
                    <div className="font-semibold text-slate-200">{inv.paymentMode}</div>
                    <div className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20 inline-block">
                      {inv.transactionRef}
                    </div>
                  </td>

                  {/* Montant Payé */}
                  <td className="p-4 text-right font-mono font-bold text-emerald-400 text-sm">
                    {formatAriary(inv.totalPaid)}
                    {inv.balanceDue > 0 && (
                      <div className="text-[10px] text-rose-400 font-normal">
                        Reste : {formatAriary(inv.balanceDue)}
                      </div>
                    )}
                  </td>

                  {/* Statut */}
                  <td className="p-4 text-center">
                    {inv.status === 'valid' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> Valide
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full font-bold text-[10px]" title={inv.cancelReason}>
                        <Ban className="w-3 h-3" /> Annulée
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="p-2 rounded-xl bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white border border-indigo-500/20 transition-all"
                        title="Prévisualiser / Imprimer / Télécharger PDF"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {inv.status === 'valid' && (
                        <button
                          onClick={() => setCancelModalInvoice(inv)}
                          className="p-2 rounded-xl bg-rose-600/10 text-rose-400 hover:bg-rose-600 hover:text-white border border-rose-500/20 transition-all"
                          title="Annuler la facture (Traçable)"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancel Invoice Modal */}
      {cancelModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Ban className="w-5 h-5 text-rose-500" />
              Annuler la Facture {cancelModalInvoice.invoiceNumber}
            </h3>
            <p className="text-xs text-slate-300">
              Veuillez indiquer le motif d'annulation. Cette action restera enregistrée de façon inaltérable dans le journal d'audit.
            </p>

            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Ex: Erreur de saisie de la référence MVola, paiement remboursé..."
              rows={3}
              className="w-full bg-slate-800 text-slate-100 text-xs p-3 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setCancelModalInvoice(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Fermer
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={!cancelReason.trim()}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-500 disabled:opacity-50"
              >
                Confirmer l'annulation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
