import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth'
import { getMonthlyUsage, listRuns } from '@/lib/db/runs'

export async function GET(request: NextRequest) {
  const client = await authenticateRequest(request)
  if (!client) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [usage, recentRuns] = await Promise.all([
    getMonthlyUsage(client.id),
    listRuns(client.id, 10),
  ])

  return NextResponse.json({
    plan: client.plan,
    month: new Date().toISOString().slice(0, 7),
    runs: usage.runs,
    tokensUsed: usage.tokens,
    recentRuns: recentRuns.map(r => ({
      runId: r.id,
      workflowId: r.workflow_id,
      status: r.status,
      tokensUsed: r.tokens_used,
      durationMs: r.duration_ms,
      createdAt: r.created_at,
    })),
  })
}
