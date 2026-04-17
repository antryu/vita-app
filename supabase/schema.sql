-- VITA Platform Database Schema
-- Target: Supabase PostgreSQL

-- Enums
CREATE TYPE user_role AS ENUM ('member', 'guardian', 'org_admin', 'platform_admin');
CREATE TYPE member_tier AS ENUM ('basic', 'premium', 'platinum');
CREATE TYPE subscription_status AS ENUM ('trial', 'active', 'paused', 'cancelled', 'expired');
CREATE TYPE alert_severity AS ENUM ('info', 'warning', 'critical', 'emergency');
CREATE TYPE alert_status AS ENUM ('pending', 'sent', 'acknowledged', 'resolved');
CREATE TYPE risk_level AS ENUM ('normal', 'caution', 'warning', 'critical');
CREATE TYPE vital_cash_type AS ENUM ('earn', 'burn');
CREATE TYPE org_type AS ENUM ('municipality', 'nursing_home', 'enterprise', 'hospital');

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'member',
  name TEXT NOT NULL,
  phone TEXT,
  kakao_id TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type org_type NOT NULL,
  contract_type TEXT,
  max_members INT DEFAULT 100,
  admin_profile_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Members (ring wearers)
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ring_id TEXT UNIQUE,
  tier member_tier DEFAULT 'basic',
  subscription_status subscription_status DEFAULT 'trial',
  organization_id UUID REFERENCES organizations(id),
  guardian_profile_id UUID REFERENCES profiles(id),
  birth_date DATE,
  gender TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vitals (biometric data from VitalRing API)
CREATE TABLE vitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  measured_at TIMESTAMPTZ NOT NULL,
  heart_rate INT,
  hrv FLOAT,
  spo2 FLOAT,
  skin_temp FLOAT,
  respiration_rate INT,
  stress_score INT,
  steps INT,
  sleep_stage TEXT,
  battery INT,
  location JSONB,
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(member_id, measured_at)
);

CREATE INDEX idx_vitals_member_time ON vitals (member_id, measured_at DESC);
CREATE INDEX idx_vitals_measured_at ON vitals (measured_at DESC);

-- Health Analyses (daily AI results)
CREATE TABLE health_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  analysis_date DATE NOT NULL,
  health_score INT NOT NULL CHECK (health_score BETWEEN 0 AND 100),
  sleep_score INT CHECK (sleep_score BETWEEN 0 AND 100),
  stress_score INT CHECK (stress_score BETWEEN 0 AND 100),
  recovery_score INT CHECK (recovery_score BETWEEN 0 AND 100),
  risk_level risk_level NOT NULL DEFAULT 'normal',
  anomalies JSONB DEFAULT '[]',
  ai_recommendation TEXT,
  model_version TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(member_id, analysis_date)
);

CREATE INDEX idx_health_member_date ON health_analyses (member_id, analysis_date DESC);

-- Alerts
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  severity alert_severity NOT NULL,
  title TEXT,
  message TEXT,
  data JSONB,
  status alert_status DEFAULT 'pending',
  sent_via TEXT[] DEFAULT '{}',
  sent_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alerts_member ON alerts (member_id, created_at DESC);
CREATE INDEX idx_alerts_status ON alerts (status) WHERE status != 'resolved';

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id),
  plan member_tier NOT NULL DEFAULT 'basic',
  price_monthly INT NOT NULL,
  billing_key TEXT,
  status subscription_status DEFAULT 'active',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  next_billing_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id),
  amount INT NOT NULL,
  currency TEXT DEFAULT 'KRW',
  status TEXT DEFAULT 'pending',
  toss_payment_key TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vital Cash (points ledger)
CREATE TABLE vital_cash (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  transaction_type vital_cash_type NOT NULL,
  amount INT NOT NULL,
  reason TEXT NOT NULL,
  balance_after INT NOT NULL DEFAULT 0,
  reference_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vital_cash_member ON vital_cash (member_id, created_at DESC);

-- Partner Referrals
CREATE TABLE partner_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  partner_type TEXT NOT NULL,
  partner_name TEXT,
  referral_reason TEXT,
  status TEXT DEFAULT 'initiated',
  commission_amount INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== Row-Level Security =====

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vital_cash ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update own profile
CREATE POLICY profiles_self_read ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY profiles_self_update ON profiles FOR UPDATE USING (id = auth.uid());

-- Members: own profile or linked guardian
CREATE POLICY members_self ON members FOR SELECT
  USING (profile_id = auth.uid() OR guardian_profile_id = auth.uid());

-- Members: org admin sees org members
CREATE POLICY members_org_admin ON members FOR SELECT
  USING (
    organization_id IN (
      SELECT o.id FROM organizations o WHERE o.admin_profile_id = auth.uid()
    )
  );

-- Vitals: guardian sees linked member vitals
CREATE POLICY vitals_guardian ON vitals FOR SELECT
  USING (
    member_id IN (
      SELECT m.id FROM members m
      WHERE m.profile_id = auth.uid() OR m.guardian_profile_id = auth.uid()
    )
  );

-- Vitals: org admin sees org member vitals
CREATE POLICY vitals_org_admin ON vitals FOR SELECT
  USING (
    member_id IN (
      SELECT m.id FROM members m
      JOIN organizations o ON m.organization_id = o.id
      WHERE o.admin_profile_id = auth.uid()
    )
  );

-- Health analyses: same pattern as vitals
CREATE POLICY health_guardian ON health_analyses FOR SELECT
  USING (
    member_id IN (
      SELECT m.id FROM members m
      WHERE m.profile_id = auth.uid() OR m.guardian_profile_id = auth.uid()
    )
  );

CREATE POLICY health_org_admin ON health_analyses FOR SELECT
  USING (
    member_id IN (
      SELECT m.id FROM members m
      JOIN organizations o ON m.organization_id = o.id
      WHERE o.admin_profile_id = auth.uid()
    )
  );

-- Alerts: same pattern
CREATE POLICY alerts_guardian ON alerts FOR SELECT
  USING (
    member_id IN (
      SELECT m.id FROM members m
      WHERE m.profile_id = auth.uid() OR m.guardian_profile_id = auth.uid()
    )
  );

CREATE POLICY alerts_org_admin ON alerts FOR SELECT
  USING (
    member_id IN (
      SELECT m.id FROM members m
      JOIN organizations o ON m.organization_id = o.id
      WHERE o.admin_profile_id = auth.uid()
    )
  );

-- Subscriptions: member sees own
CREATE POLICY subscriptions_self ON subscriptions FOR SELECT
  USING (
    member_id IN (
      SELECT m.id FROM members m WHERE m.profile_id = auth.uid()
    )
  );

-- Vital Cash: member sees own
CREATE POLICY vital_cash_self ON vital_cash FOR SELECT
  USING (
    member_id IN (
      SELECT m.id FROM members m WHERE m.profile_id = auth.uid()
    )
  );

-- Organizations: admin sees own org
CREATE POLICY org_admin ON organizations FOR SELECT
  USING (admin_profile_id = auth.uid());

-- Platform admin: sees everything (service role bypasses RLS)

-- ===== Triggers =====

-- Auto-update updated_at on profiles
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on auth.users insert
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'User'), 'member');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
