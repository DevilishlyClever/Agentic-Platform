import { NextRequest, NextResponse } from 'next/server'
import { createLead } from '@/lib/db/leads'
import type { LeadSegment, LeadSource } from '@/lib/db/leads'

// Public lead ingest — no API key required.
// Used by landing page forms. The server uses MARKETING_CLIENT_ID
// to tag all inbound marketing leads to the correct tenant.
// No credentials are exposed to the browser.

const VALID_SEGMENTS: LeadSegment[] = ['lawyer', 'doctor', 'realtor', 'other']
const VALID_SOURCES: LeadSource[] = ['landing_page', 'referral', 'direct', 'campaign', 'api']

export async function POST(request: NextRequest) {
  const clientId = process.env.MARKETING_CLIENT_ID
  if (!clientId) {
    // Misconfigured deployment — fail loudly in server logs, generically to caller
    console.error('[leads/public] MARKETING_CLIENT_ID env var is not set')
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { segment, source, utmSource, utmMedium, utmCampaign, utmContent,
          firstName, lastName, email, phone, company, message, metadata } = body

  if (!segment || typeof segment !== 'string' || !VALID_SEGMENTS.includes(segment as LeadSegment)) {
    return NextResponse.json(
      { error: `segment is required and must be one of: ${VALID_SEGMENTS.join(', ')}` },
      { status: 400 }
    )
  }

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'email is required' }, { status: 400 })
  }

  const resolvedSource: LeadSource =
    typeof source === 'string' && VALID_SOURCES.includes(source as LeadSource)
      ? (source as LeadSource)
      : 'landing_page'

  const lead = await createLead({
    clientId,
    segment: segment as LeadSegment,
    source: resolvedSource,
    utmSource: typeof utmSource === 'string' ? utmSource : undefined,
    utmMedium: typeof utmMedium === 'string' ? utmMedium : undefined,
    utmCampaign: typeof utmCampaign === 'string' ? utmCampaign : undefined,
    utmContent: typeof utmContent === 'string' ? utmContent : undefined,
    firstName: typeof firstName === 'string' ? firstName : undefined,
    lastName: typeof lastName === 'string' ? lastName : undefined,
    email,
    phone: typeof phone === 'string' ? phone : undefined,
    company: typeof company === 'string' ? company : undefined,
    message: typeof message === 'string' ? message : undefined,
    metadata: typeof metadata === 'object' && metadata !== null
      ? (metadata as Record<string, unknown>)
      : undefined,
  })

  return NextResponse.json({ leadId: lead.id, stage: lead.stage }, { status: 201 })
}
