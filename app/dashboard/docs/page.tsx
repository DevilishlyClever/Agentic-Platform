import { redirect } from 'next/navigation'
import { getSessionClient } from '@/lib/session'
import { listWorkflowRecords } from '@/lib/db/tenants'

export default async function DocsPage() {
  const client = await getSessionClient()
  if (!client) redirect('/dashboard/login')

  const workflows = await listWorkflowRecords(client.id)
  const firstWorkflow = workflows[0]

  return (
    <div>
      <h1 style={s.h1}>API Documentation</h1>
      <p style={s.intro}>Use your API key to authenticate all requests with <code style={s.ic}>Authorization: Bearer sk_...</code></p>

      <Section title="Run a Workflow">
        <p style={s.p}>Synchronously execute a workflow and get the structured output immediately.</p>
        <Pre>{`POST /api/v1/workflows/{workflowId}/run
Authorization: Bearer sk_...
Content-Type: application/json

{
  "documentText": "...",   // for document_review
  "templateType": "...",   // for contract_draft
  "formData": { ... },     // for client_intake
  "propertyData": { ... }, // for listing_gen
  "conversation": [...],   // for lead_qualify
  "offers": [...]          // for offer_compare
}`}</Pre>
        <Pre label="Response">{`{
  "runId": "uuid",
  "status": "done",
  "output": { ... },
  "usage": { "tokensUsed": 1420, "durationMs": 2340 }
}`}</Pre>
      </Section>

      <Section title="Async Webhook Trigger">
        <p style={s.p}>Trigger a workflow via webhook. Returns 202 immediately; poll for results.</p>
        <Pre>{`POST /api/v1/webhooks/${client.id}/{workflowId}
x-api-key: sk_...
Content-Type: application/json

{ ...same payload as above... }`}</Pre>
        <Pre label="Response (202)">{`{ "runId": "uuid", "status": "pending" }`}</Pre>
      </Section>

      <Section title="Poll Run Status">
        <Pre>{`GET /api/v1/runs/{runId}
Authorization: Bearer sk_...`}</Pre>
        <Pre label="Response">{`{
  "runId": "uuid",
  "status": "done",
  "output": { ... },
  "usage": { "tokensUsed": 1420, "durationMs": 2340 },
  "createdAt": "2026-04-15T..."
}`}</Pre>
      </Section>

      <Section title="View Usage">
        <Pre>{`GET /api/v1/usage
Authorization: Bearer sk_...`}</Pre>
        <Pre label="Response">{`{
  "plan": "pro",
  "month": "2026-04",
  "runs": 42,
  "tokensUsed": 87500
}`}</Pre>
      </Section>

      {workflows.length > 0 && (
        <Section title="Your Workflow IDs">
          <table style={s.table}>
            <thead><tr>{['Name', 'Package', 'Workflow ID'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
            <tbody>
              {workflows.map(w => (
                <tr key={w.id}>
                  <td style={s.td}>{w.name}</td>
                  <td style={s.td}><code style={s.ic}>{w.package}</code></td>
                  <td style={s.td}><code style={{ ...s.ic, fontSize: 12, color: '#2563eb' }}>{w.id}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
          {firstWorkflow && (
            <details style={s.details}>
              <summary style={s.summary}>Quick start example</summary>
              <Pre>{`curl -X POST https://${process.env.VERCEL_URL ?? 'your-domain.com'}/api/v1/workflows/${firstWorkflow.id}/run \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "documentText": "This agreement is entered into..." }'`}</Pre>
            </details>
          )}
        </Section>
      )}

      <Section title="SDK Examples">
        <details style={s.details} open>
          <summary style={s.summary}>JavaScript / Node.js</summary>
          <Pre>{`const res = await fetch('https://your-domain.com/api/v1/workflows/WORKFLOW_ID/run', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ documentText: '...' }),
})
const { runId, output } = await res.json()`}</Pre>
        </details>
        <details style={s.details}>
          <summary style={s.summary}>Python</summary>
          <Pre>{`import requests

response = requests.post(
    'https://your-domain.com/api/v1/workflows/WORKFLOW_ID/run',
    headers={'Authorization': 'Bearer YOUR_API_KEY'},
    json={'documentText': '...'}
)
data = response.json()
print(data['output'])`}</Pre>
        </details>
        <details style={s.details}>
          <summary style={s.summary}>cURL</summary>
          <Pre>{`curl -X POST https://your-domain.com/api/v1/workflows/WORKFLOW_ID/run \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"documentText": "..."}'`}</Pre>
        </details>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={s.section}>
      <h2 style={s.h2}>{title}</h2>
      {children}
    </section>
  )
}

function Pre({ children, label }: { children: string; label?: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <div style={s.preLabel}>{label}</div>}
      <pre style={s.pre}>{children}</pre>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  h1: { fontSize: 24, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' },
  h2: { fontSize: 16, fontWeight: 600, color: '#0f172a', margin: '0 0 12px' },
  intro: { color: '#64748b', fontSize: 14, marginBottom: 28 },
  p: { color: '#374151', fontSize: 14, marginBottom: 12 },
  section: { background: '#fff', borderRadius: 10, padding: 24, border: '1px solid #e2e8f0', marginBottom: 20 },
  pre: { background: '#0f172a', color: '#e2e8f0', padding: 16, borderRadius: 8, fontSize: 13, overflowX: 'auto', margin: 0, fontFamily: 'monospace', lineHeight: 1.6 },
  preLabel: { fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 },
  ic: { fontFamily: 'monospace', background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, fontSize: 13 },
  table: { width: '100%', borderCollapse: 'collapse', marginBottom: 16 },
  th: { textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', padding: '8px 12px', borderBottom: '1px solid #f1f5f9', textTransform: 'uppercase', letterSpacing: '.04em' },
  td: { padding: '10px 12px', fontSize: 13, color: '#374151', borderBottom: '1px solid #f8fafc' },
  details: { marginTop: 12 },
  summary: { fontSize: 14, fontWeight: 500, color: '#374151', cursor: 'pointer', padding: '8px 0' },
}
