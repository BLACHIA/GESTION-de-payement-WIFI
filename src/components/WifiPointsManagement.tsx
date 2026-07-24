import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Radio, Plus, CheckCircle2, AlertTriangle, Users, MapPin, Globe } from 'lucide-react';

export const WifiPointsManagement: React.FC = () => {
  const { wifiPoints, addWifiPoint, updateWifiPoint } = useData();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [ipRange, setIpRange] = useState('192.168.4.100 - 192.168.4.200');
  const [maxCapacity, setMaxCapacity] = useState(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addWifiPoint({
      name,
      location,
      ipRange,
      totalConnected: 0,
      maxCapacity,
      status: 'online'
    });

    setName('');
    setLocation('');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl">
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold px-3 py-1 rounded-full mb-2">
          <Radio className="w-3.5 h-3.5" />
          Multi-Points Wi-Fi & Hotspots
        </div>
        <h1 className="text-2xl font-extrabold text-white">Gestion des Points d'Accès Réseau</h1>
        <p className="text-xs text-slate-400 mt-1">
          Supervision des émetteurs Wi-Fi, routeurs et répartiteurs dans les différents quartiers.
        </p>
      </div>

      {/* Grid of Wifi APs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {wifiPoints.map((ap) => (
          <div key={ap.id} className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl space-y-3 shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-white text-sm">{ap.name}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-indigo-400" /> {ap.location}
                </p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                ap.status === 'online' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {ap.status}
              </span>
            </div>

            <div className="text-xs space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Plage IP :</span>
                <span className="font-mono text-cyan-300">{ap.ipRange}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Connectés actuels :</span>
                <span className="font-bold">{ap.totalConnected} / {ap.maxCapacity} clients</span>
              </div>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-cyan-400 h-full rounded-full"
                style={{ width: `${Math.min(100, (ap.totalConnected / ap.maxCapacity) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Form Add Wifi AP */}
      <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Plus className="w-4 h-4 text-indigo-400" />
          Ajouter un nouveau Point d'Accès Wi-Fi / Hotspot
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Nom du Routeur / AP</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Starlink AP - 67Ha North"
              className="w-full bg-slate-800 text-slate-100 p-3 rounded-xl border border-slate-700 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Emplacement / Quartier</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="ex: 67Ha Sud batiment 12"
              className="w-full bg-slate-800 text-slate-100 p-3 rounded-xl border border-slate-700 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Capacité Max Clients</label>
            <input
              type="number"
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(Number(e.target.value))}
              className="w-full bg-slate-800 text-slate-100 font-mono font-bold p-3 rounded-xl border border-slate-700 focus:outline-none"
              required
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Créer le point d'accès
          </button>
        </div>
      </form>

    </div>
  );
};
