import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Settings, Shield, Save, Download, Upload, Radio, FileText, CheckCircle2 } from 'lucide-react';

export const SettingsSecurity: React.FC = () => {
  const { settings, updateSettings, auditLogs, exportBackup, importBackup } = useData();

  const [companySettings, setCompanySettings] = useState(settings);
  const [importJsonText, setImportJsonText] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(companySettings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleImport = () => {
    if (!importJsonText.trim()) return;
    const ok = importBackup(importJsonText);
    if (ok) {
      alert("Données restaurées avec succès !");
      setImportJsonText('');
    } else {
      alert("Erreur lors de l'importation du fichier de sauvegarde.");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold px-3 py-1 rounded-full mb-2">
          <Settings className="w-3.5 h-3.5" />
          Paramètres Entreprise & Sécurité
        </div>
        <h1 className="text-2xl font-extrabold text-white">Personnalisation & Journal d'Audit</h1>
        <p className="text-xs text-slate-400 mt-1">
          Configuration des informations d'entreprise sur les factures, tarif Starlink, rôles et sauvegardes.
        </p>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSaveSettings} className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
        <h2 className="text-sm font-bold text-slate-100">Informations Entreprise (Affichées sur les Factures)</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Nom de l'Entreprise / ISP</label>
            <input
              type="text"
              value={companySettings.name}
              onChange={(e) => setCompanySettings({ ...companySettings, name: e.target.value })}
              className="w-full bg-slate-800 text-slate-100 p-3 rounded-xl border border-slate-700 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Slogan</label>
            <input
              type="text"
              value={companySettings.slogan}
              onChange={(e) => setCompanySettings({ ...companySettings, slogan: e.target.value })}
              className="w-full bg-slate-800 text-slate-100 p-3 rounded-xl border border-slate-700 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Adresse Siège</label>
            <input
              type="text"
              value={companySettings.address}
              onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
              className="w-full bg-slate-800 text-slate-100 p-3 rounded-xl border border-slate-700 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Téléphones Support</label>
            <input
              type="text"
              value={companySettings.phone}
              onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })}
              className="w-full bg-slate-800 text-slate-100 p-3 rounded-xl border border-slate-700 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Email Support</label>
            <input
              type="email"
              value={companySettings.email}
              onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
              className="w-full bg-slate-800 text-slate-100 p-3 rounded-xl border border-slate-700 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Tarif Fixe Mensuel Starlink (Ar)</label>
            <input
              type="number"
              value={companySettings.starlinkMonthlyFee}
              onChange={(e) => setCompanySettings({ ...companySettings, starlinkMonthlyFee: Number(e.target.value) })}
              className="w-full bg-slate-800 text-amber-400 font-mono font-bold p-3 rounded-xl border border-slate-700 focus:outline-none"
              required
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          {saveSuccess ? (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Paramètres enregistrés avec succès !
            </span>
          ) : <span />}

          <button
            type="submit"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            Enregistrer les modifications
          </button>
        </div>
      </form>

      {/* Backup & Restore Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Export Backup */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-3 shadow-xl">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-400" />
            Sauvegarde Automatique des Données
          </h3>
          <p className="text-xs text-slate-400">
            Téléchargez l'intégralité de la base de données (clients, abonnements, factures, dépenses) au format JSON.
          </p>
          <button
            onClick={exportBackup}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
          >
            <Download className="w-4 h-4" />
            Télécharger le fichier de sauvegarde JSON
          </button>
        </div>

        {/* Import Backup */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-3 shadow-xl">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Upload className="w-4 h-4 text-indigo-400" />
            Restauration des Données
          </h3>
          <textarea
            value={importJsonText}
            onChange={(e) => setImportJsonText(e.target.value)}
            placeholder="Collez ici le contenu du fichier JSON de sauvegarde pour restaurer..."
            rows={3}
            className="w-full bg-slate-800 text-slate-100 text-xs p-3 rounded-xl border border-slate-700 focus:outline-none"
          />
          <button
            onClick={handleImport}
            disabled={!importJsonText.trim()}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            Restaurer les données
          </button>
        </div>

      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 font-bold text-slate-200 text-xs flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          Journal d'Audit & Sécurité (Audit Trail Inaltérable)
        </div>
        <div className="divide-y divide-slate-800 text-xs max-h-60 overflow-y-auto">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3 flex items-center justify-between gap-4 hover:bg-slate-800/40">
              <div>
                <div className="font-bold text-slate-200">{log.action}</div>
                <div className="text-[11px] text-slate-400">{log.details}</div>
              </div>
              <div className="text-right text-[10px] text-slate-400 font-mono">
                {log.userName} • {log.timestamp.replace('T', ' ').slice(0, 16)}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
