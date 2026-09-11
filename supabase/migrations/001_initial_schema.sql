-- TestConnect initial schema
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE user_role AS ENUM ('company', 'tester', 'admin');
CREATE TYPE account_status AS ENUM ('pending', 'active', 'suspended');
CREATE TYPE campaign_status AS ENUM (
  'draft', 'pending_validation', 'recruiting', 'in_progress',
  'feedbacks_pending', 'completed', 'cancelled'
);
CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'rejected', 'completed');
CREATE TYPE feedback_status AS ENUM ('draft', 'submitted', 'approved', 'rejected', 'correction_requested');
CREATE TYPE payment_status AS ENUM ('pending', 'simulated_paid', 'paid', 'failed');
CREATE TYPE payment_type AS ENUM ('company_campaign', 'tester_reward');
CREATE TYPE dispute_status AS ENUM ('open', 'in_review', 'resolved', 'closed');
CREATE TYPE offer_type AS ENUM ('essentiel', 'validation', 'approfondie');

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  status account_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sector TEXT,
  size TEXT,
  description TEXT,
  status account_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE tester_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  birth_date DATE,
  city TEXT,
  country TEXT DEFAULT 'France',
  interests TEXT[] DEFAULT '{}',
  devices TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  average_rating NUMERIC(3,2) DEFAULT 0,
  tests_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  product_type TEXT NOT NULL DEFAULT 'digital',
  category TEXT,
  product_link TEXT,
  objective TEXT,
  criteria JSONB DEFAULT '{}',
  instructions TEXT,
  duration_hours INTEGER DEFAULT 2,
  start_date DATE,
  deadline DATE,
  testers_count INTEGER NOT NULL DEFAULT 5,
  offer offer_type NOT NULL DEFAULT 'essentiel',
  base_price NUMERIC(10,2) NOT NULL,
  extras JSONB DEFAULT '{}',
  total_price NUMERIC(10,2) NOT NULL,
  status campaign_status NOT NULL DEFAULT 'draft',
  paid BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  tester_id UUID NOT NULL REFERENCES tester_profiles(id) ON DELETE CASCADE,
  status application_status NOT NULL DEFAULT 'pending',
  accepted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(campaign_id, tester_id)
);

CREATE TABLE feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  tester_id UUID NOT NULL REFERENCES tester_profiles(id) ON DELETE CASCADE,
  application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  answers JSONB DEFAULT '{}',
  comment TEXT,
  positives TEXT,
  negatives TEXT,
  suggestions TEXT,
  attachments JSONB DEFAULT '[]',
  status feedback_status NOT NULL DEFAULT 'draft',
  submitted_at TIMESTAMPTZ,
  validated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(campaign_id, tester_id)
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  type payment_type NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  simulated BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  status dispute_status NOT NULL DEFAULT 'open',
  resolution TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_campaigns_company ON campaigns(company_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_applications_campaign ON applications(campaign_id);
CREATE INDEX idx_applications_tester ON applications(tester_id);
CREATE INDEX idx_feedbacks_campaign ON feedbacks(campaign_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE tester_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, role, email, first_name, last_name, phone, status)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'tester'),
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone',
    'pending'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Profiles
CREATE POLICY profiles_select ON profiles FOR SELECT USING (
  id = auth.uid() OR public.is_admin()
);
CREATE POLICY profiles_update ON profiles FOR UPDATE USING (
  id = auth.uid() OR public.is_admin()
);

-- Companies
CREATE POLICY companies_select ON companies FOR SELECT USING (
  user_id = auth.uid() OR public.is_admin()
);
CREATE POLICY companies_insert ON companies FOR INSERT WITH CHECK (
  user_id = auth.uid()
);
CREATE POLICY companies_update ON companies FOR UPDATE USING (
  user_id = auth.uid() OR public.is_admin()
);

-- Tester profiles
CREATE POLICY tester_select ON tester_profiles FOR SELECT USING (
  user_id = auth.uid() OR public.is_admin() OR
  EXISTS (SELECT 1 FROM campaigns c JOIN companies co ON c.company_id = co.id WHERE co.user_id = auth.uid())
);
CREATE POLICY tester_insert ON tester_profiles FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY tester_update ON tester_profiles FOR UPDATE USING (
  user_id = auth.uid() OR public.is_admin()
);

-- Campaigns
CREATE POLICY campaigns_select ON campaigns FOR SELECT USING (
  EXISTS (SELECT 1 FROM companies co WHERE co.id = company_id AND co.user_id = auth.uid())
  OR public.is_admin()
  OR status IN ('recruiting', 'in_progress')
);
CREATE POLICY campaigns_insert ON campaigns FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM companies co WHERE co.id = company_id AND co.user_id = auth.uid())
);
CREATE POLICY campaigns_update ON campaigns FOR UPDATE USING (
  EXISTS (SELECT 1 FROM companies co WHERE co.id = company_id AND co.user_id = auth.uid())
  OR public.is_admin()
);

-- Applications
CREATE POLICY applications_select ON applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM tester_profiles tp WHERE tp.id = tester_id AND tp.user_id = auth.uid())
  OR public.is_admin()
  OR EXISTS (
    SELECT 1 FROM campaigns c JOIN companies co ON c.company_id = co.id
    WHERE c.id = campaign_id AND co.user_id = auth.uid()
  )
);
CREATE POLICY applications_insert ON applications FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM tester_profiles tp WHERE tp.id = tester_id AND tp.user_id = auth.uid())
);
CREATE POLICY applications_update ON applications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM tester_profiles tp WHERE tp.id = tester_id AND tp.user_id = auth.uid())
  OR public.is_admin()
);

-- Feedbacks
CREATE POLICY feedbacks_select ON feedbacks FOR SELECT USING (
  EXISTS (SELECT 1 FROM tester_profiles tp WHERE tp.id = tester_id AND tp.user_id = auth.uid())
  OR public.is_admin()
  OR EXISTS (
    SELECT 1 FROM campaigns c JOIN companies co ON c.company_id = co.id
    WHERE c.id = campaign_id AND co.user_id = auth.uid()
  )
);
CREATE POLICY feedbacks_insert ON feedbacks FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM tester_profiles tp WHERE tp.id = tester_id AND tp.user_id = auth.uid())
);
CREATE POLICY feedbacks_update ON feedbacks FOR UPDATE USING (
  EXISTS (SELECT 1 FROM tester_profiles tp WHERE tp.id = tester_id AND tp.user_id = auth.uid())
  OR public.is_admin()
);

-- Payments
CREATE POLICY payments_select ON payments FOR SELECT USING (
  recipient_id = auth.uid() OR public.is_admin()
);
CREATE POLICY payments_insert ON payments FOR INSERT WITH CHECK (
  public.is_admin() OR recipient_id = auth.uid()
);
CREATE POLICY payments_update ON payments FOR UPDATE USING (public.is_admin());

-- Notifications
CREATE POLICY notifications_select ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY notifications_insert ON notifications FOR INSERT WITH CHECK (
  user_id = auth.uid() OR public.is_admin()
);
CREATE POLICY notifications_update ON notifications FOR UPDATE USING (user_id = auth.uid());

-- Disputes
CREATE POLICY disputes_select ON disputes FOR SELECT USING (
  created_by = auth.uid() OR public.is_admin()
);
CREATE POLICY disputes_insert ON disputes FOR INSERT WITH CHECK (created_by = auth.uid());
CREATE POLICY disputes_update ON disputes FOR UPDATE USING (public.is_admin());
