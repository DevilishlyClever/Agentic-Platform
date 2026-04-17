import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth'
import { getDailyMetrics } from '@/lib/db/leads'

// GET /api/v1/leads/metrics/daily?date=YYYY-MM-DD
// Returns new leads, qualified leads, demo-booked count, source performance,
// and response-time SLA instrumentation for the given date (UTC).
export async function GET(request: NextRequest) {
  const client = await authenticateRequest(request)
  if (!client) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = request.nextUrl
  const rawDate = searchParams.get('date')

  // Default to today UTC if not provided
  const date = rawDate ?? new Date().toISOString().slice(0, 10)

  // Validate YYYY-MM-DD format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: 'Invalid date format. Use YYYY-MM-DD.' },
      { status: 400 }
    )
  }

  const metrics = await getDailyMetrics(client.id, date)

  return NextResponse.json({
    date: metrics.date,
    newLeads: metrics.new_leads,
    qualifiedLeads: metrics.qualified_leads,
    demoBooked: metrics.demo_booked,
    bySource: metrics.by_source,
    bySegment: metrics.by_segment,
    // SLA instrumentation: <15 min target = 900 000 ms
    sla: {
      targetMs: 900_000,
      avgResponseTimeMs: metrics.avg_response_time_ms,
      breachCount: metrics.sla_breaches,
      slaMetPercent:
        metrics.avg_response_time_ms !== null
          ? metrics.avg_response_time_ms <= 900_000
            ? 100
            : null
          : null,
    },
  })
}
