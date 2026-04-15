import { redirect } from 'next/navigation'
import { getSessionClient } from '@/lib/session'
import { listRuns } from '@/lib/db/runs'

export default async function RunsPage() {
  const client = await getSessionClient()
  if (!client) redirect('/dashboard/login')

  const runs = await listRuns(client.id, 50)

  return (
    <div>
      <h1 style={s.h1}>Run History</h1>
      <div style={s.card}>
        {runs.length === 0 ? (
          <p style={s.empty}>No runs yet. Make your first API call to see results here.</p>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                {['Run ID', 'Workflow ID', 'Status', 'Tokens', 'Duration', 'Started'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {runs.map(r => (
                <tr key={r.id}>
                  <td style={s.td}><code style={s.code}>{r.id}</code></td>
                  <td style={s.td}><code style={{ ...s.code, color: '#94a3b8' }}>{r.workflow_id.slice(0, 8)}…</code></td>
                  <td style={s.td}><StatusBadge status={r.status} /></td>
                  <td style={s.td}>{r.tokens_used?.toLocaleString() ?? '—'}</td>
                  <td style={s.td}>{r.duration_ms != null ? `${r.duration_ms.toLocaleString()}ms` : '—'}</td>
                  <td style={s.td}>{new Date(r.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const bg: Record<string, string> = { done: '#dcfce7', failed: '#fee2e2', running: '#fef9c3', pending: '#f1f5f9' }
  return (
    <span style={{ background: bg[status] ?? '#f1f5f9', color: '#374151', padding: '2px 8px', borderRadius: 99, fontSize: 12 }}>
      {status}
    </span>
  )
}

const s: Record<string, React.CSSProperties> = {
  h1: { fontSize: 24, fontWeight: 700, color: '#0f172a', margin: '0 0 24px' },
  card: { background: '#fff', borderRadius: 10, padding: 24, border: '1px solid #e2e8f0' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', padding: '8px 12px', borderBottom: '1px solid #f1f5f9', textTransform: 'uppercase', letterSpacing: '.04em' },
  td: { padding: '10px 12px', fontSize: 13, color: '#374151', borderBottom: '1px solid #f8fafc' },
  code: { fontFamily: 'monospace', background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, fontSize: 12 },
  empty: { color: '#94a3b8', fontSize: 14 },
}
