-- ============================================================
-- STARLINK WI-FI ISP MANAGER — SUPABASE POSTGRESQL SCHEMA
-- Exécutez ce script dans : Supabase Dashboard > SQL Editor
-- ============================================================

-- Activation de l'extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================
-- TABLE: profiles (Utilisateurs & Rôles étendus)
-- ==============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'agent' CHECK (role IN ('admin', 'manager', 'agent')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================
-- TABLE: clients (Abonnés Wi-Fi)
-- ==============================================================
CREATE TABLE IF NOT EXISTS public.clients (
  id TEXT PRIMARY KEY DEFAULT 'CLI-' || LPAD(NEXTVAL('client_seq')::TEXT, 3, '0'),
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  telephone TEXT NOT NULL,
  adresse TEXT NOT NULL,
  quartier TEXT NOT NULL,
  cin TEXT,
  photo TEXT,
  date_inscription DATE DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'actif' CHECK (status IN ('actif', 'suspendu', 'resilie', 'en_attente')),
  -- Informations réseau
  ip TEXT,
  mac TEXT,
  router_id TEXT,
  router_name TEXT,
  ssid TEXT,
  wifi_password TEXT,
  pppoe_login TEXT,
  pppoe_pass TEXT,
  max_devices INTEGER DEFAULT 3,
  -- Abonnement courant
  current_plan TEXT,
  subscription_end_date DATE,
  balance_due BIGINT DEFAULT 0,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Séquence pour les IDs clients
CREATE SEQUENCE IF NOT EXISTS client_seq START 1;

-- ==============================================================
-- TABLE: subscriptions (Abonnements)
-- ==============================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id TEXT PRIMARY KEY DEFAULT 'SUB-' || LPAD(NEXTVAL('subscription_seq')::TEXT, 3, '0'),
  client_id TEXT NOT NULL REFERENCES public.clients(id),
  client_name TEXT NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('Mensuel', 'Hebdomadaire', 'Journalier', 'Personnalisé')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration_days INTEGER NOT NULL,
  price BIGINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'actif' CHECK (status IN ('actif', 'expire', 'suspendu')),
  auto_renew BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE SEQUENCE IF NOT EXISTS subscription_seq START 1;

-- ==============================================================
-- TABLE: payments (Paiements / Encaissements)
-- ==============================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id TEXT PRIMARY KEY DEFAULT 'PAY-' || LPAD(NEXTVAL('payment_seq')::TEXT, 3, '0'),
  client_id TEXT NOT NULL REFERENCES public.clients(id),
  client_name TEXT NOT NULL,
  subscription_id TEXT REFERENCES public.subscriptions(id),
  invoice_id TEXT,
  invoice_number TEXT,
  amount_paid BIGINT NOT NULL,
  amount_due BIGINT DEFAULT 0,
  total_amount BIGINT NOT NULL,
  discount BIGINT DEFAULT 0,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_time TEXT,
  payment_mode TEXT NOT NULL CHECK (payment_mode IN ('Espèces', 'MVola', 'Orange Money', 'Airtel Money', 'Virement')),
  reference TEXT NOT NULL,
  notes TEXT,
  agent_id TEXT,
  agent_name TEXT,
  is_partial BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE SEQUENCE IF NOT EXISTS payment_seq START 1;

-- ==============================================================
-- TABLE: invoices (Factures séquentielles FAC-YYYY-XXXX)
-- ==============================================================
CREATE TABLE IF NOT EXISTS public.invoices (
  id TEXT PRIMARY KEY DEFAULT 'INV-' || LPAD(NEXTVAL('invoice_seq')::TEXT, 3, '0'),
  invoice_number TEXT NOT NULL UNIQUE,  -- ex: FAC-2026-0001
  payment_id TEXT REFERENCES public.payments(id),
  client_id TEXT NOT NULL REFERENCES public.clients(id),
  client_name TEXT NOT NULL,
  client_phone TEXT,
  client_address TEXT,
  client_quartier TEXT,
  subscription_type TEXT,
  duration_days INTEGER,
  start_date DATE,
  end_date DATE,
  items JSONB,  -- [{ designation, quantity, unit_price, total }]
  subtotal BIGINT NOT NULL,
  discount BIGINT DEFAULT 0,
  tax BIGINT DEFAULT 0,
  total_paid BIGINT NOT NULL,
  balance_due BIGINT DEFAULT 0,
  payment_mode TEXT,
  transaction_ref TEXT,
  agent_name TEXT,
  qr_code_payload TEXT,
  hash_signature TEXT,
  status TEXT NOT NULL DEFAULT 'valid' CHECK (status IN ('valid', 'cancelled')),
  cancel_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE SEQUENCE IF NOT EXISTS invoice_seq START 1;

-- ==============================================================
-- TABLE: expenses (Dépenses - Starlink 140k Ar + Variables)
-- ==============================================================
CREATE TABLE IF NOT EXISTS public.expenses (
  id TEXT PRIMARY KEY DEFAULT 'EXP-' || LPAD(NEXTVAL('expense_seq')::TEXT, 3, '0'),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  amount BIGINT NOT NULL,
  is_fixed BOOLEAN DEFAULT FALSE,
  expense_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  registered_by TEXT DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE SEQUENCE IF NOT EXISTS expense_seq START 1;

-- Dépense Starlink fixe initiale
INSERT INTO public.expenses (title, category, amount, is_fixed, expense_date, notes, registered_by)
VALUES (
  'Abonnement Connexion Starlink (Mensuel Fixe)',
  'Connexion Starlink (Fixe)',
  140000,
  TRUE,
  CURRENT_DATE,
  'Forfait fixe mensuel obligatoire Starlink Madagascar',
  'Système'
) ON CONFLICT DO NOTHING;

-- ==============================================================
-- TABLE: wifi_points (Points d'Accès et Hotspots)
-- ==============================================================
CREATE TABLE IF NOT EXISTS public.wifi_points (
  id TEXT PRIMARY KEY DEFAULT 'WIFI-AP-' || LPAD(NEXTVAL('wifi_seq')::TEXT, 2, '0'),
  name TEXT NOT NULL,
  location TEXT,
  ip_range TEXT,
  total_connected INTEGER DEFAULT 0,
  max_capacity INTEGER DEFAULT 25,
  status TEXT NOT NULL DEFAULT 'online' CHECK (status IN ('online', 'offline', 'maintenance')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE SEQUENCE IF NOT EXISTS wifi_seq START 1;

-- ==============================================================
-- TABLE: company_settings (Paramètres Entreprise)
-- ==============================================================
CREATE TABLE IF NOT EXISTS public.company_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  name TEXT DEFAULT 'MADAGASCAR STARLINK WI-FI (ISP)',
  slogan TEXT DEFAULT 'Internet Très Haut Débit par Satellite partout à Madagascar',
  address TEXT DEFAULT 'Lot IVG 123 B Bis, Ankorondrano',
  quartier TEXT DEFAULT 'Ankorondrano',
  city TEXT DEFAULT 'Antananarivo 101',
  phone TEXT DEFAULT '+261 34 00 123 45',
  email TEXT DEFAULT 'contact@starlink-wifi.mg',
  social_media TEXT,
  currency TEXT DEFAULT 'Ar',
  starlink_monthly_fee BIGINT DEFAULT 140000,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#4f46e5',
  secondary_color TEXT DEFAULT '#00e5ff',
  footer_text TEXT,
  terms_and_conditions TEXT,
  stamp_signature_text TEXT DEFAULT 'Direction Générale - Certifié Conforme',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertion des paramètres par défaut
INSERT INTO public.company_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

-- ==============================================================
-- TABLE: audit_logs (Journal d'Audit Inaltérable)
-- ==============================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY DEFAULT 'LOG-' || EXTRACT(EPOCH FROM NOW())::BIGINT::TEXT,
  user_id TEXT,
  user_name TEXT,
  action TEXT NOT NULL,
  details TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================
-- ROW LEVEL SECURITY (RLS) - Protection des données
-- ==============================================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wifi_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Politique : Seuls les utilisateurs authentifiés peuvent lire/écrire
CREATE POLICY "Authenticated users can read all" ON public.clients
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert clients" ON public.clients
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update clients" ON public.clients
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read invoices" ON public.invoices
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert invoices" ON public.invoices
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update invoices" ON public.invoices
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read payments" ON public.payments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert payments" ON public.payments
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can read subscriptions" ON public.subscriptions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert subscriptions" ON public.subscriptions
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can read expenses" ON public.expenses
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage expenses" ON public.expenses
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can read settings" ON public.company_settings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin can update settings" ON public.company_settings
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read wifi points" ON public.wifi_points
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage wifi points" ON public.wifi_points
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can read audit logs" ON public.audit_logs
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert audit logs" ON public.audit_logs
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- ==============================================================
-- TRIGGER: Mise à jour automatique du champ updated_at
-- ==============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER clients_updated_at BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==============================================================
-- REALTIME: Activation des mises à jour temps réel
-- ==============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.clients;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.invoices;
ALTER PUBLICATION supabase_realtime ADD TABLE public.subscriptions;

-- ============================================================
-- FIN DU SCRIPT — Starlink Wi-Fi ISP Manager — Madagascar
-- ============================================================
