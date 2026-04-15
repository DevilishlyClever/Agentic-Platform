import { redirect } from 'next/navigation'
import { getSessionClient } from '@/lib/session'
import { getMonthlyUsage, listRuns } from '@/lib/db/runs'
import { listWorkflowRecords } from '@/lib/db/tenants'

export default async function DashboardPage() {
  const client = await getSessionClient()
  if (!client) redirect('/dashboard/login')

  const [usage, runs, workflows] = await Promise.all([
    getMonthlyUsage(client.id),
    listRuns(client.id, 5),
    listWorkflowRecords(client.id),
  ])

  const planLimits: Record<string, number> = { starter: 100, pro: 1000, enterprise: Infinity }
  const limit = planLimits[client.plan] ?? 100
  const usagePct = Math.min(100, Math.round((usage.runs / limit) * 100))

  return (
    <div>
      <h1 style={s.h1}>Overview</h1>

      {/* Stats */}
      <div style={s.stats}>
        <StatCard label="Runs this month" value={String(usage.runs)} sub={`of ${limit === Infinity ? '∞' : limit} (${client.plan})`} />
        <StatCard label="Tokens used" value={usage.tokens.toLocaleString()} sub="this month" />
        <StatCard label="Active workflows" value={String(workflows.length)} sub="configured" />
        <StatCard label="Usage" value={`${usagePct}%`} sub="of plan limit" accent={usagePct > 80} />
      </div>

      {/* Workflows */}
      <section style={s.section}>
        <h2 style={s.h2}>Your Workflows</h2>
        {workflows.length === 0 ? (
          <p style={s.empty}>No workflows configured yet. Contact your administrator to set up workflows.</p>
        ) : (
          <table style={s.table}>
            <thead><tr>{['Name', 'Vertical', 'Package', 'ID'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
            <tbody>
              {workflows.map(w => (
                <tr key={w.id}>
                  <td style={s.td}>{w.name}</td>
                  <td style={s.td}><Badge label={w.vertical} /></td>
                  <td style={s.td}><code style={s.code}>{w.package}</code></td>
                  <td style={s.td}><code style={{ ...s.code, color: '#94a3b8', fontSize: 11 }}>{w.id}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Recent runs */}
      <section style={s.section}>
        <h2 style={s.h2}>Recent Runs <a href="/dashboard/runs" style={s.viewAll}>View all →</a></h2>
        {runs.length === 0 ? (
          <p style={s.empty}>No runs yet. Make your first API call to see results here.</p>
        ) : (
          <table style={s.table}>
            <thead><tr>{['Run ID', 'Workflow', 'Status', 'Tokens', 'Duration', 'Started'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
            <tbody>
              {runs.map(r => (
                <tr key={r.id}>
                  <td style={s.td}><code style={{ ...s.code, fontSize: 11 }}>{r.id.slice(0, 8)}…</code></td>
                  <td style={s.td}><code style={{ ...s.code, fontSize: 11 }}>{r.workflow_id.slice(0, 8)}…</code></td>
                  <td style={s.td}><StatusBadge status={r.status} /></td>
                  <td style={s.td}>{r.tokens_used ?? '—'}</td>
                  <td style={s.td}>{r.duration_ms != null ? `${r.duration_ms}ms` : '—'}</td>
                  <td style={s.td}>{new Date(r.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div style={{ ...s.statCard, borderColor: accent ? '#fbbf24' : '#e2e8f0' }}>
      <div style={s.statLabel}>{label}</div>
      <div style={{ ...s.statValue, color: accent ? '#d97706' : '#0f172a' }}>{value}</div>
      <div style={s.statSub}>{sub}</div>
    </div>
  )
}

function Badge({ label }: { label: string }) {
  const colors: Record<string, string> = { legal: '#dbeafe', real_estate: '#dcfce7' }
  return <span style={{ background: colors[label] ?? '#f1f5f9', color: '#374151', padding: '2px 8px', borderRadius: 99, fontSize: 12 }}>{label}</span>
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { done: '#dcfce7', failed: '#fee2e2', running: '#fef9c3', pending: '#f1f5f9' }
  return <span style={{ background: colors[status] ?? '#f1f5f9', color: '#374151', padding: '2px 8px', borderRadius: 99, fontSize: 12 }}>{status}</span>
}

const s: Record<string, React.CSSProperties> = {
  h1: { fontSize: 24, fontWeight: 700, color: '#0f172a', margin: '0 0 24px' },
  h2: { fontSize: 18, fontWeight: 600, color: '#0f172a', margin: '0 0 16px' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 },
  statCard: { background: '#fff', borderRadius: 10, padding: '20px 24px', border: '1px solid #e2e8f0' },
  statLabel: { fontSize: 12, color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 },
  statValue: { fontSize: 28, fontWeight: 700, lineHeight: 1 },
  statSub: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  section: { background: '#fff', borderRadius: 10, padding: 24, border: '1px solid #e2e8f0', marginBottom: 24 },
  table: { width: '100%', borderCollapse: 'collapse' as const },
  th: { textAlign: 'left' as const, fontSize: 12, fontWeight: 600, color: '#64748b', padding: '8px 12px', borderBottom: '1px solid #f1f5f9', textTransform: 'uppercase' as const, letterSpacing: '.04em' },
  td: { padding: '10px 12px', fontSize: 13, color: '#374151', borderBottom: '1px solid #f8fafc' },
  code: { fontFamily: 'monospace', background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 },
  empty: { color: '#94a3b8', fontSize: 14 },
  viewAll: { fontSize: 13, color: '#2563eb', textDecoration: 'none', fontWeight: 400, marginLeft: 8 },
}
