import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth'
import { createLead, listLeads } from '@/lib/db/leads'
import type { LeadSegment, LeadSource, LeadStage } from '@/lib/db/leads'

// POST /api/v1/leads — ingest a new lead
export async function POST(request: NextRequest) {
  const client = await authenticateRequest(request)
  if (!client) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { segment, source, utmSource, utmMedium, utmCampaign, utmContent,
          firstName, lastName, email, phone, company, message, metadata } = body

  if (!segment || typeof segment !== 'string') {
    return NextResponse.json(
      { error: 'Missing required field: segment (lawyer | doctor | realtor | other)' },
      { status: 400 }
    )
  }

  const validSegments: LeadSegment[] = ['lawyer', 'doctor', 'realtor', 'other']
  if (!validSegments.includes(segment as LeadSegment)) {
    return NextResponse.json(
      { error: `Invalid segment. Must be one of: ${validSegments.join(', ')}` },
      { status: 400 }
    )
  }

  const validSources: LeadSource[] = ['landing_page', 'referral', 'direct', 'campaign', 'api']
  const resolvedSource: LeadSource =
    typeof source === 'string' && validSources.includes(source as LeadSource)
      ? (source as LeadSource)
      : 'api'

  const lead = await createLead({
    clientId: client.id,
    segment: segment as LeadSegment,
    source: resolvedSource,
    utmSource: typeof utmSource === 'string' ? utmSource : undefined,
    utmMedium: typeof utmMedium === 'string' ? utmMedium : undefined,
    utmCampaign: typeof utmCampaign === 'string' ? utmCampaign : undefined,
    utmContent: typeof utmContent === 'string' ? utmContent : undefined,
    firstName: typeof firstName === 'string' ? firstName : undefined,
    lastName: typeof lastName === 'string' ? lastName : undefined,
    email: typeof email === 'string' ? email : undefined,
    phone: typeof phone === 'string' ? phone : undefined,
    company: typeof company === 'string' ? company : undefined,
    message: typeof message === 'string' ? message : undefined,
    metadata: typeof metadata === 'object' && metadata !== null ? metadata as Record<string, unknown> : undefined,
  })

  return NextResponse.json({ leadId: lead.id, stage: lead.stage, createdAt: lead.created_at }, { status: 201 })
}

// GET /api/v1/leads — list leads with optional filters
export async function GET(request: NextRequest) {
  const client = await authenticateRequest(request)
  if (!client) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const segment = searchParams.get('segment') as LeadSegment | null
  const stage = searchParams.get('stage') as LeadStage | null
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50', 10), 200)
  const offset = parseInt(searchParams.get('offset') ?? '0', 10)

  const leads = await listLeads(client.id, {
    segment: segment ?? undefined,
    stage: stage ?? undefined,
    limit,
    offset,
  })

  return NextResponse.json({
    leads: leads.map(l => ({
      leadId: l.id,
      segment: l.segment,
      source: l.source,
      stage: l.stage,
      qualified: l.qualified,
      demoBooked: l.demo_booked,
      email: l.email,
      firstName: l.first_name,
      lastName: l.last_name,
      company: l.company,
      responseTimeMs: l.response_time_ms,
      createdAt: l.created_at,
      updatedAt: l.updated_at,
    })),
    count: leads.length,
  })
}
