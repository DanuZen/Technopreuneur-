-- Skema PostgreSQL + pgvector untuk Pasbana (CareerMatch AI)
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(180) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('jobseeker', 'employer', 'admin')),
  pdp_consent BOOLEAN NOT NULL DEFAULT TRUE,
  has_completed_cv_check BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  user_id VARCHAR(64) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(150) NOT NULL,
  headline VARCHAR(180),
  contact_email VARCHAR(180),
  city VARCHAR(120),
  seniority_level VARCHAR(80),
  summary TEXT,
  skills JSONB NOT NULL DEFAULT '{"technical":[],"soft":[],"tools":[]}',
  experiences JSONB NOT NULL DEFAULT '[]',
  education JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS companies (
  id VARCHAR(64) PRIMARY KEY,
  owner_user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(180) NOT NULL,
  industry VARCHAR(150) NOT NULL,
  website VARCHAR(255),
  city VARCHAR(120) NOT NULL,
  keywords TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  nib VARCHAR(64),
  npwp VARCHAR(64),
  legality_doc VARCHAR(180) NOT NULL DEFAULT 'Menunggu Verifikasi NIB & NPWP',
  pdp_compliance VARCHAR(180) NOT NULL DEFAULT 'Persetujuan UU PDP Tercatat',
  audit_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (audit_status IN ('verified', 'pending', 'incomplete')),
  audit_note TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cvs (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR(255),
  source VARCHAR(20) NOT NULL CHECK (source IN ('upload', 'onboarding')),
  overall_score INTEGER NOT NULL,
  dimensions JSONB NOT NULL,
  strengths JSONB NOT NULL DEFAULT '[]',
  weaknesses JSONB NOT NULL DEFAULT '[]',
  recommendations JSONB NOT NULL DEFAULT '[]',
  profile_snapshot JSONB NOT NULL,
  cv_text_excerpt TEXT NOT NULL DEFAULT '',
  cv_embedding vector(1536),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jobs (
  id VARCHAR(64) PRIMARY KEY,
  company_id VARCHAR(64) REFERENCES companies(id) ON DELETE CASCADE,
  company_name VARCHAR(180) NOT NULL,
  title VARCHAR(200) NOT NULL,
  location VARCHAR(150) NOT NULL,
  work_type VARCHAR(30) NOT NULL DEFAULT 'full-time',
  salary_range VARCHAR(100),
  source VARCHAR(20) NOT NULL DEFAULT 'internal',
  external_url TEXT,
  description TEXT NOT NULL,
  required_skills JSONB NOT NULL DEFAULT '[]',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  job_embedding vector(1536),
  posted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
  id VARCHAR(64) PRIMARY KEY,
  job_id VARCHAR(64) REFERENCES jobs(id) ON DELETE CASCADE,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  cv_id VARCHAR(64) REFERENCES cvs(id) ON DELETE SET NULL,
  code_name VARCHAR(64) NOT NULL,
  ats_score INTEGER NOT NULL DEFAULT 80,
  match_reason TEXT NOT NULL DEFAULT '',
  cover_letter TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewed', 'shortlisted', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_standards (
  id INTEGER PRIMARY KEY DEFAULT 1,
  min_ats_score INTEGER NOT NULL DEFAULT 75,
  max_cv_size_mb INTEGER NOT NULL DEFAULT 5,
  sla_seconds INTEGER NOT NULL DEFAULT 60,
  allowed_format VARCHAR(20) NOT NULL DEFAULT 'pdf_docx',
  blind_screening_required BOOLEAN NOT NULL DEFAULT TRUE,
  require_full_legality BOOLEAN NOT NULL DEFAULT TRUE,
  retention_days VARCHAR(20) NOT NULL DEFAULT '90',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
