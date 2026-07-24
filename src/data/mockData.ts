import { Client, Subscription, Payment, Invoice, Expense, WifiPoint, CompanySettings, AuditLog } from '../types';

export const initialCompanySettings: CompanySettings = {
  name: 'MADAGASCAR STARLINK WI-FI (ISP)',
  slogan: 'Internet Très Haut Débit par Satellite partout à Madagascar',
  address: 'Lot IVG 123 B Bis, Ankorondrano',
  quartier: 'Ankorondrano',
  city: 'Antananarivo 101',
  phone: '+261 34 00 123 45 / +261 38 11 987 65',
  email: 'contact@starlink-wifi.mg',
  socialMedia: 'Facebook: Starlink Wifi Mada | WhatsApp: +261 34 00 123 45',
  currency: 'Ar',
  starlinkMonthlyFee: 140000,
  logoUrl: '',
  primaryColor: '#4f46e5',
  secondaryColor: '#00e5ff',
  footerText: 'Merci pour votre confiance. En cas de problème de connexion, contactez notre support 7j/7 au +261 34 00 123 45.',
  termsAndConditions: 'Toute période commencée est due. L\'accès est automatiquement réactivé après validation de la référence MVola / Orange Money / Airtel Money.',
  stampSignatureText: 'Direction Générale - Certifié Conforme'
};

export const initialClients: Client[] = [
  {
    id: 'CLI-001',
    nom: 'RAKOTO',
    prenom: 'Jean Marc',
    telephone: '034 12 345 67',
    adresse: 'Lot II M 45, Isotry',
    quartier: 'Isotry',
    cin: '101 234 567 890',
    dateInscription: '2026-06-01',
    status: 'actif',
    networkInfo: {
      ip: '192.168.1.101',
      mac: '4A:8B:9C:1D:2E:3F',
      routerId: 'WIFI-AP-01',
      routerName: 'Starlink Main AP - Isotry',
      ssid: 'Starlink_HighSpeed_Isotry',
      wifiPassword: 'PassWifi2026!',
      pppoeLogin: 'rakoto_pppoe',
      pppoePass: 'pppoe123',
      maxDevices: 4
    },
    currentSubscriptionPlan: 'Mensuel',
    subscriptionEndDate: '2026-08-01',
    balanceDue: 0
  },
  {
    id: 'CLI-002',
    nom: 'RASOA',
    prenom: 'Hery Nirina',
    telephone: '032 98 765 43',
    adresse: 'Lot IVG 89, Ankorondrano',
    quartier: 'Ankorondrano',
    cin: '101 876 543 210',
    dateInscription: '2026-06-15',
    status: 'actif',
    networkInfo: {
      ip: '192.168.1.102',
      mac: '5B:9C:0D:2E:3F:4A',
      routerId: 'WIFI-AP-02',
      routerName: 'Starlink AP - Ankorondrano',
      ssid: 'Starlink_Ankorondrano',
      wifiPassword: 'PassWifi2026!',
      maxDevices: 2
    },
    currentSubscriptionPlan: 'Mensuel',
    subscriptionEndDate: '2026-07-26',
    balanceDue: 0
  },
  {
    id: 'CLI-003',
    nom: 'ANDRIANARIVO',
    prenom: 'Tanjona Faly',
    telephone: '033 55 443 21',
    adresse: 'Logement 14, 67Ha Sud',
    quartier: '67Ha',
    cin: '101 555 444 333',
    dateInscription: '2026-07-01',
    status: 'actif',
    networkInfo: {
      ip: '192.168.1.103',
      mac: '6C:0D:1E:3F:4A:5B',
      routerId: 'WIFI-AP-01',
      routerName: 'Starlink Main AP - Isotry',
      ssid: 'Starlink_67Ha',
      wifiPassword: 'PassWifi2026!',
      maxDevices: 5
    },
    currentSubscriptionPlan: 'Mensuel',
    subscriptionEndDate: '2026-07-24', // Expiring soon (tomorrow)
    balanceDue: 10000 // Partial payment debt
  },
  {
    id: 'CLI-004',
    nom: 'RAMAROSON',
    prenom: 'Fitia Kanto',
    telephone: '038 77 123 99',
    adresse: 'Enceinte Star, Talatamaty',
    quartier: 'Talatamaty',
    cin: '101 999 888 777',
    dateInscription: '2026-05-10',
    status: 'suspendu',
    networkInfo: {
      ip: '192.168.1.104',
      mac: '7D:1E:2F:4A:5B:6C',
      routerId: 'WIFI-AP-03',
      routerName: 'Starlink AP - Talatamaty',
      ssid: 'Starlink_Talatamaty',
      wifiPassword: 'PassWifi2026!',
      maxDevices: 3
    },
    currentSubscriptionPlan: 'Mensuel',
    subscriptionEndDate: '2026-07-20', // Expired 3 days ago
    balanceDue: 40000
  },
  {
    id: 'CLI-005',
    nom: 'RABEMANANJARA',
    prenom: 'Arnaud',
    telephone: '034 50 607 08',
    adresse: 'Villa Rose, Ivandry',
    quartier: 'Ivandry',
    cin: '101 111 222 333',
    dateInscription: '2026-07-23',
    status: 'actif',
    networkInfo: {
      ip: '192.168.1.105',
      mac: '8E:2F:3A:5B:6C:7D',
      routerId: 'WIFI-AP-02',
      routerName: 'Starlink AP - Ankorondrano',
      ssid: 'Starlink_Ivandry_VIP',
      wifiPassword: 'PassWifiVIP2026!',
      maxDevices: 8
    },
    currentSubscriptionPlan: 'Mensuel',
    subscriptionEndDate: '2026-08-23',
    balanceDue: 0
  }
];

export const initialSubscriptions: Subscription[] = [
  {
    id: 'SUB-001',
    clientId: 'CLI-001',
    clientName: 'RAKOTO Jean Marc',
    planType: 'Mensuel',
    startDate: '2026-07-01',
    endDate: '2026-08-01',
    durationDays: 31,
    price: 50000,
    status: 'actif',
    autoRenew: true
  },
  {
    id: 'SUB-002',
    clientId: 'CLI-002',
    clientName: 'RASOA Hery Nirina',
    planType: 'Mensuel',
    startDate: '2026-06-26',
    endDate: '2026-07-26',
    durationDays: 30,
    price: 50000,
    status: 'actif',
    autoRenew: true
  },
  {
    id: 'SUB-003',
    clientId: 'CLI-003',
    clientName: 'ANDRIANARIVO Tanjona Faly',
    planType: 'Mensuel',
    startDate: '2026-06-24',
    endDate: '2026-07-24',
    durationDays: 30,
    price: 40000,
    status: 'actif',
    autoRenew: false
  },
  {
    id: 'SUB-004',
    clientId: 'CLI-004',
    clientName: 'RAMAROSON Fitia Kanto',
    planType: 'Mensuel',
    startDate: '2026-06-20',
    endDate: '2026-07-20',
    durationDays: 30,
    price: 40000,
    status: 'expire',
    autoRenew: false
  },
  {
    id: 'SUB-005',
    clientId: 'CLI-005',
    clientName: 'RABEMANANJARA Arnaud',
    planType: 'Mensuel',
    startDate: '2026-07-23',
    endDate: '2026-08-23',
    durationDays: 31,
    price: 100000,
    status: 'actif',
    autoRenew: true
  }
];

export const initialPayments: Payment[] = [
  {
    id: 'PAY-001',
    clientId: 'CLI-001',
    clientName: 'RAKOTO Jean Marc',
    subscriptionId: 'SUB-001',
    invoiceId: 'INV-001',
    invoiceNumber: 'FAC-2026-0001',
    amountPaid: 50000,
    amountDue: 0,
    totalAmount: 50000,
    discount: 0,
    paymentDate: '2026-07-01',
    paymentTime: '09:15:22',
    paymentMode: 'MVola',
    reference: 'MV-982347102',
    notes: 'Paiement abonnement mensuel juillet',
    agentId: 'USR-001',
    agentName: 'Admin System',
    isPartial: false
  },
  {
    id: 'PAY-002',
    clientId: 'CLI-002',
    clientName: 'RASOA Hery Nirina',
    subscriptionId: 'SUB-002',
    invoiceId: 'INV-002',
    invoiceNumber: 'FAC-2026-0002',
    amountPaid: 50000,
    amountDue: 0,
    totalAmount: 50000,
    discount: 0,
    paymentDate: '2026-06-26',
    paymentTime: '14:30:00',
    paymentMode: 'Orange Money',
    reference: 'OM-54129841',
    notes: 'Paiement intégral',
    agentId: 'USR-001',
    agentName: 'Admin System',
    isPartial: false
  },
  {
    id: 'PAY-003',
    clientId: 'CLI-003',
    clientName: 'ANDRIANARIVO Tanjona Faly',
    subscriptionId: 'SUB-003',
    invoiceId: 'INV-003',
    invoiceNumber: 'FAC-2026-0003',
    amountPaid: 30000,
    amountDue: 10000,
    totalAmount: 40000,
    discount: 0,
    paymentDate: '2026-06-24',
    paymentTime: '11:05:44',
    paymentMode: 'Espèces',
    reference: 'CASH-20260624',
    notes: 'Paiement partiel (acompte 30k Ar - reste 10k Ar)',
    agentId: 'USR-001',
    agentName: 'Admin System',
    isPartial: true
  },
  {
    id: 'PAY-004',
    clientId: 'CLI-005',
    clientName: 'RABEMANANJARA Arnaud',
    subscriptionId: 'SUB-005',
    invoiceId: 'INV-004',
    invoiceNumber: 'FAC-2026-0004',
    amountPaid: 100000,
    amountDue: 0,
    totalAmount: 100000,
    discount: 0,
    paymentDate: '2026-07-23',
    paymentTime: '16:45:10',
    paymentMode: 'Airtel Money',
    reference: 'AM-99887711',
    notes: 'Abonnement VIP Starlink 100k Ar',
    agentId: 'USR-001',
    agentName: 'Admin System',
    isPartial: false
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'INV-001',
    invoiceNumber: 'FAC-2026-0001',
    paymentId: 'PAY-001',
    clientId: 'CLI-001',
    clientName: 'RAKOTO Jean Marc',
    clientPhone: '034 12 345 67',
    clientAddress: 'Lot II M 45, Isotry',
    clientQuartier: 'Isotry',
    subscriptionType: 'Mensuel',
    durationDays: 31,
    startDate: '2026-07-01',
    endDate: '2026-08-01',
    items: [
      {
        designation: 'Abonnement Wi-Fi Starlink - Pack Familial (30 Jours)',
        quantity: 1,
        unitPrice: 50000,
        total: 50000
      }
    ],
    subtotal: 50000,
    discount: 0,
    tax: 0,
    totalPaid: 50000,
    balanceDue: 0,
    paymentMode: 'MVola',
    transactionRef: 'MV-982347102',
    agentName: 'Admin System',
    qrCodePayload: 'FAC-2026-0001|CLI-001|50000|2026-07-01|SIG-a9f82d1',
    hashSignature: 'SHA256-a9f82d1c7e6b5a4f3e2d1c0b9a8f7e6d',
    status: 'valid',
    createdAt: '2026-07-01T09:15:22.000Z'
  },
  {
    id: 'INV-002',
    invoiceNumber: 'FAC-2026-0002',
    paymentId: 'PAY-002',
    clientId: 'CLI-002',
    clientName: 'RASOA Hery Nirina',
    clientPhone: '032 98 765 43',
    clientAddress: 'Lot IVG 89, Ankorondrano',
    clientQuartier: 'Ankorondrano',
    subscriptionType: 'Mensuel',
    durationDays: 30,
    startDate: '2026-06-26',
    endDate: '2026-07-26',
    items: [
      {
        designation: 'Abonnement Wi-Fi Starlink - Pack Standard (30 Jours)',
        quantity: 1,
        unitPrice: 50000,
        total: 50000
      }
    ],
    subtotal: 50000,
    discount: 0,
    tax: 0,
    totalPaid: 50000,
    balanceDue: 0,
    paymentMode: 'Orange Money',
    transactionRef: 'OM-54129841',
    agentName: 'Admin System',
    qrCodePayload: 'FAC-2026-0002|CLI-002|50000|2026-06-26|SIG-b8e71c2',
    hashSignature: 'SHA256-b8e71c2d6e5a4f3e2d1c0b9a8f7e6d5',
    status: 'valid',
    createdAt: '2026-06-26T14:30:00.000Z'
  },
  {
    id: 'INV-003',
    invoiceNumber: 'FAC-2026-0003',
    paymentId: 'PAY-003',
    clientId: 'CLI-003',
    clientName: 'ANDRIANARIVO Tanjona Faly',
    clientPhone: '033 55 443 21',
    clientAddress: 'Logement 14, 67Ha Sud',
    clientQuartier: '67Ha',
    subscriptionType: 'Mensuel',
    durationDays: 30,
    startDate: '2026-06-24',
    endDate: '2026-07-24',
    items: [
      {
        designation: 'Abonnement Wi-Fi Starlink - Pack Eco (30 Jours)',
        quantity: 1,
        unitPrice: 40000,
        total: 40000
      }
    ],
    subtotal: 40000,
    discount: 0,
    tax: 0,
    totalPaid: 30000,
    balanceDue: 10000,
    paymentMode: 'Espèces',
    transactionRef: 'CASH-20260624',
    agentName: 'Admin System',
    qrCodePayload: 'FAC-2026-0003|CLI-003|30000|2026-06-24|SIG-c7d60b3',
    hashSignature: 'SHA256-c7d60b3c5e4f3e2d1c0b9a8f7e6d5c4',
    status: 'valid',
    createdAt: '2026-06-24T11:05:44.000Z'
  },
  {
    id: 'INV-004',
    invoiceNumber: 'FAC-2026-0004',
    paymentId: 'PAY-004',
    clientId: 'CLI-005',
    clientName: 'RABEMANANJARA Arnaud',
    clientPhone: '034 50 607 08',
    clientAddress: 'Villa Rose, Ivandry',
    clientQuartier: 'Ivandry',
    subscriptionType: 'Mensuel',
    durationDays: 31,
    startDate: '2026-07-23',
    endDate: '2026-08-23',
    items: [
      {
        designation: 'Abonnement Wi-Fi Starlink - Pack Premium VIP',
        quantity: 1,
        unitPrice: 100000,
        total: 100000
      }
    ],
    subtotal: 100000,
    discount: 0,
    tax: 0,
    totalPaid: 100000,
    balanceDue: 0,
    paymentMode: 'Airtel Money',
    transactionRef: 'AM-99887711',
    agentName: 'Admin System',
    qrCodePayload: 'FAC-2026-0004|CLI-005|100000|2026-07-23|SIG-d6e5fa4',
    hashSignature: 'SHA256-d6e5fa4b3c2d1e0f9a8b7c6d5e4f3a2',
    status: 'valid',
    createdAt: '2026-07-23T16:45:10.000Z'
  }
];

export const initialExpenses: Expense[] = [
  {
    id: 'EXP-001',
    title: 'Abonnement Connexion Starlink (Juillet 2026)',
    category: 'Connexion Starlink (Fixe)',
    amount: 140000,
    isFixed: true,
    expenseDate: '2026-07-01',
    notes: 'Dépense fixe mensuelle obligatoire Starlink Madagascar',
    registeredBy: 'Système'
  },
  {
    id: 'EXP-002',
    title: 'Achat Rouleau Câble Ethernet Cat6 100m',
    category: 'Achat de câble',
    amount: 45000,
    isFixed: false,
    expenseDate: '2026-07-05',
    notes: 'Câblage clients quartier Isotry',
    registeredBy: 'Admin'
  },
  {
    id: 'EXP-003',
    title: 'Achat Switch TP-Link Gigabit 8 Ports',
    category: 'Switch',
    amount: 35000,
    isFixed: false,
    expenseDate: '2026-07-12',
    notes: 'Extension réseau Ankorondrano',
    registeredBy: 'Admin'
  },
  {
    id: 'EXP-004',
    title: 'Carburant Déplacement Groupe Électrogène',
    category: 'Carburant',
    amount: 25000,
    isFixed: false,
    expenseDate: '2026-07-18',
    notes: 'Carburant pour maintenance pendant délestage',
    registeredBy: 'Admin'
  }
];

export const initialWifiPoints: WifiPoint[] = [
  {
    id: 'WIFI-AP-01',
    name: 'Starlink Main AP - Isotry',
    location: 'Isotry Center - Batiment A',
    ipRange: '192.168.1.100 - 192.168.1.150',
    totalConnected: 18,
    maxCapacity: 30,
    status: 'online'
  },
  {
    id: 'WIFI-AP-02',
    name: 'Starlink AP - Ankorondrano',
    location: 'Ankorondrano près rond point',
    ipRange: '192.168.2.100 - 192.168.2.150',
    totalConnected: 12,
    maxCapacity: 25,
    status: 'online'
  },
  {
    id: 'WIFI-AP-03',
    name: 'Starlink AP - Talatamaty',
    location: 'Talatamaty station Joma',
    ipRange: '192.168.3.100 - 192.168.3.150',
    totalConnected: 8,
    maxCapacity: 20,
    status: 'online'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'LOG-001',
    userId: 'USR-001',
    userName: 'Admin System',
    action: 'CREATION_CLIENT',
    details: 'Création du client RABEMANANJARA Arnaud (CLI-005)',
    timestamp: '2026-07-23T16:40:00.000Z'
  },
  {
    id: 'LOG-002',
    userId: 'USR-001',
    userName: 'Admin System',
    action: 'PAIEMENT_FACTURE',
    details: 'Génération facture FAC-2026-0004 pour 100 000 Ar (Airtel Money)',
    timestamp: '2026-07-23T16:45:10.000Z'
  }
];
