-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE question_type AS ENUM (
  'text', 'textarea', 'select', 'multi_select', 'radio', 'checkbox', 
  'number', 'email', 'date', 'file_upload', 'rating', 'boolean'
);

CREATE TYPE submission_status AS ENUM ('draft', 'submitted', 'approved', 'rejected');
CREATE TYPE report_status AS ENUM ('pending', 'generating', 'completed', 'failed');
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'user', 'viewer');

-- Companies table for multi-tenancy
CREATE TABLE companies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255) UNIQUE,
  logo_url TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles with company association
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role user_role DEFAULT 'user',
  avatar_url TEXT,
  permissions JSONB DEFAULT '{}',
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product categories
CREATE TABLE product_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sku VARCHAR(100),
  price DECIMAL(10,2),
  cost DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0,
  images JSONB DEFAULT '[]',
  specifications JSONB DEFAULT '{}',
  tags TEXT[],
  status VARCHAR(50) DEFAULT 'active',
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Form templates for dynamic forms
CREATE TABLE form_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_multi_step BOOLEAN DEFAULT false,
  steps_config JSONB DEFAULT '[]',
  conditional_logic JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'active',
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Form questions/fields
CREATE TABLE form_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  form_template_id UUID REFERENCES form_templates(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type question_type NOT NULL,
  step_number INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  is_required BOOLEAN DEFAULT false,
  options JSONB DEFAULT '[]',
  validation_rules JSONB DEFAULT '{}',
  conditional_display JSONB DEFAULT '{}',
  help_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Form submissions
CREATE TABLE form_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  form_template_id UUID REFERENCES form_templates(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  submitted_by UUID REFERENCES user_profiles(id),
  status submission_status DEFAULT 'draft',
  submission_data JSONB DEFAULT '{}',
  current_step INTEGER DEFAULT 1,
  completed_steps INTEGER[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  submitted_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES user_profiles(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports table
CREATE TABLE reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  report_type VARCHAR(100) NOT NULL,
  template_config JSONB DEFAULT '{}',
  data_filters JSONB DEFAULT '{}',
  generated_by UUID REFERENCES user_profiles(id),
  status report_status DEFAULT 'pending',
  file_url TEXT,
  file_size INTEGER,
  generation_started_at TIMESTAMPTZ,
  generation_completed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit log for tracking changes
CREATE TABLE audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id),
  table_name VARCHAR(100) NOT NULL,
  record_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_products_company_id ON products(company_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_form_submissions_company_id ON form_submissions(company_id);
CREATE INDEX idx_form_submissions_form_template_id ON form_submissions(form_template_id);
CREATE INDEX idx_form_submissions_status ON form_submissions(status);
CREATE INDEX idx_form_submissions_submitted_by ON form_submissions(submitted_by);
CREATE INDEX idx_form_questions_form_template_id ON form_questions(form_template_id);
CREATE INDEX idx_form_questions_step_number ON form_questions(step_number);
CREATE INDEX idx_user_profiles_company_id ON user_profiles(company_id);
CREATE INDEX idx_reports_company_id ON reports(company_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_audit_logs_company_id ON audit_logs(company_id);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companies
CREATE POLICY "Users can view their own company" ON companies
  FOR SELECT USING (
    id IN (
      SELECT company_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Company admins can update their company" ON companies
  FOR UPDATE USING (
    id IN (
      SELECT company_id FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- RLS Policies for user_profiles
CREATE POLICY "Users can view profiles in their company" ON user_profiles
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins can manage users in their company" ON user_profiles
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- RLS Policies for products
CREATE POLICY "Users can view products in their company" ON products
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create products in their company" ON products
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT company_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update products in their company" ON products
  FOR UPDATE USING (
    company_id IN (
      SELECT company_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete products in their company" ON products
  FOR DELETE USING (
    company_id IN (
      SELECT company_id FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Similar RLS policies for other tables
CREATE POLICY "Company scoped access" ON product_categories
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Company scoped access" ON form_templates
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Company scoped access" ON form_questions
  FOR ALL USING (
    form_template_id IN (
      SELECT id FROM form_templates WHERE company_id IN (
        SELECT company_id FROM user_profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Company scoped access" ON form_submissions
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Company scoped access" ON reports
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Company scoped access" ON audit_logs
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- Functions for common operations
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT company_id FROM user_profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER create_user_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- Function to generate reports
CREATE OR REPLACE FUNCTION generate_product_report(
  p_company_id UUID,
  p_report_type VARCHAR,
  p_filters JSONB DEFAULT '{}'::JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  report_id UUID;
BEGIN
  INSERT INTO reports (company_id, name, report_type, data_filters, generated_by, status)
  VALUES (
    p_company_id,
    'Product Report - ' || CURRENT_TIMESTAMP::DATE,
    p_report_type,
    p_filters,
    auth.uid(),
    'pending'
  )
  RETURNING id INTO report_id;
  
  RETURN report_id;
END;
$$;

-- Function to track audit logs
CREATE OR REPLACE FUNCTION track_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  company_id_val UUID;
BEGIN
  -- Get company_id from the record or user profile
  IF TG_TABLE_NAME = 'products' OR TG_TABLE_NAME = 'form_submissions' OR TG_TABLE_NAME = 'reports' THEN
    company_id_val := COALESCE(NEW.company_id, OLD.company_id);
  ELSE
    company_id_val := get_user_company_id();
  END IF;

  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (company_id, user_id, table_name, record_id, action, old_values)
    VALUES (company_id_val, auth.uid(), TG_TABLE_NAME, OLD.id, TG_OP, to_jsonb(OLD));
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (company_id, user_id, table_name, record_id, action, old_values, new_values)
    VALUES (company_id_val, auth.uid(), TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (company_id, user_id, table_name, record_id, action, new_values)
    VALUES (company_id_val, auth.uid(), TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(NEW));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

-- Create audit triggers
CREATE TRIGGER audit_products AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH ROW EXECUTE FUNCTION track_changes();
CREATE TRIGGER audit_form_submissions AFTER INSERT OR UPDATE OR DELETE ON form_submissions
  FOR EACH ROW EXECUTE FUNCTION track_changes();
CREATE TRIGGER audit_reports AFTER INSERT OR UPDATE OR DELETE ON reports
  FOR EACH ROW EXECUTE FUNCTION track_changes();

-- Update timestamps function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create update triggers for all tables with updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_form_templates_updated_at BEFORE UPDATE ON form_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_form_questions_updated_at BEFORE UPDATE ON form_questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_form_submissions_updated_at BEFORE UPDATE ON form_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();