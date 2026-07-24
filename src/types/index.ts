export type ClientStatus = 'actif' | 'suspendu' | 'resilie' | 'en_attente';

export interface NetworkInfo {
  ip: string;
  mac: string;
  routerId: string;
  routerName: string;
  ssid: string;
  wifiPassword?: string;
  pppoeLogin?: string;
  pppoePass?: string;
  maxDevices: number;
}

export interface Client {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  adresse: string;
  quartier: string;
  cin?: string;
  photo?: string;
  dateInscription: string;
  status: ClientStatus;
  networkInfo: NetworkInfo;
  currentSubscriptionPlan?: string;
  subscriptionEndDate?: string;
  balanceDue?: number;
  isDeleted?: boolean;
}

export type PlanType = 'Mensuel' | 'Hebdomadaire' | 'Journalier' | 'Personnalisé';

export interface Subscription {
  id: string;
  clientId: string;
  clientName: string;
  planType: PlanType;
  startDate: string;
  endDate: string;
  durationDays: number;
  price: number;
  status: 'actif' | 'expire' | 'suspendu';
  autoRenew: boolean;
  notes?: string;
}

export type PaymentMode = 'Espèces' | 'MVola' | 'Orange Money' | 'Airtel Money' | 'Virement';

export interface Payment {
  id: string;
  clientId: string;
  clientName: string;
  subscriptionId?: string;
  invoiceId?: string;
  invoiceNumber?: string;
  amountPaid: number;
  amountDue: number;
  totalAmount: number;
  discount: number;
  paymentDate: string;
  paymentTime: string;
  paymentMode: PaymentMode;
  reference: string;
  notes?: string;
  agentId: string;
  agentName: string;
  isPartial: boolean;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. FAC-2026-0001
  paymentId: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  clientQuartier: string;
  subscriptionType: string;
  durationDays: number;
  startDate: string;
  endDate: string;
  items: Array<{
    designation: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  discount: number;
  tax: number;
  totalPaid: number;
  balanceDue: number;
  paymentMode: PaymentMode;
  transactionRef: string;
  agentName: string;
  qrCodePayload: string;
  hashSignature: string;
  status: 'valid' | 'cancelled';
  cancelReason?: string;
  createdAt: string;
}

export type ExpenseCategory = 
  | 'Connexion Starlink (Fixe)'
  | 'Carburant'
  | 'Électricité'
  | 'Achat de câble'
  | 'Routeur'
  | 'Switch'
  | 'Connecteurs'
  | 'Main d\'œuvre'
  | 'Réparations'
  | 'Maintenance'
  | 'Autres';

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  isFixed: boolean;
  expenseDate: string;
  notes?: string;
  registeredBy: string;
}

export interface WifiPoint {
  id: string;
  name: string;
  location: string;
  ipRange: string;
  totalConnected: number;
  maxCapacity: number;
  status: 'online' | 'offline' | 'maintenance';
}

export interface CompanySettings {
  name: string;
  slogan: string;
  address: string;
  quartier: string;
  city: string;
  phone: string;
  email: string;
  socialMedia: string;
  currency: string;
  starlinkMonthlyFee: number;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  footerText: string;
  termsAndConditions: string;
  stampSignatureText: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'agent';
  token?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface DashboardMetrics {
  totalClients: number;
  activeClients: number;
  suspendedClients: number;
  expiredClients: number;
  newClientsThisMonth: number;
  revenueToday: number;
  revenueWeek: number;
  revenueMonth: number;
  totalRevenueEncashed: number;
  totalRemainingToCollect: number; // Customer debts
  clientsDueToday: number;
  clientsOverdue: number;
  clientsExpiringSoon: number;
  starlinkFixedFee: number;
  totalExpensesMonth: number;
  netProfitMonth: number;
  isProfitable: boolean;
  breakevenClientsNeeded: number;
}
