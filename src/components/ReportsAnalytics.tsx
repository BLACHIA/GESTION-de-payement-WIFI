import React from 'react';
import { useData } from '../context/DataContext';
import { BarChart3, Download, FileSpreadsheet, FileText, TrendingUp, DollarSign } from 'lucide-react';
import * as XLSX from 'xlsx';

export const ReportsAnalytics: React.FC = () => {
  const { payments, expenses, clients, metrics, settings } = useData();

  const formatAriary = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' ' + (settings.currency || 'Ar');
  };

  // Export to Excel XLSX
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Encaissements
    const paymentsData = payments.map(p => ({
      'Facture N°': p.invoiceNumber || 'N/A',
      'Date': p.paymentDate,
      'Client': p.clientName,
      'Montant Payé (Ar)': p.amountPaid,
      'Mode': p.paymentMode,
      'Référence': p.reference,
      'Agent': p.agentName
    }));
    const wsPayments = XLSX.utils.json_to_sheet(paymentsData);
    XLSX.utils.book_append_sheet(wb, wsPayments, 'Encaissements');

    // Sheet 2: Clients
    const clientsData = clients.map(c => ({
      'ID': c.id,
      'Nom': c.nom,
      'Prénom': c.prenom,
      'Téléphone': c.telephone,
      'Quartier': c.quartier,
      'Adresse IP': c.networkInfo.ip,
      'Statut': c.status,
      'Dette (Ar)': c.balanceDue || 0
    }));
    const wsClients = XLSX.utils.json_to_sheet(clientsData);
    XLSX.utils.book_append_sheet(wb, wsClients, 'Clients');

    // Sheet 3: Dépenses
    const expensesData = expenses.map(e => ({
      'Dépense': e.title,
      'Catégorie': e.category,
      'Montant (Ar)': e.amount,
      'Date': e.expenseDate
    }));
    const wsExpenses = XLSX.utils.json_to_sheet(expensesData);
    XLSX.utils.book_append_sheet(wb, wsExpenses, 'Dépenses');

    XLSX.writeFile(wb, `Rapport_Comptable_Starlink_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Export CSV
  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,N° Facture,Date,Client,Montant Paye,Mode,Reference\n";
    payments.forEach(p => {
      csvContent += `${p.invoiceNumber || ''},${p.paymentDate},"${p.clientName}",${p.amountPaid},${p.paymentMode},${p.reference}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rapport_Paiements_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            Comptabilité & Rapports Financiers
          </div>
          <h1 className="text-2xl font-extrabold text-white">Bilan & Exports des Données</h1>
          <p className="text-xs text-slate-400 mt-1">
            Génération de rapports d'activité en Excel (XLSX), CSV et PDF haute résolution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Exporter Excel (.xlsx)
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            Exporter CSV
          </button>
        </div>
      </div>

      {/* Accounting Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl space-y-1">
          <span className="text-slate-400">Total Chiffre d'Affaires</span>
          <div className="text-xl font-bold font-mono text-emerald-400">{formatAriary(metrics.totalRevenueEncashed)}</div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl space-y-1">
          <span className="text-slate-400">Dépense Fixe Starlink</span>
          <div className="text-xl font-bold font-mono text-amber-400">-{formatAriary(metrics.starlinkFixedFee)}</div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl space-y-1">
          <span className="text-slate-400">Dépenses Variables</span>
          <div className="text-xl font-bold font-mono text-amber-400">-{formatAriary(metrics.totalExpensesMonth)}</div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl space-y-1">
          <span className="text-slate-400">Bénéfice Net Réel</span>
          <div className={`text-xl font-bold font-mono ${metrics.isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatAriary(metrics.netProfitMonth)}
          </div>
        </div>
      </div>

    </div>
  );
};
