import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Persistent File Database Path
const DB_FILE = path.resolve('server_database.json');

// Default initial state
const defaultDbData = {
  settings: {
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
    footerText: 'Merci pour votre confiance. En cas de problème de connexion, contactez notre support 7j/7 au +261 34 00 123 45.',
    termsAndConditions: 'Toute période commencée est due. L\'accès est automatiquement réactivé après validation de la référence MVola / Orange Money / Airtel Money.',
    stampSignatureText: 'Direction Générale - Certifié Conforme'
  },
  clients: [],
  subscriptions: [],
  payments: [],
  invoices: [],
  expenses: [
    {
      id: 'EXP-001',
      title: 'Abonnement Connexion Starlink (Fixe Mensuel)',
      category: 'Connexion Starlink (Fixe)',
      amount: 140000,
      isFixed: true,
      expenseDate: new Date().toISOString().split('T')[0],
      notes: 'Forfait fixe Starlink obligatoire',
      registeredBy: 'Système'
    }
  ],
  wifiPoints: [],
  auditLogs: []
};

// Helper load DB
function loadDb() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDbData, null, 2));
    return defaultDbData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return defaultDbData;
  }
}

// Helper save DB
function saveDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// REST API Endpoints

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), starlinkStatus: 'Online' });
});

// GET Metrics
app.get('/api/metrics', (req, res) => {
  const db = loadDb();
  const todayStr = new Date().toISOString().split('T')[0];

  const totalClients = db.clients.filter(c => !c.isDeleted).length;
  const activeClients = db.clients.filter(c => !c.isDeleted && c.status === 'actif').length;
  const suspendedClients = db.clients.filter(c => !c.isDeleted && c.status === 'suspendu').length;
  const expiredClients = db.clients.filter(c => !c.isDeleted && c.status === 'resilie').length;

  const revenueMonth = db.payments.reduce((acc, p) => acc + (p.amountPaid || 0), 0);
  const starlinkFixedFee = db.settings.starlinkMonthlyFee || 140000;
  const totalExpensesMonth = db.expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
  const netProfitMonth = revenueMonth - totalExpensesMonth;
  const isProfitable = netProfitMonth >= 0;

  res.json({
    totalClients,
    activeClients,
    suspendedClients,
    expiredClients,
    revenueMonth,
    starlinkFixedFee,
    totalExpensesMonth,
    netProfitMonth,
    isProfitable,
    breakevenClientsNeeded: Math.ceil(totalExpensesMonth / 50000)
  });
});

// GET Clients
app.get('/api/clients', (req, res) => {
  const db = loadDb();
  res.json(db.clients);
});

// POST Client
app.post('/api/clients', (req, res) => {
  const db = loadDb();
  const newClient = {
    ...req.body,
    id: `CLI-${String(db.clients.length + 1).padStart(3, '0')}`,
    dateInscription: new Date().toISOString().split('T')[0],
    status: 'actif',
    balanceDue: 0,
    isDeleted: false
  };
  db.clients.unshift(newClient);
  db.auditLogs.unshift({
    id: `LOG-${Date.now()}`,
    userId: 'USR-001',
    userName: 'Admin System',
    action: 'CREATION_CLIENT',
    details: `Nouveau client : ${newClient.nom} ${newClient.prenom}`,
    timestamp: new Date().toISOString()
  });
  saveDb(db);
  res.status(201).json(newClient);
});

// GET Invoices
app.get('/api/invoices', (req, res) => {
  const db = loadDb();
  res.json(db.invoices);
});

// POST Payment & Invoice
app.post('/api/payments', (req, res) => {
  const db = loadDb();
  const { clientId, planType, durationDays, totalAmount, amountPaid, discount, paymentMode, reference, agentName } = req.body;

  const client = db.clients.find(c => c.id === clientId);
  if (!client) return res.status(404).json({ error: 'Client introuvable' });

  const discountVal = discount || 0;
  const finalPrice = totalAmount - discountVal;
  const balanceDue = Math.max(0, finalPrice - amountPaid);
  const startDate = new Date().toISOString().split('T')[0];
  
  const end = new Date();
  end.setDate(end.getDate() + (durationDays || 30));
  const endDate = end.toISOString().split('T')[0];

  const seqNum = db.invoices.length + 1;
  const invoiceNumber = `FAC-${new Date().getFullYear()}-${String(seqNum).padStart(4, '0')}`;
  const invoiceId = `INV-${String(seqNum).padStart(3, '0')}`;
  const payId = `PAY-${String(db.payments.length + 1).padStart(3, '0')}`;

  const payment = {
    id: payId,
    clientId,
    clientName: `${client.nom} ${client.prenom}`,
    invoiceId,
    invoiceNumber,
    amountPaid,
    amountDue: balanceDue,
    totalAmount: finalPrice,
    discount: discountVal,
    paymentDate: startDate,
    paymentTime: new Date().toTimeString().split(' ')[0],
    paymentMode,
    reference: reference || `REF-${Date.now().toString().slice(-6)}`,
    agentId: 'USR-001',
    agentName: agentName || 'Admin System',
    isPartial: balanceDue > 0
  };
  db.payments.unshift(payment);

  const hashSignature = `SHA256-${Math.random().toString(36).substring(2, 12)}-${Date.now()}`;
  const invoice = {
    id: invoiceId,
    invoiceNumber,
    paymentId: payId,
    clientId: client.id,
    clientName: `${client.nom} ${client.prenom}`,
    clientPhone: client.telephone,
    clientAddress: client.adresse,
    clientQuartier: client.quartier,
    subscriptionType: planType || 'Mensuel',
    durationDays: durationDays || 30,
    startDate,
    endDate,
    items: [
      {
        designation: `Abonnement Wi-Fi Starlink - Pack ${planType || 'Mensuel'}`,
        quantity: 1,
        unitPrice: totalAmount,
        total: totalAmount
      }
    ],
    subtotal: totalAmount,
    discount: discountVal,
    tax: 0,
    totalPaid: amountPaid,
    balanceDue,
    paymentMode,
    transactionRef: reference,
    agentName: agentName || 'Admin System',
    qrCodePayload: `${invoiceNumber}|${client.id}|${amountPaid}|${startDate}|${hashSignature.slice(0, 10)}`,
    hashSignature,
    status: 'valid',
    createdAt: new Date().toISOString()
  };
  db.invoices.unshift(invoice);

  // Update client
  client.status = 'actif';
  client.currentSubscriptionPlan = planType;
  client.subscriptionEndDate = endDate;
  client.balanceDue = balanceDue;

  saveDb(db);
  res.status(201).json({ payment, invoice });
});

// Cancel Invoice
app.put('/api/invoices/:id/cancel', (req, res) => {
  const db = loadDb();
  const invoice = db.invoices.find(i => i.id === req.params.id);
  if (!invoice) return res.status(404).json({ error: 'Facture introuvable' });

  invoice.status = 'cancelled';
  invoice.cancelReason = req.body.reason || 'Annulation administrative';

  db.auditLogs.unshift({
    id: `LOG-${Date.now()}`,
    userId: 'USR-001',
    userName: 'Admin System',
    action: 'ANNULATION_FACTURE',
    details: `Annulation facture ${invoice.invoiceNumber} (Motif: ${invoice.cancelReason})`,
    timestamp: new Date().toISOString()
  });

  saveDb(db);
  res.json(invoice);
});

// GET Expenses
app.get('/api/expenses', (req, res) => {
  const db = loadDb();
  res.json(db.expenses);
});

// POST Expense
app.post('/api/expenses', (req, res) => {
  const db = loadDb();
  const newExpense = {
    id: `EXP-${String(db.expenses.length + 1).padStart(3, '0')}`,
    title: req.body.title,
    category: req.body.category,
    amount: req.body.amount,
    isFixed: req.body.category === 'Connexion Starlink (Fixe)',
    expenseDate: new Date().toISOString().split('T')[0],
    notes: req.body.notes || '',
    registeredBy: 'Admin'
  };
  db.expenses.unshift(newExpense);
  saveDb(db);
  res.status(201).json(newExpense);
});

// GET Settings
app.get('/api/settings', (req, res) => {
  const db = loadDb();
  res.json(db.settings);
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Serveur API Backend Starlink ISP Manager actif sur le port ${PORT}`);
});
