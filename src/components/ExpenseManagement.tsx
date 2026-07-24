import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ExpenseCategory } from '../types';
import { TrendingDown, Plus, Trash2, ShieldAlert, DollarSign, Calculator, Radio, CheckCircle2 } from 'lucide-react';

export const ExpenseManagement: React.FC = () => {
  const { expenses, addExpense, deleteExpense, metrics, settings } = useData();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Carburant');
  const [amount, setAmount] = useState<number>(20000);
  const [notes, setNotes] = useState('');

  const formatAriary = (amountVal: number) => {
    return new Intl.NumberFormat('fr-FR').format(amountVal) + ' ' + (settings.currency || 'Ar');
  };

  const categoriesList: ExpenseCategory[] = [
    'Carburant',
    'Électricité',
    'Achat de câble',
    'Routeur',
    'Switch',
    'Connecteurs',
    'Main d\'œuvre',
    'Réparations',
    'Maintenance',
    'Autres'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amount <= 0) return;

    addExpense({ title, category, amount, notes });
    setTitle('');
    setAmount(20000);
    setNotes('');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            <TrendingDown className="w-3.5 h-3.5" />
            Gestion des Dépenses & Seuil de Rentabilité
          </div>
          <h1 className="text-2xl font-extrabold text-white">Dépenses Fixes & Variables Starlink</h1>
          <p className="text-xs text-slate-400 mt-1">
            Prise en compte obligatoire du forfait Starlink de 140 000 Ar / mois et déduction automatique du bénéfice réel.
          </p>
        </div>
      </div>

      {/* Mandatory Starlink Expense Card Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 p-6 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-lg">Abonnement Connexion Starlink (Fixe Obligatoire)</h2>
              <p className="text-xs text-slate-300">Déduit automatiquement chaque mois pour le calcul de rentabilité</p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-black text-amber-400 font-mono">
              -{formatAriary(settings.starlinkMonthlyFee)} /mois
            </div>
            <div className="text-[11px] text-slate-400">140 000 Ar fixe mensuel</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-amber-500/20 text-xs">
          <div>
            <span className="text-slate-400">Revenus Encaisssés du Mois :</span>
            <div className="font-mono font-bold text-emerald-400 text-base">{formatAriary(metrics.revenueMonth)}</div>
          </div>
          <div>
            <span className="text-slate-400">Total Dépenses Fixes & Variables :</span>
            <div className="font-mono font-bold text-amber-400 text-base">-{formatAriary(metrics.totalExpensesMonth)}</div>
          </div>
          <div>
            <span className="text-slate-400">Bénéfice Net Après Starlink :</span>
            <div className={`font-mono font-bold text-base ${metrics.isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatAriary(metrics.netProfitMonth)} ({metrics.isProfitable ? 'Rentable' : 'Déficitaire'})
            </div>
          </div>
        </div>
      </div>

      {/* Add New Variable Expense Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Plus className="w-4 h-4 text-indigo-400" />
          Enregistrer une Dépense Variable (Carburant, Câble, Matériel...)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Motif / Libellé de la dépense</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex: Achat rouleau câble Cat6 50m..."
              className="w-full bg-slate-800 text-slate-100 p-3 rounded-xl border border-slate-700 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Catégorie</label>
            <select
              value={category}
              onChange={(e: any) => setCategory(e.target.value)}
              className="w-full bg-slate-800 text-slate-100 p-3 rounded-xl border border-slate-700 focus:outline-none"
            >
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Montant (Ar)</label>
            <input
              type="number"
              min={100}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-slate-800 text-slate-100 font-mono font-bold p-3 rounded-xl border border-slate-700 focus:outline-none"
              required
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-amber-600/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Ajouter la dépense
          </button>
        </div>
      </form>

      {/* Expenses History Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 font-bold text-slate-200 text-xs">
          Historique Complet des Dépenses
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-4">Dépense</th>
                <th className="p-4">Catégorie</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Montant</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-200">{exp.title}</div>
                    {exp.notes && <div className="text-[10px] text-slate-400">{exp.notes}</div>}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      exp.isFixed ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {exp.category}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300 font-mono">{exp.expenseDate}</td>
                  <td className="p-4 text-right font-mono font-bold text-rose-400">
                    -{formatAriary(exp.amount)}
                  </td>
                  <td className="p-4 text-center">
                    {!exp.isFixed && (
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="p-1.5 rounded-lg bg-rose-600/10 text-rose-400 hover:bg-rose-600 hover:text-white transition-all"
                        title="Supprimer la dépense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
