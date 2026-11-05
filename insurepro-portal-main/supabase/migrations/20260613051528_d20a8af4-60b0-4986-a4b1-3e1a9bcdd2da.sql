
-- =========== ENUMS ===========
CREATE TYPE public.app_role AS ENUM ('admin', 'broker');
CREATE TYPE public.request_status AS ENUM (
  'draft','submitted','under_review','approved',
  'payment_pending','payment_completed','policy_generated','closed','rejected'
);
CREATE TYPE public.payment_status AS ENUM ('pending','completed','failed');

-- =========== UPDATED_AT HELPER ===========
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- =========== PROFILES ===========
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  company_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles self read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles self update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========== USER ROLES ===========
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users see own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- =========== HANDLE NEW USER ===========
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'broker');
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========== COMPANIES ===========
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  gst_number TEXT,
  contact_person TEXT,
  email TEXT,
  mobile TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.companies TO authenticated;
GRANT ALL ON public.companies TO service_role;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "company owner all" ON public.companies FOR ALL TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (owner_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_companies_updated BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.profiles ADD CONSTRAINT profiles_company_fk
  FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE SET NULL;

-- helper: is user member of company
CREATE OR REPLACE FUNCTION public.user_owns_company(_company_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS(SELECT 1 FROM public.companies WHERE id = _company_id AND owner_id = auth.uid())
$$;

-- =========== BRANCHES ===========
CREATE TABLE public.branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.branches TO authenticated;
GRANT ALL ON public.branches TO service_role;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "branches by company owner" ON public.branches FOR ALL TO authenticated
  USING (public.user_owns_company(company_id) OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.user_owns_company(company_id) OR public.has_role(auth.uid(),'admin'));

-- =========== EMPLOYEES ===========
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
  employee_code TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT,
  mobile TEXT,
  dob DATE,
  gender TEXT,
  department TEXT,
  salary_band TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_employees_company ON public.employees(company_id);
CREATE INDEX idx_employees_branch ON public.employees(branch_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employees TO authenticated;
GRANT ALL ON public.employees TO service_role;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "employees by company owner" ON public.employees FOR ALL TO authenticated
  USING (public.user_owns_company(company_id) OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.user_owns_company(company_id) OR public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_emp_updated BEFORE UPDATE ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========== INSURANCE PLANS ===========
CREATE TABLE public.insurance_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tier TEXT NOT NULL,
  monthly_premium NUMERIC(10,2) NOT NULL,
  coverage_amount NUMERIC(12,2) NOT NULL,
  hospital_network TEXT,
  benefits TEXT[],
  waiting_period_months INT DEFAULT 0,
  maternity_coverage BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.insurance_plans TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.insurance_plans TO authenticated;
GRANT ALL ON public.insurance_plans TO service_role;
ALTER TABLE public.insurance_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "plans readable by all" ON public.insurance_plans FOR SELECT USING (true);
CREATE POLICY "plans admin write" ON public.insurance_plans FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "plans admin update" ON public.insurance_plans FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "plans admin delete" ON public.insurance_plans FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_plans_updated BEFORE UPDATE ON public.insurance_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========== INSURANCE REQUESTS ===========
CREATE TABLE public.insurance_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_number TEXT NOT NULL UNIQUE DEFAULT ('REQ-' || to_char(now(),'YYYYMMDD') || '-' || substring(gen_random_uuid()::text,1,6)),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
  plan_id UUID REFERENCES public.insurance_plans(id),
  status public.request_status NOT NULL DEFAULT 'draft',
  employee_count INT NOT NULL DEFAULT 0,
  base_premium NUMERIC(12,2) DEFAULT 0,
  risk_loading NUMERIC(12,2) DEFAULT 0,
  tax NUMERIC(12,2) DEFAULT 0,
  total_amount NUMERIC(12,2) DEFAULT 0,
  admin_notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_req_company ON public.insurance_requests(company_id);
CREATE INDEX idx_req_status ON public.insurance_requests(status);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.insurance_requests TO authenticated;
GRANT ALL ON public.insurance_requests TO service_role;
ALTER TABLE public.insurance_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "requests by company owner" ON public.insurance_requests FOR ALL TO authenticated
  USING (public.user_owns_company(company_id) OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.user_owns_company(company_id) OR public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_req_updated BEFORE UPDATE ON public.insurance_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========== REQUEST <-> EMPLOYEES ===========
CREATE TABLE public.request_employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.insurance_requests(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  UNIQUE(request_id, employee_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.request_employees TO authenticated;
GRANT ALL ON public.request_employees TO service_role;
ALTER TABLE public.request_employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "req emp by request access" ON public.request_employees FOR ALL TO authenticated
  USING (EXISTS(SELECT 1 FROM public.insurance_requests r WHERE r.id = request_id AND (public.user_owns_company(r.company_id) OR public.has_role(auth.uid(),'admin'))))
  WITH CHECK (EXISTS(SELECT 1 FROM public.insurance_requests r WHERE r.id = request_id AND (public.user_owns_company(r.company_id) OR public.has_role(auth.uid(),'admin'))));

-- =========== MEDICAL RECORDS ===========
CREATE TABLE public.medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.insurance_requests(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  diabetes BOOLEAN DEFAULT false,
  hypertension BOOLEAN DEFAULT false,
  heart_disease BOOLEAN DEFAULT false,
  asthma BOOLEAN DEFAULT false,
  cancer_history BOOLEAN DEFAULT false,
  smoking BOOLEAN DEFAULT false,
  alcohol BOOLEAN DEFAULT false,
  pregnancy BOOLEAN DEFAULT false,
  existing_diseases TEXT,
  current_medications TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(request_id, employee_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.medical_records TO authenticated;
GRANT ALL ON public.medical_records TO service_role;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "medical by request access" ON public.medical_records FOR ALL TO authenticated
  USING (EXISTS(SELECT 1 FROM public.insurance_requests r WHERE r.id = request_id AND (public.user_owns_company(r.company_id) OR public.has_role(auth.uid(),'admin'))))
  WITH CHECK (EXISTS(SELECT 1 FROM public.insurance_requests r WHERE r.id = request_id AND (public.user_owns_company(r.company_id) OR public.has_role(auth.uid(),'admin'))));

-- =========== PAYMENTS ===========
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.insurance_requests(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  method TEXT,
  status public.payment_status NOT NULL DEFAULT 'pending',
  transaction_ref TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payments by request access" ON public.payments FOR ALL TO authenticated
  USING (EXISTS(SELECT 1 FROM public.insurance_requests r WHERE r.id = request_id AND (public.user_owns_company(r.company_id) OR public.has_role(auth.uid(),'admin'))))
  WITH CHECK (EXISTS(SELECT 1 FROM public.insurance_requests r WHERE r.id = request_id AND (public.user_owns_company(r.company_id) OR public.has_role(auth.uid(),'admin'))));

-- =========== POLICIES ===========
CREATE TABLE public.policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_number TEXT NOT NULL UNIQUE DEFAULT ('POL-' || to_char(now(),'YYYYMMDD') || '-' || substring(gen_random_uuid()::text,1,6)),
  request_id UUID NOT NULL UNIQUE REFERENCES public.insurance_requests(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.insurance_plans(id),
  employee_count INT NOT NULL,
  coverage_amount NUMERIC(12,2) NOT NULL,
  premium_paid NUMERIC(12,2) NOT NULL,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '1 year'),
  pdf_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.policies TO authenticated;
GRANT ALL ON public.policies TO service_role;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "policies by company owner" ON public.policies FOR ALL TO authenticated
  USING (public.user_owns_company(company_id) OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.user_owns_company(company_id) OR public.has_role(auth.uid(),'admin'));

-- =========== NOTIFICATIONS ===========
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notif own" ON public.notifications FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
