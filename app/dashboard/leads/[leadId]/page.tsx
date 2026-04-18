import { notFound, redirect } from 'next/navigation'
import { getSessionClient } from '@/lib/session'
import { getLead, getLeadEvents } from '@/lib/db/leads'
import type { LeadStage } from '@/lib/db/leads'
import { advanceStageAction } from './actions'

const STAGES: LeadStage[] = ['new', 'contacted', 'qualified', 'demo_booked', 'closed_won', 'closed_lost']

const STAGE_COLORS: Record<LeadStage, { bg: string; color: string }> = {
  new: { bg: '#f1f5f9', color: '#475569' },
  contacted: { bg: '#dbeafe', color: '#1d4ed8' },
  qualified: { bg: '#dcfce7', color: '#15803d' },
  demo_booked: { bg: '#fef9c3', color: '#a16207' },
  closed_won: { bg: '#bbf7d0', color: '#166534' },
  closed_lost: { bg: '#fee2e2', color: '#b91c1c' },
}

function fmtMs(ms: number | null): string {
  if (ms == null) return '—'
  const mins = Math.round(ms / 60_000)
  if (mins < 60) return `${mins}m`
  return `${Math.floor(mins / 60)}h ${mins % 60}m`
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ leadId: string }>
}) {
  const client = await getSessionClient()
  if (!client) redirect('/dashboard/login')

  const { leadId } = await params
  const [lead, events] = await Promise.all([
    getLead(leadId, client.id),
    getLeadEvents(leadId, client.id),
  ])
  if (!lead) notFound()

  const stageStyle = STAGE_COLORS[lead.stage] ?? { bg: '#f1f5f9', color: '#374151' }
  const slaBreached = lead.response_time_ms != null && lead.response_time_ms > 900_000
  const name = [lead.first_name, lead.last_name].filter(Boolean).join(' ') || 'Unknown'
  const nextStages = STAGES.filter(s => s !== lead.stage)

  return (
    <div>
      <div style={s.breadcrumb}>
        <a href="/dashboard/leads" style={s.breadcrumbLink}>Lead Pipeline</a>
        <span style={s.breadcrumbSep}>/</span>
        <span>{name}</span>
      </div>
      <h1 style={s.h1}>{name}</h1>

      <div style={s.layout}>
        {/* Left: lead details */}
        <div style={{ flex: 1 }}>
          {/* Contact info */}
          <div style={s.card}>
            <h2 style={s.cardTitle}>Contact</h2>
            <dl style={s.dl}>
              <Field label="Email" value={lead.email} />
              <Field label="Phone" value={lead.phone} />
              <Field label="Company" value={lead.company} />
              <Field label="Segment" value={lead.segment} />
              <Field label="Source" value={lead.source?.replace('_', ' ')} />
            </dl>
          </div>

          {/* UTM attribution */}
          {(lead.utm_source || lead.utm_medium || lead.utm_campaign) && (
            <div style={s.card}>
              <h2 style={s.cardTitle}>Attribution</h2>
              <dl style={s.dl}>
                <Field label="utm_source" value={lead.utm_source} />
                <Field label="utm_medium" value={lead.utm_medium} />
                <Field label="utm_campaign" value={lead.utm_campaign} />
                <Field label="utm_content" value={lead.utm_content} />
              </dl>
            </div>
          )}

          {/* Message */}
          {lead.message && (
            <div style={s.card}>
              <h2 style={s.cardTitle}>Message</h2>
              <p style={s.message}>{lead.message}</p>
            </div>
          )}

          {/* Event timeline */}
          <div style={s.card}>
            <h2 style={s.cardTitle}>Activity</h2>
            {events.length === 0 ? (
              <p style={s.empty}>No activity yet.</p>
            ) : (
              <ol style={s.timeline}>
                {events.map(ev => (
                  <li key={ev.id} style={s.timelineItem}>
                    <div style={s.timelineDot} />
                    <div>
                      <div style={s.timelineTitle}>
                        {ev.event_type === 'stage_change'
                          ? `Stage: ${ev.from_stage?.replace('_', ' ')} → ${ev.to_stage?.replace('_', ' ')}`
                          : ev.event_type.replace('_', ' ')}
                        {ev.actor && ev.actor !== 'system' && (
                          <span style={s.timelineActor}> via {ev.actor}</span>
                        )}
                      </div>
                      {ev.note && <div style={s.timelineNote}>{ev.note}</div>}
                      <div style={s.timelineTime}>{new Date(ev.created_at).toLocaleString()}</div>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        {/* Right: status + actions */}
        <div style={s.sidebar}>
          {/* Current status */}
          <div style={s.card}>
            <h2 style={s.cardTitle}>Status</h2>
            <div style={{ marginBottom: 16 }}>
              <span style={{ ...s.stageBadge, background: stageStyle.bg, color: stageStyle.color }}>
                {lead.stage.replace('_', ' ')}
              </span>
            </div>
            <dl style={s.dl}>
              <Field label="Qualified" value={lead.qualified ? 'Yes' : 'No'} />
              <Field label="Demo booked" value={lead.demo_booked ? 'Yes' : 'No'} />
              <Field
                label="Response time"
                value={fmtMs(lead.response_time_ms)}
                accent={slaBreached ? '#b91c1c' : undefined}
              />
              <Field label="Created" value={new Date(lead.created_at).toLocaleString()} />
            </dl>
          </div>

          {/* Stage transition */}
          <div style={s.card}>
            <h2 style={s.cardTitle}>Advance Stage</h2>
            <form action={advanceStageAction}>
              <input type="hidden" name="leadId" value={lead.id} />
              <div style={{ marginBottom: 10 }}>
                <label style={s.label}>New stage</label>
                <select name="stage" style={s.select} defaultValue="">
                  <option value="" disabled>Select…</option>
                  {nextStages.map(st => (
                    <option key={st} value={st}>{st.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={s.label}>Note (optional)</label>
                <textarea name="note" style={s.textarea} rows={2} placeholder="e.g. Left voicemail" />
              </div>
              <button type="submit" style={s.btn}>Save</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  accent,
}: {
  label: string
  value: string | null | undefined
  accent?: string
}) {
  if (!value) return null
  return (
    <>
      <dt style={s.dt}>{label}</dt>
      <dd style={{ ...s.dd, color: accent ?? '#0f172a' }}>{value}</dd>
    </>
  )
}

const s: Record<string, React.CSSProperties> = {
  breadcrumb: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b', marginBottom: 12 },
  breadcrumbLink: { color: '#2563eb', textDecoration: 'none' },
  breadcrumbSep: { color: '#cbd5e1' },
  h1: { fontSize: 24, fontWeight: 700, color: '#0f172a', margin: '0 0 24px' },
  layout: { display: 'flex', gap: 20, alignItems: 'flex-start' },
  sidebar: { width: 280, flexShrink: 0 },
  card: { background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', padding: 20, marginBottom: 16 },
  cardTitle: { fontSize: 13, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.05em', margin: '0 0 14px' },
  dl: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', margin: 0 },
  dt: { fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.04em', alignSelf: 'center' },
  dd: { fontSize: 13, color: '#0f172a', margin: 0 },
  stageBadge: { display: 'inline-block', padding: '4px 12px', borderRadius: 99, fontSize: 13, fontWeight: 600 },
  message: { fontSize: 13, color: '#374151', lineHeight: 1.6, margin: 0 },
  empty: { fontSize: 13, color: '#94a3b8' },
  timeline: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 },
  timelineItem: { display: 'flex', gap: 12, position: 'relative' },
  timelineDot: { width: 8, height: 8, borderRadius: '50%', background: '#cbd5e1', marginTop: 5, flexShrink: 0 },
  timelineTitle: { fontSize: 13, fontWeight: 500, color: '#0f172a' },
  timelineActor: { fontSize: 12, color: '#94a3b8', fontWeight: 400 },
  timelineNote: { fontSize: 12, color: '#64748b', marginTop: 2 },
  timelineTime: { fontSize: 11, color: '#94a3b8', marginTop: 4 },
  label: { display: 'block', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 4 },
  select: { width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13, color: '#0f172a', background: '#fff' },
  textarea: { width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13, color: '#0f172a', resize: 'vertical', boxSizing: 'border-box' },
  btn: { padding: '8px 20px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%' },
}
