import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth'
import { getLead, updateLeadStage } from '@/lib/db/leads'
import type { LeadStage } from '@/lib/db/leads'

// GET /api/v1/leads/[leadId]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  const client = await authenticateRequest(request)
  if (!client) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { leadId } = await params
  const lead = await getLead(leadId, client.id)
  if (!lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  }

  return NextResponse.json({
    leadId: lead.id,
    segment: lead.segment,
    source: lead.source,
    utmSource: lead.utm_source,
    utmMedium: lead.utm_medium,
    utmCampaign: lead.utm_campaign,
    stage: lead.stage,
    qualified: lead.qualified,
    demoBooked: lead.demo_booked,
    firstName: lead.first_name,
    lastName: lead.last_name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    message: lead.message,
    responseTimeMs: lead.response_time_ms,
    firstContactedAt: lead.first_contacted_at,
    metadata: lead.metadata,
    createdAt: lead.created_at,
    updatedAt: lead.updated_at,
  })
}

// PATCH /api/v1/leads/[leadId] — advance pipeline stage
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  const client = await authenticateRequest(request)
  if (!client) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { leadId } = await params

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { stage, actor, note } = body

  if (!stage || typeof stage !== 'string') {
    return NextResponse.json({ error: 'Missing required field: stage' }, { status: 400 })
  }

  const validStages: LeadStage[] = ['new', 'contacted', 'qualified', 'demo_booked', 'closed_won', 'closed_lost']
  if (!validStages.includes(stage as LeadStage)) {
    return NextResponse.json(
      { error: `Invalid stage. Must be one of: ${validStages.join(', ')}` },
      { status: 400 }
    )
  }

  const updated = await updateLeadStage(leadId, client.id, {
    stage: stage as LeadStage,
    actor: typeof actor === 'string' ? actor : 'api',
    note: typeof note === 'string' ? note : undefined,
  })

  if (!updated) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  }

  return NextResponse.json({
    leadId: updated.id,
    stage: updated.stage,
    qualified: updated.qualified,
    demoBooked: updated.demo_booked,
    responseTimeMs: updated.response_time_ms,
    firstContactedAt: updated.first_contacted_at,
    updatedAt: updated.updated_at,
  })
}
