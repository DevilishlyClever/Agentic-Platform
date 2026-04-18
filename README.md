# Agentic Platform

AI Agents as a Service — legal and real estate workflow automation, production-ready.

**Live:** https://agentic-platform-azure.vercel.app

---

## What It Does

A multi-tenant AI workflow engine. Each client gets:
- An API key to trigger AI workflows via REST
- A self-serve dashboard with usage stats and run history
- Webhook support for async event-driven triggers

### Legal Workflows

| Package | What it does |
|---|---|
| `document_review` | Extracts risks, obligations, and key clauses from contracts/docs |
| `contract_draft` | Drafts contracts given party names, terms, and jurisdiction |
| `client_intake` | Converts intake form text into structured client records |

### Real Estate Workflows

| Package | What it does |
|---|---|
| `listing_gen` | Generates MLS-ready listing descriptions from property details |
| `lead_qualify` | Scores and qualifies leads from Q&A conversation text |
| `offer_compare` | Summarizes and ranks multiple offers for a listing |

---

## Quick Start (Client)

### 1. Get your API key

Your API key looks like `sk_<64 hex chars>`. Keep it secret.

### 2. Run a workflow

```bash
curl -X POST https://agentic-platform-azure.vercel.app/api/v1/workflows/{workflowId}/run \
  -H "Authorization: Bearer sk_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{"documentText": "This agreement is entered into..."}'
```

Response:
```json
{
  "runId": "uuid",
  "status": "done",
  "output": { ... },
  "usage": { "tokensUsed": 1240, "durationMs": 1850 }
}
```

### 3. Check usage

```bash
curl https://agentic-platform-azure.vercel.app/api/v1/usage \
  -H "Authorization: Bearer sk_your_api_key"
```

Response:
```json
{
  "period": "2026-04",
  "runsThisMonth": 42,
  "tokensThisMonth": 98000,
  "plan": "pro"
}
```

### 4. Client dashboard

Log in at https://agentic-platform-azure.vercel.app/dashboard with your API key to see usage, workflows, and run history.

---

## API Reference

Base URL: `https://agentic-platform-azure.vercel.app`

All client API routes require `Authorization: Bearer sk_your_api_key`.

### Run a workflow

```
POST /api/v1/workflows/{workflowId}/run
```

**Body** (varies by package — see examples below):

```json
{ "documentText": "..." }
```

**Response:**
```json
{
  "runId": "string (UUID)",
  "status": "done",
  "output": {},
  "usage": { "tokensUsed": 0, "durationMs": 0 }
}
```

### Check usage

```
GET /api/v1/usage
```

**Response:**
```json
{
  "period": "YYYY-MM",
  "runsThisMonth": 0,
  "tokensThisMonth": 0,
  "plan": "starter | pro | enterprise"
}
```

### Webhook trigger (async)

```
POST /api/v1/webhooks/{clientId}/{workflowId}
```

Requires `X-Webhook-Signature: sha256=<hmac-hex>` header. Returns `202 Accepted` immediately; run executes in background.

---

## Lead Pipeline API

All routes below (except the public ingest endpoint) require `Authorization: Bearer sk_your_api_key`.

### Ingest a lead (authenticated)

```
POST /api/v1/leads
```

**Body:**
```json
{
  "segment": "lawyer | doctor | realtor | other",
  "source": "landing_page | referral | direct | campaign | api",
  "email": "jane@firm.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "company": "Northline Legal",
  "phone": "+1-555-0100",
  "message": "Looking to automate contract review",
  "utmSource": "linkedin",
  "utmMedium": "paid",
  "utmCampaign": "aia30-legal",
  "metadata": {}
}
```

`segment` is required. `source` defaults to `"api"`.

**Response `201`:**
```json
{ "leadId": "uuid", "stage": "new", "createdAt": "ISO timestamp" }
```

### Public lead ingest (no API key — landing page forms)

```
POST /api/v1/leads/public
```

Uses the `MARKETING_CLIENT_ID` server-side environment variable. `segment` and `email` are required. `source` defaults to `"landing_page"`. Same body shape as authenticated ingest.

**Response `201`:**
```json
{ "leadId": "uuid", "stage": "new" }
```

### List leads

```
GET /api/v1/leads?segment=lawyer&stage=new&limit=50&offset=0
```

All query params optional. `limit` max is 200.

**Response:**
```json
{
  "leads": [{ "leadId": "...", "segment": "...", "stage": "new", "email": "...", ... }],
  "count": 25
}
```

### Get a lead

```
GET /api/v1/leads/{leadId}
```

### Advance pipeline stage

```
PATCH /api/v1/leads/{leadId}
```

**Body:**
```json
{ "stage": "contacted | qualified | demo_booked | closed_won | closed_lost", "note": "Left voicemail", "actor": "crm-sync" }
```

`stage` is required. Automatically computes `response_time_ms` when first advancing from `new` → `contacted` (used for SLA tracking).

**Response:**
```json
{ "leadId": "...", "stage": "contacted", "qualified": false, "demoBooked": false, "responseTimeMs": 420000, "firstContactedAt": "...", "updatedAt": "..." }
```

### Daily lead metrics

```
GET /api/v1/leads/metrics/daily?date=2026-04-20
```

`date` defaults to today (UTC). Returns counts, source/segment breakdown, and SLA data.

**Response:**
```json
{
  "date": "2026-04-20",
  "newLeads": 12,
  "qualifiedLeads": 3,
  "demoBooked": 1,
  "bySource": { "landing_page": 10, "api": 2 },
  "bySegment": { "lawyer": 7, "realtor": 5 },
  "sla": {
    "targetMs": 900000,
    "avgResponseTimeMs": 420000,
    "breachCount": 0,
    "slaMetPercent": 100
  }
}
```

---

## Workflow Input Examples

### Legal: Document Review

```bash
curl -X POST .../api/v1/workflows/{workflowId}/run \
  -H "Authorization: Bearer sk_..." \
  -H "Content-Type: application/json" \
  -d '{
    "documentText": "MASTER SERVICE AGREEMENT\n\nThis agreement is entered into as of January 1, 2026..."
  }'
```

```python
import requests

resp = requests.post(
    f"https://agentic-platform-azure.vercel.app/api/v1/workflows/{workflow_id}/run",
    headers={"Authorization": f"Bearer {api_key}"},
    json={"documentText": open("contract.txt").read()}
)
print(resp.json()["output"])
```

```javascript
const res = await fetch(
  `https://agentic-platform-azure.vercel.app/api/v1/workflows/${workflowId}/run`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ documentText: contractText }),
  }
)
const { output } = await res.json()
```

### Legal: Contract Draft

```json
{
  "parties": ["Acme Corp (Client)", "LexAI LLC (Service Provider)"],
  "terms": "12-month software license for document automation platform, $1,200/month, auto-renews",
  "jurisdiction": "New York"
}
```

### Legal: Client Intake

```json
{
  "intakeText": "Name: John Smith. Matter: Wrongful termination, fired after 5 years without cause. Seeking: Back pay + damages. Urgency: Filed EEOC charge last month."
}
```

### Real Estate: Listing Generation

```json
{
  "address": "42 Maple Street, Austin TX 78701",
  "bedrooms": 4,
  "bathrooms": 3,
  "sqft": 2400,
  "features": ["renovated kitchen", "pool", "3-car garage", "cul-de-sac"],
  "askingPrice": 875000
}
```

### Real Estate: Lead Qualification

```json
{
  "conversationText": "Looking for 3br in South Austin under 600k. Pre-approved for 580k. Need to move by March. Currently renting month-to-month."
}
```

### Real Estate: Offer Comparison

```json
{
  "listingAddress": "42 Maple Street, Austin TX 78701",
  "offers": [
    { "buyer": "Chen Family", "amount": 860000, "contingencies": "inspection only", "closeDate": "45 days" },
    { "buyer": "Rodriguez LLC", "amount": 875000, "contingencies": "none", "closeDate": "30 days", "earnestMoney": 25000 },
    { "buyer": "Smith Trust", "amount": 850000, "contingencies": "financing + inspection", "closeDate": "60 days" }
  ]
}
```

---

## Plans & Pricing

| Plan | Price | Runs/month | Use case |
|---|---|---|---|
| Starter | $500/mo | 100 | Individual attorney or agent |
| Pro | $1,200/mo | 500 | Small firm or team |
| Enterprise | Custom | Unlimited | Large firm, white-label, SLA |

Consulting engagements (custom workflow setup, integration, training): $5,000–$25,000.

---

## Self-Hosting / Admin Setup

### Prerequisites

- Node.js 18+
- Neon PostgreSQL database ([console.neon.tech](https://console.neon.tech))
- Vercel account (for deployment)
- Anthropic API key

### Environment Variables

```bash
DATABASE_URL=postgres://user:password@host/dbname   # Neon connection string
ADMIN_SECRET=<openssl rand -hex 32>                 # Admin API access
ANTHROPIC_API_KEY=sk-ant-...                        # Anthropic API key
MARKETING_CLIENT_ID=<uuid>                          # Client ID for public landing-page lead ingest (see below)
```

`MARKETING_CLIENT_ID` is required for the public lead-capture forms on the landing page. Create a dedicated marketing client first (see below), then set its `id` as this variable.

### Deploy

```bash
# Install dependencies
pnpm install

# Run DB migration (first time only)
node --env-file=.env.local scripts/migrate.js

# Deploy to Vercel
vercel --prod
```

### Create a client tenant

```bash
curl -X POST https://your-domain.vercel.app/api/internal/admin/clients \
  -H "x-admin-secret: $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"name": "Acme Law Firm", "plan": "pro"}'
```

Response includes `api_key` — share this with the client.

For the public landing-page lead forms, create a dedicated marketing client and set its `id` as `MARKETING_CLIENT_ID` in your environment:

```bash
curl -X POST https://your-domain.vercel.app/api/internal/admin/clients \
  -H "x-admin-secret: $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"name": "Marketing Inbound", "plan": "starter"}'
# Copy the returned "id" → set as MARKETING_CLIENT_ID env var
```

### Create a workflow for a client

```bash
curl -X POST https://your-domain.vercel.app/api/internal/admin/workflows \
  -H "x-admin-secret: $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "<client-id-from-above>",
    "name": "Document Review",
    "vertical": "legal",
    "package": "document_review"
  }'
```

Use `workflowId` from the response when calling `/api/v1/workflows/{workflowId}/run`.

---

## Architecture

```
agentic-platform/
├── app/
│   ├── page.tsx                    # Public landing page (segmented hero + lead capture forms)
│   ├── components/
│   │   └── LeadCaptureForm.tsx     # Client-side form → /api/v1/leads/public
│   ├── dashboard/                  # Client self-serve UI
│   │   ├── leads/                  # Lead pipeline list + detail + stage management
│   │   └── runs/                   # Run history
│   └── api/
│       ├── v1/
│       │   ├── workflows/[id]/run/ # Execute workflow
│       │   ├── runs/[id]/          # Poll run status
│       │   ├── usage/              # Usage metering
│       │   ├── webhooks/[c]/[w]/   # Async webhook trigger
│       │   └── leads/              # Lead pipeline CRUD + metrics
│       │       ├── route.ts        # POST (ingest), GET (list)
│       │       ├── public/         # POST (no auth — landing page forms)
│       │       ├── [leadId]/       # GET (detail), PATCH (advance stage)
│       │       └── metrics/daily/  # GET daily KPIs + SLA instrumentation
│       └── internal/admin/
│           ├── clients/            # Tenant management
│           └── workflows/          # Workflow config
├── lib/
│   ├── auth.ts                     # API key auth
│   ├── db/
│   │   ├── client.ts               # Neon SQL client
│   │   ├── schema.sql              # DB schema (clients, workflows, runs, leads, lead_events)
│   │   ├── tenants.ts              # Client/workflow queries
│   │   ├── runs.ts                 # Run tracking
│   │   └── leads.ts                # Lead CRUD, stage transitions, daily metrics
│   ├── engine/
│   │   └── workflow-runner.ts      # Dispatch + usage metering
│   └── packages/
│       ├── legal/                  # document_review, contract_draft, client_intake
│       └── real-estate/            # listing_gen, lead_qualify, offer_compare
└── scripts/
    └── migrate.js                  # One-command DB migration
```

All AI calls route through Vercel AI Gateway (`anthropic/claude-sonnet-4.6`) with per-client cost tagging.
