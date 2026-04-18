import { sql } from './client'

export type LeadSegment = 'lawyer' | 'doctor' | 'realtor' | 'other'
export type LeadSource = 'landing_page' | 'referral' | 'direct' | 'campaign' | 'api'
export type LeadStage = 'new' | 'contacted' | 'qualified' | 'demo_booked' | 'closed_won' | 'closed_lost'
export type LeadEventType = 'stage_change' | 'note' | 'contact_attempt' | 'demo_booked' | 'qualified'

export interface Lead {
  id: string
  client_id: string
  segment: LeadSegment
  source: LeadSource
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  company: string | null
  message: string | null
  stage: LeadStage
  qualified: boolean
  demo_booked: boolean
  first_contacted_at: string | null
  response_time_ms: number | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface LeadEvent {
  id: string
  lead_id: string
  client_id: string
  event_type: LeadEventType
  from_stage: string | null
  to_stage: string | null
  note: string | null
  actor: string | null
  created_at: string
}

export interface CreateLeadInput {
  clientId: string
  segment: LeadSegment
  source?: LeadSource
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  company?: string
  message?: string
  metadata?: Record<string, unknown>
}

export async function createLead(input: CreateLeadInput): Promise<Lead> {
  const rows = await sql`
    INSERT INTO leads (
      client_id, segment, source,
      utm_source, utm_medium, utm_campaign, utm_content,
      first_name, last_name, email, phone, company, message,
      metadata
    )
    VALUES (
      ${input.clientId},
      ${input.segment},
      ${input.source ?? 'direct'},
      ${input.utmSource ?? null},
      ${input.utmMedium ?? null},
      ${input.utmCampaign ?? null},
      ${input.utmContent ?? null},
      ${input.firstName ?? null},
      ${input.lastName ?? null},
      ${input.email ?? null},
      ${input.phone ?? null},
      ${input.company ?? null},
      ${input.message ?? null},
      ${JSON.stringify(input.metadata ?? {})}
    )
    RETURNING *
  `
  return rows[0] as Lead
}

export async function getLead(leadId: string, clientId: string): Promise<Lead | null> {
  const rows = await sql`
    SELECT * FROM leads WHERE id = ${leadId} AND client_id = ${clientId}
  `
  return (rows[0] as Lead) ?? null
}

export async function listLeads(
  clientId: string,
  opts: { segment?: LeadSegment; stage?: LeadStage; limit?: number; offset?: number } = {}
): Promise<Lead[]> {
  const { segment, stage, limit = 50, offset = 0 } = opts

  // Build dynamic filters
  if (segment && stage) {
    const rows = await sql`
      SELECT * FROM leads
      WHERE client_id = ${clientId} AND segment = ${segment} AND stage = ${stage}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `
    return rows as Lead[]
  } else if (segment) {
    const rows = await sql`
      SELECT * FROM leads
      WHERE client_id = ${clientId} AND segment = ${segment}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `
    return rows as Lead[]
  } else if (stage) {
    const rows = await sql`
      SELECT * FROM leads
      WHERE client_id = ${clientId} AND stage = ${stage}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `
    return rows as Lead[]
  } else {
    const rows = await sql`
      SELECT * FROM leads
      WHERE client_id = ${clientId}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `
    return rows as Lead[]
  }
}

export interface UpdateLeadStageInput {
  stage: LeadStage
  actor?: string
  note?: string
}

export async function updateLeadStage(
  leadId: string,
  clientId: string,
  input: UpdateLeadStageInput
): Promise<Lead | null> {
  // Fetch current lead first
  const current = await getLead(leadId, clientId)
  if (!current) return null

  const { stage, actor = 'system', note } = input
  const now = new Date()

  // Derived flags
  const isFirstContact = current.stage === 'new' && stage === 'contacted' && !current.first_contacted_at
  const qualified = stage === 'qualified' || stage === 'demo_booked' || stage === 'closed_won' || current.qualified
  const demoBooked = stage === 'demo_booked' || current.demo_booked

  // Compute response_time_ms when first contact is recorded
  const createdAt = new Date(current.created_at)
  const responseTimeMs = isFirstContact
    ? now.getTime() - createdAt.getTime()
    : current.response_time_ms

  const rows = await sql`
    UPDATE leads
    SET
      stage = ${stage},
      qualified = ${qualified},
      demo_booked = ${demoBooked},
      first_contacted_at = CASE
        WHEN ${isFirstContact} AND first_contacted_at IS NULL THEN ${now.toISOString()}
        ELSE first_contacted_at
      END,
      response_time_ms = COALESCE(${responseTimeMs}, response_time_ms),
      updated_at = NOW()
    WHERE id = ${leadId} AND client_id = ${clientId}
    RETURNING *
  `
  const updated = rows[0] as Lead

  // Record the event
  await sql`
    INSERT INTO lead_events (lead_id, client_id, event_type, from_stage, to_stage, note, actor)
    VALUES (
      ${leadId},
      ${clientId},
      'stage_change',
      ${current.stage},
      ${stage},
      ${note ?? null},
      ${actor}
    )
  `

  return updated
}

// ────────────────────────────────────────────────────────────
// Daily metrics for the dashboard / campaign optimization feed
// ────────────────────────────────────────────────────────────

export interface DailyLeadMetrics {
  date: string                // ISO date (YYYY-MM-DD)
  new_leads: number
  qualified_leads: number
  demo_booked: number
  by_source: Record<string, number>   // source → count
  by_segment: Record<string, number>  // segment → count
  avg_response_time_ms: number | null // null when no contacts yet
  sla_breaches: number                // leads contacted after 15 min
}

export async function getDailyMetrics(
  clientId: string,
  date: string // YYYY-MM-DD
): Promise<DailyLeadMetrics> {
  const [countRows, sourceRows, segmentRows, responseRows] = await Promise.all([
    // Totals for the day
    sql`
      SELECT
        COUNT(*) FILTER (WHERE TRUE)::int                                  AS new_leads,
        COUNT(*) FILTER (WHERE qualified = TRUE)::int                      AS qualified_leads,
        COUNT(*) FILTER (WHERE demo_booked = TRUE)::int                    AS demo_booked
      FROM leads
      WHERE client_id = ${clientId}
        AND DATE(created_at AT TIME ZONE 'UTC') = ${date}::date
    `,
    // By source
    sql`
      SELECT source, COUNT(*)::int AS cnt
      FROM leads
      WHERE client_id = ${clientId}
        AND DATE(created_at AT TIME ZONE 'UTC') = ${date}::date
      GROUP BY source
    `,
    // By segment
    sql`
      SELECT segment, COUNT(*)::int AS cnt
      FROM leads
      WHERE client_id = ${clientId}
        AND DATE(created_at AT TIME ZONE 'UTC') = ${date}::date
      GROUP BY segment
    `,
    // Response-time stats (only leads that were contacted)
    sql`
      SELECT
        AVG(response_time_ms)::bigint                          AS avg_response_time_ms,
        COUNT(*) FILTER (WHERE response_time_ms > 900000)::int AS sla_breaches
      FROM leads
      WHERE client_id = ${clientId}
        AND DATE(created_at AT TIME ZONE 'UTC') = ${date}::date
        AND response_time_ms IS NOT NULL
    `,
  ])

  const counts = countRows[0] as { new_leads: number; qualified_leads: number; demo_booked: number }
  const responseStats = responseRows[0] as { avg_response_time_ms: number | null; sla_breaches: number }

  const bySource: Record<string, number> = {}
  for (const row of sourceRows as Array<{ source: string; cnt: number }>) {
    bySource[row.source] = row.cnt
  }

  const bySegment: Record<string, number> = {}
  for (const row of segmentRows as Array<{ segment: string; cnt: number }>) {
    bySegment[row.segment] = row.cnt
  }

  return {
    date,
    new_leads: counts.new_leads,
    qualified_leads: counts.qualified_leads,
    demo_booked: counts.demo_booked,
    by_source: bySource,
    by_segment: bySegment,
    avg_response_time_ms: responseStats.avg_response_time_ms,
    sla_breaches: responseStats.sla_breaches,
  }
}

export async function getLeadEvents(leadId: string, clientId: string): Promise<LeadEvent[]> {
  const rows = await sql`
    SELECT * FROM lead_events
    WHERE lead_id = ${leadId} AND client_id = ${clientId}
    ORDER BY created_at DESC
  `
  return rows as LeadEvent[]
}
