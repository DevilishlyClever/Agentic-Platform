import { redirect } from 'next/navigation'
import { getSessionClient } from '@/lib/session'
import { listLeads, getDailyMetrics } from '@/lib/db/leads'
import type { LeadSegment, LeadStage } from '@/lib/db/leads'

const SEGMENTS: LeadSegment[] = ['lawyer', 'doctor', 'realtor', 'other']
const STAGES: LeadStage[] = ['new', 'contacted', 'qualified', 'demo_booked', 'closed_won', 'closed_lost']

const STAGE_COLORS: Record<LeadStage, { bg: string; color: string }> = {
  new: { bg: '#f1f5f9', color: '#475569' },
  contacted: { bg: '#dbeafe', color: '#1d4ed8' },
  qualified: { bg: '#dcfce7', color: '#15803d' },
  demo_booked: { bg: '#fef9c3', color: '#a16207' },
  closed_won: { bg: '#bbf7d0', color: '#166534' },
  closed_lost: { bg: '#fee2e2', color: '#b91c1c' },
}

const SEGMENT_COLORS: Record<string, string> = {
  lawyer: '#dbeafe',
  doctor: '#fae8ff',
  realtor: '#dcfce7',
  other: '#f1f5f9',
}

function fmtResponseTime(ms: number | null): string {
  if (ms == null) return '—'
  const mins = Math.round(ms / 60_000)
  if (mins < 60) return `${mins}m`
  return `${Math.round(mins / 60)}h ${mins % 60}m`
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const client = await getSessionClient()
  if (!client) redirect('/dashboard/login')

  const sp = await searchParams
  const segmentFilter = SEGMENTS.includes(sp.segment as LeadSegment) ? (sp.segment as LeadSegment) : undefined
  const stageFilter = STAGES.includes(sp.stage as LeadStage) ? (sp.stage as LeadStage) : undefined
  const page = Math.max(0, parseInt(sp.page ?? '0', 10))
  const limit = 25

  const today = new Date().toISOString().slice(0, 10)
  const [leads, metrics] = await Promise.all([
    listLeads(client.id, { segment: segmentFilter, stage: stageFilter, limit, offset: page * limit }),
    getDailyMetrics(client.id, today),
  ])

  function filterHref(overrides: Record<string, string | undefined>) {
    const p = new URLSearchParams()
    if (segmentFilter) p.set('segment', segmentFilter)
    if (stageFilter) p.set('stage', stageFilter)
    if (page > 0) p.set('page', String(page))
    for (const [k, v] of Object.entries(overrides)) {
      if (v == null) p.delete(k)
      else p.set(k, v)
    }
    p.delete('page') // reset page on filter change
    const s = p.toString()
    return `/dashboard/leads${s ? `?${s}` : ''}`
  }

  return (
    <div>
      <h1 style={s.h1}>Lead Pipeline</h1>

      {/* Today's metrics */}
      <div style={s.metricsRow}>
        <MetricCard label="New today" value={metrics.new_leads} />
        <MetricCard label="Qualified" value={metrics.qualified_leads} accent="#15803d" />
        <MetricCard label="Demos booked" value={metrics.demo_booked} accent="#a16207" />
        <MetricCard
          label="SLA breaches"
          value={metrics.sla_breaches}
          accent={metrics.sla_breaches > 0 ? '#b91c1c' : undefined}
          sub=">15 min to contact"
        />
      </div>

      {/* Filters */}
      <div style={s.filters}>
        <div style={s.filterGroup}>
          <span style={s.filterLabel}>Segment</span>
          <a href={filterHref({ segment: undefined })} style={{ ...s.pill, ...(segmentFilter == null ? s.pillActive : {}) }}>All</a>
          {SEGMENTS.map(seg => (
            <a
              key={seg}
              href={filterHref({ segment: seg === segmentFilter ? undefined : seg })}
              style={{ ...s.pill, ...(segmentFilter === seg ? s.pillActive : {}) }}
            >
              {seg}
            </a>
          ))}
        </div>
        <div style={s.filterGroup}>
          <span style={s.filterLabel}>Stage</span>
          <a href={filterHref({ stage: undefined })} style={{ ...s.pill, ...(stageFilter == null ? s.pillActive : {}) }}>All</a>
          {STAGES.map(st => (
            <a
              key={st}
              href={filterHref({ stage: st === stageFilter ? undefined : st })}
              style={{ ...s.pill, ...(stageFilter === st ? s.pillActive : {}) }}
            >
              {st.replace('_', ' ')}
            </a>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={s.card}>
        {leads.length === 0 ? (
          <p style={s.empty}>No leads match the current filters.</p>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                {['Name / Email', 'Segment', 'Source', 'Stage', 'Response time', 'Created'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => {
                const stageStyle = STAGE_COLORS[lead.stage] ?? { bg: '#f1f5f9', color: '#374151' }
                const slaBreached = lead.response_time_ms != null && lead.response_time_ms > 900_000
                const name = [lead.first_name, lead.last_name].filter(Boolean).join(' ') || '—'
                return (
                  <tr key={lead.id} style={{ cursor: 'pointer' }}>
                    <td style={s.td}>
                      <a href={`/dashboard/leads/${lead.id}`} style={s.nameLink}>
                        <div style={s.nameText}>{name}</div>
                        <div style={s.emailText}>{lead.email ?? '—'}</div>
                      </a>
                    </td>
                    <td style={s.td}>
                      <span style={{ ...s.badge, background: SEGMENT_COLORS[lead.segment] ?? '#f1f5f9' }}>
                        {lead.segment}
                      </span>
                    </td>
                    <td style={{ ...s.td, color: '#64748b', fontSize: 12 }}>{lead.source.replace('_', ' ')}</td>
                    <td style={s.td}>
                      <span style={{ ...s.badge, background: stageStyle.bg, color: stageStyle.color }}>
                        {lead.stage.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ ...s.td, color: slaBreached ? '#b91c1c' : '#374151', fontWeight: slaBreached ? 600 : 400 }}>
                      {fmtResponseTime(lead.response_time_ms)}
                      {slaBreached && <span style={s.slaFlag}> !</span>}
                    </td>
                    <td style={{ ...s.td, color: '#64748b', fontSize: 12 }}>
                      {new Date(lead.created_at).toLocaleString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {(page > 0 || leads.length === limit) && (
          <div style={s.pagination}>
            {page > 0 && (
              <a href={filterHref({ page: page > 1 ? String(page - 1) : undefined })} style={s.pageBtn}>← Previous</a>
            )}
            <span style={s.pageInfo}>Page {page + 1}</span>
            {leads.length === limit && (
              <a href={filterHref({ page: String(page + 1) })} style={s.pageBtn}>Next →</a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function MetricCard({ label, value, accent, sub }: { label: string; value: number; accent?: string; sub?: string }) {
  return (
    <div style={s.metricCard}>
      <div style={s.metricLabel}>{label}</div>
      <div style={{ ...s.metricValue, color: accent ?? '#0f172a' }}>{value}</div>
      {sub && <div style={s.metricSub}>{sub}</div>}
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  h1: { fontSize: 24, fontWeight: 700, color: '#0f172a', margin: '0 0 24px' },
  metricsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 },
  metricCard: { background: '#fff', borderRadius: 10, padding: '20px 24px', border: '1px solid #e2e8f0' },
  metricLabel: { fontSize: 12, color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 },
  metricValue: { fontSize: 28, fontWeight: 700, lineHeight: 1 },
  metricSub: { fontSize: 11, color: '#94a3b8', marginTop: 4 },
  filters: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 },
  filterGroup: { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  filterLabel: { fontSize: 12, color: '#94a3b8', fontWeight: 500, minWidth: 52 },
  pill: { padding: '4px 10px', borderRadius: 99, fontSize: 12, textDecoration: 'none', color: '#374151', background: '#f1f5f9', border: '1px solid transparent' },
  pillActive: { background: '#0f172a', color: '#fff' },
  card: { background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', padding: '10px 14px', borderBottom: '1px solid #f1f5f9', textTransform: 'uppercase', letterSpacing: '.04em' },
  td: { padding: '10px 14px', fontSize: 13, color: '#374151', borderBottom: '1px solid #f8fafc' },
  nameLink: { textDecoration: 'none', color: 'inherit' },
  nameText: { fontWeight: 500, color: '#0f172a' },
  emailText: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  badge: { display: 'inline-block', padding: '2px 8px', borderRadius: 99, fontSize: 12, color: '#374151' },
  slaFlag: { color: '#b91c1c', fontWeight: 700 },
  empty: { color: '#94a3b8', fontSize: 14, padding: 24 },
  pagination: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderTop: '1px solid #f1f5f9' },
  pageBtn: { padding: '6px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, textDecoration: 'none', color: '#374151' },
  pageInfo: { fontSize: 13, color: '#94a3b8' },
}
