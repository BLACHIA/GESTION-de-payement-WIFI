import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Client, Subscription, Payment, Invoice, Expense, WifiPoint,
  CompanySettings, AuditLog, DashboardMetrics, PaymentMode, PlanType, ExpenseCategory
} from '../types';
import {
  initialClients, initialSubscriptions, initialPayments, initialInvoices,
  initialExpenses, initialWifiPoints, initialCompanySettings, initialAuditLogs
} from '../data/mockData';

interface DataContextType {
  clients: Client[];
  subscriptions: Subscription[];
  payments: Payment[];
  invoices: Invoice[];
  expenses: Expense[];
  wifiPoints: WifiPoint[];
  settings: CompanySettings;
  auditLogs: AuditLog[];
  metrics: DashboardMetrics;
  
  // Actions Clients
  addClient: (clientData: Omit<Client, 'id' | 'dateInscription' | 'status' | 'balanceDue'>) => Client;
  updateClient: (id: string, clientData: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  restoreClient: (id: string) => void;
  
  // Actions Abonnements & Paiements
  addPaymentAndInvoice: (data: {
    clientId: string;
    planType: PlanType;
    durationDays: number;
    totalAmount: number;
    amountPaid: number;
    discount?: number;
    paymentMode: PaymentMode;
    reference: string;
    notes?: string;
    agentName?: string;
  }) => { payment: Payment; invoice: Invoice };
  
  cancelInvoice: (invoiceId: string, reason: string) => void;
  
  // Actions Dépenses
  addExpense: (expenseData: { title: string; category: ExpenseCategory; amount: number; notes?: string }) => void;
  deleteExpense: (id: string) => void;
  
  // Actions Wifi Points
  addWifiPoint: (point: Omit<WifiPoint, 'id'>) => void;
  updateWifiPoint: (id: string, point: Partial<WifiPoint>) => void;
  
  // Paramètres & Audit
  updateSettings: (newSettings: Partial<CompanySettings>) => void;
  logAction: (action: string, details: string) => void;
  exportBackup: () => void;
  importBackup: (jsonString: string) => boolean;
  
  // Vue active et filtre de recherche globale
  activeTab: string;
  setActiveTab: (tab: string) => void;
  globalSearch: string;
  setGlobalSearch: (query: string) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  
  // Preview Modal Facture
  selectedInvoice: Invoice | null;
  setSelectedInvoice: (inv: Invoice | null) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // LocalStorage state initialization with fallback to initial data
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('starlink_clients');
    return saved ? JSON.parse(saved) : initialClients;
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem('starlink_subscriptions');
    return saved ? JSON.parse(saved) : initialSubscriptions;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('starlink_payments');
    return saved ? JSON.parse(saved) : initialPayments;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('starlink_invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('starlink_expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [wifiPoints, setWifiPoints] = useState<WifiPoint[]>(() => {
    const saved = localStorage.getItem('starlink_wifiPoints');
    return saved ? JSON.parse(saved) : initialWifiPoints;
  });

  const [settings, setSettings] = useState<CompanySettings>(() => {
    const saved = localStorage.getItem('starlink_settings');
    return saved ? JSON.parse(saved) : initialCompanySettings;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('starlink_auditLogs');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Sync state changes to localStorage
  useEffect(() => { localStorage.setItem('starlink_clients', JSON.stringify(clients)); }, [clients]);
  useEffect(() => { localStorage.setItem('starlink_subscriptions', JSON.stringify(subscriptions)); }, [subscriptions]);
  useEffect(() => { localStorage.setItem('starlink_payments', JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem('starlink_invoices', JSON.stringify(invoices)); }, [invoices]);
  useEffect(() => { localStorage.setItem('starlink_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('starlink_wifiPoints', JSON.stringify(wifiPoints)); }, [wifiPoints]);
  useEffect(() => { localStorage.setItem('starlink_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('starlink_auditLogs', JSON.stringify(auditLogs)); }, [auditLogs]);

  // Log action helper
  const logAction = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}`,
      userId: 'USR-001',
      userName: 'Admin System',
      action,
      details,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Add Client
  const addClient = (clientData: Omit<Client, 'id' | 'dateInscription' | 'status' | 'balanceDue'>): Client => {
    const newId = `CLI-${String(clients.length + 1).padStart(3, '0')}`;
    const newClient: Client = {
      ...clientData,
      id: newId,
      dateInscription: new Date().toISOString().split('T')[0],
      status: 'actif',
      balanceDue: 0,
      isDeleted: false
    };
    setClients(prev => [newClient, ...prev]);
    logAction('CREATION_CLIENT', `Nouveau client ajouté : ${newClient.nom} ${newClient.prenom} (${newId})`);
    return newClient;
  };

  // Update Client
  const updateClient = (id: string, clientData: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...clientData } : c));
    logAction('MODIFICATION_CLIENT', `Mise à jour du client ID ${id}`);
  };

  // Delete Client (Soft Delete - Corbeille)
  const deleteClient = (id: string) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, isDeleted: true, status: 'resilie' } : c));
    logAction('SUPPRESSION_CLIENT', `Client ID ${id} placé dans la corbeille`);
  };

  // Restore Client
  const restoreClient = (id: string) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, isDeleted: false, status: 'actif' } : c));
    logAction('RESTAURATION_CLIENT', `Client ID ${id} restauré de la corbeille`);
  };

  // Add Payment & Generate Invoice FAC-2026-XXXX
  const addPaymentAndInvoice = (data: {
    clientId: string;
    planType: PlanType;
    durationDays: number;
    totalAmount: number;
    amountPaid: number;
    discount?: number;
    paymentMode: PaymentMode;
    reference: string;
    notes?: string;
    agentName?: string;
  }) => {
    const client = clients.find(c => c.id === data.clientId);
    if (!client) throw new Error("Client introuvable");

    const discountVal = data.discount || 0;
    const finalPrice = data.totalAmount - discountVal;
    const balanceDue = Math.max(0, finalPrice - data.amountPaid);
    const isPartial = balanceDue > 0;

    const startDate = new Date().toISOString().split('T')[0];
    const end = new Date();
    end.setDate(end.getDate() + data.durationDays);
    const endDate = end.toISOString().split('T')[0];

    // 1. Subscription
    const subId = `SUB-${String(subscriptions.length + 1).padStart(3, '0')}`;
    const newSubscription: Subscription = {
      id: subId,
      clientId: client.id,
      clientName: `${client.nom} ${client.prenom}`,
      planType: data.planType,
      startDate,
      endDate,
      durationDays: data.durationDays,
      price: finalPrice,
      status: 'actif',
      autoRenew: true
    };
    setSubscriptions(prev => [newSubscription, ...prev]);

    // 2. Sequential Invoice Number
    const nextSeqNum = invoices.length + 1;
    const invoiceNumber = `FAC-${new Date().getFullYear()}-${String(nextSeqNum).padStart(4, '0')}`;
    const invoiceId = `INV-${String(nextSeqNum).padStart(3, '0')}`;

    // 3. Payment Record
    const payId = `PAY-${String(payments.length + 1).padStart(3, '0')}`;
    const nowTime = new Date().toTimeString().split(' ')[0];
    const newPayment: Payment = {
      id: payId,
      clientId: client.id,
      clientName: `${client.nom} ${client.prenom}`,
      subscriptionId: subId,
      invoiceId,
      invoiceNumber,
      amountPaid: data.amountPaid,
      amountDue: balanceDue,
      totalAmount: finalPrice,
      discount: discountVal,
      paymentDate: startDate,
      paymentTime: nowTime,
      paymentMode: data.paymentMode,
      reference: data.reference,
      notes: data.notes || '',
      agentId: 'USR-001',
      agentName: data.agentName || 'Admin System',
      isPartial
    };
    setPayments(prev => [newPayment, ...prev]);

    // 4. Invoice Record with QR Code Payload & Hash Signature
    const hashSignature = `SHA256-${Math.random().toString(36).substring(2, 12)}-${Date.now()}`;
    const qrCodePayload = `${invoiceNumber}|${client.id}|${data.amountPaid}|${startDate}|${hashSignature.slice(0, 10)}`;

    const newInvoice: Invoice = {
      id: invoiceId,
      invoiceNumber,
      paymentId: payId,
      clientId: client.id,
      clientName: `${client.nom} ${client.prenom}`,
      clientPhone: client.telephone,
      clientAddress: client.adresse,
      clientQuartier: client.quartier,
      subscriptionType: data.planType,
      durationDays: data.durationDays,
      startDate,
      endDate,
      items: [
        {
          designation: `Abonnement Wi-Fi Starlink - Pack ${data.planType} (${data.durationDays} Jours)`,
          quantity: 1,
          unitPrice: data.totalAmount,
          total: data.totalAmount
        }
      ],
      subtotal: data.totalAmount,
      discount: discountVal,
      tax: 0,
      totalPaid: data.amountPaid,
      balanceDue,
      paymentMode: data.paymentMode,
      transactionRef: data.reference,
      agentName: data.agentName || 'Admin System',
      qrCodePayload,
      hashSignature,
      status: 'valid',
      createdAt: new Date().toISOString()
    };
    setInvoices(prev => [newInvoice, ...prev]);

    // 5. Update client status & balance
    updateClient(client.id, {
      status: 'actif',
      currentSubscriptionPlan: data.planType,
      subscriptionEndDate: endDate,
      balanceDue
    });

    logAction('FACTURE_GENEREE', `Facture ${invoiceNumber} générée pour ${client.nom} (${data.amountPaid} Ar via ${data.paymentMode})`);

    return { payment: newPayment, invoice: newInvoice };
  };

  // Cancel Invoice (Immutable audit trail)
  const cancelInvoice = (invoiceId: string, reason: string) => {
    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: 'cancelled', cancelReason: reason } : inv));
    logAction('ANNULATION_FACTURE', `Facture ID ${invoiceId} annulée pour motif : ${reason}`);
  };

  // Add Expense
  const addExpense = (expenseData: { title: string; category: ExpenseCategory; amount: number; notes?: string }) => {
    const newExpense: Expense = {
      id: `EXP-${String(expenses.length + 1).padStart(3, '0')}`,
      title: expenseData.title,
      category: expenseData.category,
      amount: expenseData.amount,
      isFixed: expenseData.category === 'Connexion Starlink (Fixe)',
      expenseDate: new Date().toISOString().split('T')[0],
      notes: expenseData.notes || '',
      registeredBy: 'Admin'
    };
    setExpenses(prev => [newExpense, ...prev]);
    logAction('ENREGISTREMENT_DEPENSE', `Dépense enregistrée : ${newExpense.title} (${newExpense.amount} Ar)`);
  };

  // Delete Expense
  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    logAction('SUPPRESSION_DEPENSE', `Dépense supprimée ID ${id}`);
  };

  // Wifi Points
  const addWifiPoint = (point: Omit<WifiPoint, 'id'>) => {
    const newPoint: WifiPoint = {
      ...point,
      id: `WIFI-AP-${String(wifiPoints.length + 1).padStart(2, '0')}`
    };
    setWifiPoints(prev => [...prev, newPoint]);
  };

  const updateWifiPoint = (id: string, point: Partial<WifiPoint>) => {
    setWifiPoints(prev => prev.map(p => p.id === id ? { ...p, ...point } : p));
  };

  // Settings
  const updateSettings = (newSettings: Partial<CompanySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    logAction('MODIFICATION_PARAMETRES', 'Paramètres de l\'entreprise mis à jour');
  };

  // Export Backup JSON
  const exportBackup = () => {
    const backupData = {
      clients, subscriptions, payments, invoices, expenses, wifiPoints, settings, auditLogs,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `starlink_wifi_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    logAction('SAUVEGARDE_EXPORTEE', 'Sauvegarde complète exportée en fichier JSON');
  };

  // Import Backup JSON
  const importBackup = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.clients) setClients(data.clients);
      if (data.subscriptions) setSubscriptions(data.subscriptions);
      if (data.payments) setPayments(data.payments);
      if (data.invoices) setInvoices(data.invoices);
      if (data.expenses) setExpenses(data.expenses);
      if (data.wifiPoints) setWifiPoints(data.wifiPoints);
      if (data.settings) setSettings(data.settings);
      if (data.auditLogs) setAuditLogs(data.auditLogs);
      logAction('SAUVEGARDE_RESTAUREE', 'Données du système restaurées depuis un fichier de sauvegarde');
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // Calculate Real-time Dashboard Metrics
  const todayStr = new Date().toISOString().split('T')[0];
  const activeClientsCount = clients.filter(c => !c.isDeleted && c.status === 'actif').length;
  const suspendedClientsCount = clients.filter(c => !c.isDeleted && c.status === 'suspendu').length;
  const expiredClientsCount = clients.filter(c => !c.isDeleted && (c.status === 'resilie' || (c.subscriptionEndDate && c.subscriptionEndDate < todayStr))).length;
  const newClientsThisMonthCount = clients.filter(c => !c.isDeleted && c.dateInscription.startsWith(todayStr.slice(0, 7))).length;

  const revenueToday = payments.filter(p => p.paymentDate === todayStr).reduce((acc, p) => acc + p.amountPaid, 0);
  const revenueWeek = payments.reduce((acc, p) => acc + p.amountPaid, 0); // Simplified demo week calculation
  const revenueMonth = payments.reduce((acc, p) => acc + p.amountPaid, 0);
  const totalRevenueEncashed = payments.reduce((acc, p) => acc + p.amountPaid, 0);
  const totalRemainingToCollect = clients.filter(c => !c.isDeleted).reduce((acc, c) => acc + (c.balanceDue || 0), 0);

  const clientsDueToday = clients.filter(c => !c.isDeleted && c.subscriptionEndDate === todayStr).length;
  const clientsOverdue = clients.filter(c => !c.isDeleted && c.subscriptionEndDate && c.subscriptionEndDate < todayStr && c.status !== 'resilie').length;

  // Expiring in next 3 days
  const threeDaysLater = new Date();
  threeDaysLater.setDate(threeDaysLater.getDate() + 3);
  const threeDaysStr = threeDaysLater.toISOString().split('T')[0];
  const clientsExpiringSoon = clients.filter(c => !c.isDeleted && c.subscriptionEndDate && c.subscriptionEndDate > todayStr && c.subscriptionEndDate <= threeDaysStr).length;

  // Financial Expenses & Starlink Deduction
  const starlinkFee = settings.starlinkMonthlyFee || 140000;
  const variableExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalExpensesMonth = variableExpenses; // Total includes Starlink fee if in expenses
  const netProfitMonth = revenueMonth - totalExpensesMonth;
  const isProfitable = netProfitMonth >= 0;
  const averageClientPrice = 50000; // Average plan price
  const breakevenClientsNeeded = Math.ceil(totalExpensesMonth / averageClientPrice);

  const metrics: DashboardMetrics = {
    totalClients: clients.filter(c => !c.isDeleted).length,
    activeClients: activeClientsCount,
    suspendedClients: suspendedClientsCount,
    expiredClients: expiredClientsCount,
    newClientsThisMonth: newClientsThisMonthCount,
    revenueToday,
    revenueWeek,
    revenueMonth,
    totalRevenueEncashed,
    totalRemainingToCollect,
    clientsDueToday,
    clientsOverdue,
    clientsExpiringSoon,
    starlinkFixedFee: starlinkFee,
    totalExpensesMonth,
    netProfitMonth,
    isProfitable,
    breakevenClientsNeeded
  };

  return (
    <DataContext.Provider value={{
      clients, subscriptions, payments, invoices, expenses, wifiPoints, settings, auditLogs, metrics,
      addClient, updateClient, deleteClient, restoreClient,
      addPaymentAndInvoice, cancelInvoice,
      addExpense, deleteExpense,
      addWifiPoint, updateWifiPoint,
      updateSettings, logAction, exportBackup, importBackup,
      activeTab, setActiveTab, globalSearch, setGlobalSearch,
      selectedFilter, setSelectedFilter,
      selectedInvoice, setSelectedInvoice
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData context error');
  return context;
};
