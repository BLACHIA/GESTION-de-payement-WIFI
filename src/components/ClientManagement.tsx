import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Client, ClientStatus } from '../types';
import {
  Users, Search, Filter, Plus, Edit3, Trash2, RotateCcw, Wifi, Lock,
  Phone, MapPin, Eye, CheckCircle2, PauseCircle, XCircle, AlertCircle, KeyRound, Globe
} from 'lucide-react';

export const ClientManagement: React.FC<{
  onOpenNewClient: () => void;
  onOpenNewPaymentForClient: (client: Client) => void;
}> = ({ onOpenNewClient, onOpenNewPaymentForClient }) => {
  const { clients, updateClient, deleteClient, restoreClient, globalSearch, setGlobalSearch, selectedFilter, setSelectedFilter, wifiPoints, settings } = useData();

  const [selectedClientForDetails, setSelectedClientForDetails] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const formatAriary = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' ' + (settings.currency || 'Ar');
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Smart Filter options
  const filterOptions = [
    { id: 'all', label: 'Tous les clients' },
    { id: 'active', label: 'Actifs' },
    { id: 'suspended', label: 'Suspendus' },
    { id: 'expired', label: 'Expirés' },
    { id: 'due_today', label: 'Expire aujourd\'hui' },
    { id: 'expiring_soon', label: 'Expire sous 3j' },
    { id: 'unpaid', label: 'Avec dettes' },
    { id: 'trash', label: 'Corbeille (Supprimés)' }
  ];

  // Filter clients logic
  const filteredClients = clients.filter(client => {
    // Trash bin logic
    if (selectedFilter === 'trash') return client.isDeleted;
    if (client.isDeleted) return false;

    // Search query logic
    const query = globalSearch.toLowerCase();
    const matchSearch =
      client.nom.toLowerCase().includes(query) ||
      client.prenom.toLowerCase().includes(query) ||
      client.telephone.includes(query) ||
      client.adresse.toLowerCase().includes(query) ||
      client.quartier.toLowerCase().includes(query) ||
      client.networkInfo.ip.includes(query) ||
      client.networkInfo.mac.toLowerCase().includes(query);

    if (!matchSearch) return false;

    // Filter logic
    if (selectedFilter === 'active') return client.status === 'actif';
    if (selectedFilter === 'suspended') return client.status === 'suspendu';
    if (selectedFilter === 'expired') return client.status === 'resilie' || (client.subscriptionEndDate && client.subscriptionEndDate < todayStr);
    if (selectedFilter === 'due_today') return client.subscriptionEndDate === todayStr;
    if (selectedFilter === 'unpaid') return (client.balanceDue || 0) > 0;

    return true;
  });

  // Save client edits
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      updateClient(editingClient.id, editingClient);
      setEditingClient(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            <Users className="w-3.5 h-3.5" />
            Gestion Administrative & Technique des Clients
          </div>
          <h1 className="text-2xl font-extrabold text-white">Répertoire des Abonnés Wi-Fi</h1>
          <p className="text-xs text-slate-400 mt-1">
            Fiches clients, configuration réseau (IP, MAC, Wi-Fi, PPPoE), statut d'abonnement et dettes.
          </p>
        </div>

        <button
          onClick={onOpenNewClient}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Ajouter un Client
        </button>
      </div>

      {/* Smart List Tabs Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filterOptions.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedFilter === filter.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Clients Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-4">Client</th>
                <th className="p-4">Quartier & Adresse</th>
                <th className="p-4">Info Réseau (IP / MAC)</th>
                <th className="p-4">Abonnement & Fin</th>
                <th className="p-4 text-center">Statut</th>
                <th className="p-4 text-right">Dette / Solde</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-800/40 transition-colors">
                  
                  {/* Client Name & Phone */}
                  <td className="p-4">
                    <div className="font-bold text-slate-100 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                        {client.nom[0]}
                      </div>
                      <div>
                        {client.nom} {client.prenom}
                        <div className="text-[10px] text-slate-400 font-mono">{client.id}</div>
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-500" /> {client.telephone}
                    </div>
                  </td>

                  {/* Quartier & Adresse */}
                  <td className="p-4 text-slate-300">
                    <div className="font-semibold text-slate-200">{client.quartier}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" /> {client.adresse}
                    </div>
                  </td>

                  {/* Info Réseau */}
                  <td className="p-4 font-mono text-[11px]">
                    <div className="text-cyan-400 font-bold flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {client.networkInfo.ip}
                    </div>
                    <div className="text-slate-400 text-[10px]">
                      MAC: {client.networkInfo.mac}
                    </div>
                    <div className="text-slate-500 text-[9px]">
                      Point: {client.networkInfo.routerName}
                    </div>
                  </td>

                  {/* Abonnement & Fin */}
                  <td className="p-4">
                    <div className="font-semibold text-indigo-300">
                      Pack {client.currentSubscriptionPlan || 'Mensuel'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Expire le : <span className="font-bold text-slate-200">{client.subscriptionEndDate || 'Non défini'}</span>
                    </div>
                  </td>

                  {/* Statut Toggle */}
                  <td className="p-4 text-center">
                    <button
                      onClick={() => {
                        const newStatus: ClientStatus = client.status === 'actif' ? 'suspendu' : 'actif';
                        updateClient(client.id, { status: newStatus });
                      }}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold text-[10px] transition-all ${
                        client.status === 'actif'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                          : client.status === 'suspendu'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {client.status === 'actif' && <CheckCircle2 className="w-3 h-3" />}
                      {client.status === 'suspendu' && <PauseCircle className="w-3 h-3" />}
                      {client.status === 'resilie' && <XCircle className="w-3 h-3" />}
                      <span className="capitalize">{client.status}</span>
                    </button>
                  </td>

                  {/* Dette / Solde */}
                  <td className="p-4 text-right font-mono font-bold">
                    {(client.balanceDue || 0) > 0 ? (
                      <span className="text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/20">
                        {formatAriary(client.balanceDue || 0)}
                      </span>
                    ) : (
                      <span className="text-emerald-400">À jour (0 Ar)</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      
                      {/* Encaisser rapide */}
                      <button
                        onClick={() => onOpenNewPaymentForClient(client)}
                        className="p-1.5 rounded-lg bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/20 transition-all"
                        title="Encaisser paiement pour ce client"
                      >
                        <Plus className="w-4 h-4" />
                      </button>

                      {/* Details Fiche Réseau */}
                      <button
                        onClick={() => setSelectedClientForDetails(client)}
                        className="p-1.5 rounded-lg bg-cyan-600/10 text-cyan-400 hover:bg-cyan-600 hover:text-white border border-cyan-500/20 transition-all"
                        title="Fiche technique & réseau complète"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Modifier */}
                      <button
                        onClick={() => setEditingClient(client)}
                        className="p-1.5 rounded-lg bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white border border-indigo-500/20 transition-all"
                        title="Modifier client"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Soft Delete / Restore */}
                      {client.isDeleted ? (
                        <button
                          onClick={() => restoreClient(client.id)}
                          className="p-1.5 rounded-lg bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/20 transition-all"
                          title="Restaurer de la corbeille"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => deleteClient(client.id)}
                          className="p-1.5 rounded-lg bg-rose-600/10 text-rose-400 hover:bg-rose-600 hover:text-white border border-rose-500/20 transition-all"
                          title="Placer dans la corbeille"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Technical Network Details Modal */}
      {selectedClientForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Wifi className="w-5 h-5 text-cyan-400" />
                  Fiche Réseau Client
                </h3>
                <p className="text-xs text-slate-400">{selectedClientForDetails.nom} {selectedClientForDetails.prenom} ({selectedClientForDetails.id})</p>
              </div>
              <button
                onClick={() => setSelectedClientForDetails(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px]">Adresse IP Fixe</span>
                <p className="font-mono font-bold text-cyan-400 text-sm">{selectedClientForDetails.networkInfo.ip}</p>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px]">Adresse MAC</span>
                <p className="font-mono font-bold text-slate-200">{selectedClientForDetails.networkInfo.mac}</p>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px]">Point d'Accès / Routeur</span>
                <p className="font-bold text-indigo-300">{selectedClientForDetails.networkInfo.routerName}</p>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px]">SSID Wi-Fi</span>
                <p className="font-bold text-slate-200">{selectedClientForDetails.networkInfo.ssid}</p>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px]">Mot de Passe Wi-Fi</span>
                <p className="font-mono font-bold text-emerald-400">{selectedClientForDetails.networkInfo.wifiPassword || 'Non spécifié'}</p>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px]">Appareils autorisés</span>
                <p className="font-bold text-slate-200">{selectedClientForDetails.networkInfo.maxDevices} appareils max</p>
              </div>
            </div>

            {selectedClientForDetails.networkInfo.pppoeLogin && (
              <div className="bg-indigo-950/40 border border-indigo-500/20 p-3 rounded-xl space-y-1 text-xs">
                <span className="text-indigo-300 font-bold flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5" /> Identifiants PPPoE
                </span>
                <p className="text-slate-300"><span className="font-semibold">Login:</span> <span className="font-mono text-cyan-300">{selectedClientForDetails.networkInfo.pppoeLogin}</span></p>
                <p className="text-slate-300"><span className="font-semibold">Pass:</span> <span className="font-mono text-cyan-300">{selectedClientForDetails.networkInfo.pppoePass}</span></p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedClientForDetails(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {editingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form onSubmit={handleSaveEdit} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white">Modifier le Client {editingClient.nom}</h3>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Nom</label>
                <input
                  type="text"
                  value={editingClient.nom}
                  onChange={(e) => setEditingClient({ ...editingClient, nom: e.target.value })}
                  className="w-full bg-slate-800 text-slate-100 p-2.5 rounded-xl border border-slate-700 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Prénom</label>
                <input
                  type="text"
                  value={editingClient.prenom}
                  onChange={(e) => setEditingClient({ ...editingClient, prenom: e.target.value })}
                  className="w-full bg-slate-800 text-slate-100 p-2.5 rounded-xl border border-slate-700 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Téléphone</label>
                <input
                  type="text"
                  value={editingClient.telephone}
                  onChange={(e) => setEditingClient({ ...editingClient, telephone: e.target.value })}
                  className="w-full bg-slate-800 text-slate-100 p-2.5 rounded-xl border border-slate-700 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Quartier</label>
                <input
                  type="text"
                  value={editingClient.quartier}
                  onChange={(e) => setEditingClient({ ...editingClient, quartier: e.target.value })}
                  className="w-full bg-slate-800 text-slate-100 p-2.5 rounded-xl border border-slate-700 focus:outline-none"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="text-slate-400 block mb-1">Adresse exacte</label>
                <input
                  type="text"
                  value={editingClient.adresse}
                  onChange={(e) => setEditingClient({ ...editingClient, adresse: e.target.value })}
                  className="w-full bg-slate-800 text-slate-100 p-2.5 rounded-xl border border-slate-700 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Adresse IP Fixe</label>
                <input
                  type="text"
                  value={editingClient.networkInfo.ip}
                  onChange={(e) => setEditingClient({ ...editingClient, networkInfo: { ...editingClient.networkInfo, ip: e.target.value } })}
                  className="w-full bg-slate-800 text-slate-100 p-2.5 rounded-xl border border-slate-700 focus:outline-none font-mono"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Adresse MAC</label>
                <input
                  type="text"
                  value={editingClient.networkInfo.mac}
                  onChange={(e) => setEditingClient({ ...editingClient, networkInfo: { ...editingClient.networkInfo, mac: e.target.value } })}
                  className="w-full bg-slate-800 text-slate-100 p-2.5 rounded-xl border border-slate-700 focus:outline-none font-mono"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingClient(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
