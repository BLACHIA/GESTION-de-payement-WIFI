import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { UserPlus, X, Globe, Phone, MapPin, KeyRound, Wifi } from 'lucide-react';

export const NewClientModal: React.FC<{
  onClose: () => void;
  onSuccessOpenPayment?: (clientId: string) => void;
}> = ({ onClose, onSuccessOpenPayment }) => {
  const { addClient, wifiPoints } = useData();

  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');
  const [quartier, setQuartier] = useState('Ankorondrano');
  const [cin, setCin] = useState('');

  // Network Info
  const randomIp = `192.168.1.${Math.floor(Math.random() * 150) + 100}`;
  const randomMac = `00:1A:2B:${Math.floor(Math.random() * 90) + 10}:${Math.floor(Math.random() * 90) + 10}:${Math.floor(Math.random() * 90) + 10}`;

  const [ip, setIp] = useState(randomIp);
  const [mac, setMac] = useState(randomMac);
  const [routerName, setRouterName] = useState(wifiPoints[0]?.name || 'Starlink Main AP - Isotry');
  const [ssid, setSsid] = useState('Starlink_Wi-Fi_Client');
  const [wifiPassword, setWifiPassword] = useState('PassWifi2026!');
  const [pppoeLogin, setPppoeLogin] = useState('');
  const [pppoePass, setPppoePass] = useState('');
  const [maxDevices, setMaxDevices] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim() || !telephone.trim()) return;

    const newClient = addClient({
      nom: nom.toUpperCase(),
      prenom,
      telephone,
      adresse,
      quartier,
      cin,
      networkInfo: {
        ip,
        mac,
        routerId: 'AP-01',
        routerName,
        ssid,
        wifiPassword,
        pppoeLogin,
        pppoePass,
        maxDevices
      }
    });

    onClose();
    if (onSuccessOpenPayment) {
      onSuccessOpenPayment(newClient.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-indigo-400" />
              Nouveau Client Abonnée Wi-Fi
            </h2>
            <p className="text-xs text-slate-400">Enregistrement des coordonnées et de la fiche technique réseau</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Nom *</label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="ex: RAKOTO"
                className="w-full bg-slate-800 text-slate-100 p-3 rounded-xl border border-slate-700 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Prénom *</label>
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="ex: Jean Marc"
                className="w-full bg-slate-800 text-slate-100 p-3 rounded-xl border border-slate-700 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Téléphone *</label>
              <input
                type="text"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="ex: 034 12 345 67"
                className="w-full bg-slate-800 text-slate-100 p-3 rounded-xl border border-slate-700 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Quartier *</label>
              <input
                type="text"
                value={quartier}
                onChange={(e) => setQuartier(e.target.value)}
                placeholder="ex: Ankorondrano, Isotry..."
                className="w-full bg-slate-800 text-slate-100 p-3 rounded-xl border border-slate-700 focus:outline-none"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="text-slate-400 block mb-1">Adresse exacte</label>
              <input
                type="text"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                placeholder="ex: Lot II M 45, près Pharmacie"
                className="w-full bg-slate-800 text-slate-100 p-3 rounded-xl border border-slate-700 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Numéro CIN (Optionnel)</label>
              <input
                type="text"
                value={cin}
                onChange={(e) => setCin(e.target.value)}
                placeholder="ex: 101 234 567 890"
                className="w-full bg-slate-800 text-slate-100 p-3 rounded-xl border border-slate-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Point d'Accès Réseau</label>
              <select
                value={routerName}
                onChange={(e) => setRouterName(e.target.value)}
                className="w-full bg-slate-800 text-slate-100 p-3 rounded-xl border border-slate-700 focus:outline-none"
              >
                {wifiPoints.map((ap) => (
                  <option key={ap.id} value={ap.name}>{ap.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Network Info Subsection */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-cyan-400 flex items-center gap-2">
              <Globe className="w-4 h-4" /> Config Réseau & Connexion Client
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Adresse IP Fixe</label>
                <input
                  type="text"
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  className="w-full bg-slate-900 text-cyan-300 font-mono p-2.5 rounded-xl border border-slate-700 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Adresse MAC</label>
                <input
                  type="text"
                  value={mac}
                  onChange={(e) => setMac(e.target.value)}
                  className="w-full bg-slate-900 text-slate-200 font-mono p-2.5 rounded-xl border border-slate-700 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Mot de Passe Wi-Fi Client</label>
                <input
                  type="text"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  className="w-full bg-slate-900 text-emerald-400 font-mono p-2.5 rounded-xl border border-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Appareils autorisés</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={maxDevices}
                  onChange={(e) => setMaxDevices(Number(e.target.value))}
                  className="w-full bg-slate-900 text-slate-100 font-mono p-2.5 rounded-xl border border-slate-700 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              Créer le Client
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
