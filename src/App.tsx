import React, { useState } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { BillingInvoiceModule } from './components/BillingInvoiceModule';
import { ClientManagement } from './components/ClientManagement';
import { SubscriptionManagement } from './components/SubscriptionManagement';
import { PaymentManagement } from './components/PaymentManagement';
import { ExpenseManagement } from './components/ExpenseManagement';
import { WifiPointsManagement } from './components/WifiPointsManagement';
import { ReportsAnalytics } from './components/ReportsAnalytics';
import { SettingsSecurity } from './components/SettingsSecurity';
import { InvoicePreviewModal } from './components/InvoicePreviewModal';
import { NewClientModal } from './components/NewClientModal';
import { AuthModal } from './components/AuthModal';
import { Client } from './types';
import { Radio } from 'lucide-react';

// Écran de chargement initial
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-600 to-cyan-400 flex items-center justify-center shadow-2xl shadow-indigo-600/40 animate-pulse">
      <Radio className="w-8 h-8 text-white" />
    </div>
    <div className="text-center">
      <div className="text-slate-300 font-semibold">Chargement de Starlink ISP Manager...</div>
      <div className="text-slate-500 text-xs mt-1">Connexion en cours</div>
    </div>
    <div className="flex gap-1.5 mt-2">
      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  </div>
);

// Contenu principal de l'application
const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, selectedInvoice, setSelectedInvoice } = useData();
  const { authUser, isLoading, isAuthenticated, logout } = useAuth();
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [selectedClientForPayment, setSelectedClientForPayment] = useState<Client | null>(null);

  const handleOpenPaymentForClient = (client: Client) => {
    setSelectedClientForPayment(client);
    setActiveTab('payments');
  };

  // Affichage du spinner de chargement
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Affichage de la page de connexion si non authentifié
  if (!isAuthenticated) {
    return <AuthModal />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Navbar */}
        <Navbar
          onOpenNewClient={() => setIsNewClientModalOpen(true)}
          onOpenNewPayment={() => {
            setSelectedClientForPayment(null);
            setActiveTab('payments');
          }}
          onOpenNewExpense={() => setActiveTab('expenses')}
          onLogout={logout}
          authUser={authUser}
        />

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {activeTab === 'dashboard' && (
            <Dashboard
              onOpenNewClient={() => setIsNewClientModalOpen(true)}
              onOpenNewPayment={() => setActiveTab('payments')}
            />
          )}

          {activeTab === 'invoices' && <BillingInvoiceModule />}

          {activeTab === 'clients' && (
            <ClientManagement
              onOpenNewClient={() => setIsNewClientModalOpen(true)}
              onOpenNewPaymentForClient={handleOpenPaymentForClient}
            />
          )}

          {activeTab === 'subscriptions' && (
            <SubscriptionManagement
              onOpenNewPayment={() => setActiveTab('payments')}
            />
          )}

          {activeTab === 'payments' && (
            <PaymentManagement
              initialClient={selectedClientForPayment}
              onSuccessClose={() => setSelectedClientForPayment(null)}
            />
          )}

          {activeTab === 'expenses' && <ExpenseManagement />}
          {activeTab === 'wifipoints' && <WifiPointsManagement />}
          {activeTab === 'reports' && <ReportsAnalytics />}
          {activeTab === 'settings' && <SettingsSecurity />}
        </main>

      </div>

      {/* Global Invoice Preview / Print Modal */}
      {selectedInvoice && (
        <InvoicePreviewModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

      {/* New Client Modal */}
      {isNewClientModalOpen && (
        <NewClientModal
          onClose={() => setIsNewClientModalOpen(false)}
          onSuccessOpenPayment={(_clientId) => {
            setActiveTab('payments');
          }}
        />
      )}

    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <MainContent />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
