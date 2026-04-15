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
```

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
│   ├── page.tsx                    # Public landing page
│   ├── dashboard/                  # Client self-serve UI
│   └── api/
│       ├── v1/
│       │   ├── workflows/[id]/run/ # Execute workflow
│       │   ├── runs/[id]/          # Poll run status
│       │   ├── usage/              # Usage metering
│       │   └── webhooks/[c]/[w]/   # Async webhook trigger
│       └── internal/admin/
│           ├── clients/            # Tenant management
│           └── workflows/          # Workflow config
├── lib/
│   ├── auth.ts                     # API key auth
│   ├── db/
│   │   ├── client.ts               # Neon SQL client
│   │   ├── schema.sql              # DB schema
│   │   ├── tenants.ts              # Client/workflow queries
│   │   └── runs.ts                 # Run tracking
│   ├── engine/
│   │   └── workflow-runner.ts      # Dispatch + usage metering
│   └── packages/
│       ├── legal/                  # document_review, contract_draft, client_intake
│       └── real-estate/            # listing_gen, lead_qualify, offer_compare
└── scripts/
    └── migrate.js                  # One-command DB migration
```

All AI calls route through Vercel AI Gateway (`anthropic/claude-sonnet-4.6`) with per-client cost tagging.
