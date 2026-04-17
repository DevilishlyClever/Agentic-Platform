-- Clients (tenants)
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  api_key TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'starter',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Workflow definitions
CREATE TABLE IF NOT EXISTS workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  vertical TEXT NOT NULL,   -- 'legal' | 'real_estate'
  package TEXT NOT NULL,    -- 'document_review' | 'contract_draft' | 'client_intake' | 'listing_gen' | 'lead_qualify' | 'offer_compare'
  config JSONB NOT NULL DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Run history + usage metering
CREATE TABLE IF NOT EXISTS runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',  -- 'pending' | 'running' | 'done' | 'failed'
  input JSONB NOT NULL DEFAULT '{}',
  output JSONB,
  error TEXT,
  tokens_used INTEGER,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS runs_client_id_idx ON runs(client_id);
CREATE INDEX IF NOT EXISTS runs_workflow_id_idx ON runs(workflow_id);
CREATE INDEX IF NOT EXISTS runs_created_at_idx ON runs(created_at);

-- ============================================================
-- Lead Pipeline (AIA-36)
-- ============================================================

-- Canonical lead record shared across segments
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  -- Segment: which vertical this lead came from
  segment TEXT NOT NULL CHECK (segment IN ('lawyer', 'doctor', 'realtor', 'other')),
  -- Source attribution
  source TEXT NOT NULL DEFAULT 'direct',  -- 'landing_page' | 'referral' | 'direct' | 'campaign' | 'api'
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  -- Contact info
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  message TEXT,
  -- Pipeline stage
  stage TEXT NOT NULL DEFAULT 'new'
    CHECK (stage IN ('new', 'contacted', 'qualified', 'demo_booked', 'closed_won', 'closed_lost')),
  qualified BOOLEAN NOT NULL DEFAULT FALSE,
  demo_booked BOOLEAN NOT NULL DEFAULT FALSE,
  -- Response-time instrumentation for <15 min SLA tracking
  first_contacted_at TIMESTAMPTZ,
  response_time_ms BIGINT,  -- milliseconds from created_at to first_contacted_at
  -- Flexible metadata bag (form fields, enrichment, etc.)
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_client_id_idx ON leads(client_id);
CREATE INDEX IF NOT EXISTS leads_segment_idx ON leads(segment);
CREATE INDEX IF NOT EXISTS leads_source_idx ON leads(source);
CREATE INDEX IF NOT EXISTS leads_stage_idx ON leads(stage);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at);
CREATE INDEX IF NOT EXISTS leads_client_stage_idx ON leads(client_id, stage);
CREATE INDEX IF NOT EXISTS leads_client_created_idx ON leads(client_id, created_at DESC);

-- Audit trail for stage transitions and contact attempts
CREATE TABLE IF NOT EXISTS lead_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('stage_change', 'note', 'contact_attempt', 'demo_booked', 'qualified')),
  from_stage TEXT,
  to_stage TEXT,
  note TEXT,
  actor TEXT,  -- agent id or 'system'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS lead_events_lead_id_idx ON lead_events(lead_id);
CREATE INDEX IF NOT EXISTS lead_events_client_id_idx ON lead_events(client_id);
CREATE INDEX IF NOT EXISTS lead_events_created_at_idx ON lead_events(created_at DESC);
