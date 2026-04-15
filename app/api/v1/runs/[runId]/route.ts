import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth'
import { getRun } from '@/lib/db/runs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  const client = await authenticateRequest(request)
  if (!client) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { runId } = await params
  const run = await getRun(runId, client.id)
  if (!run) {
    return NextResponse.json({ error: 'Run not found' }, { status: 404 })
  }

  return NextResponse.json({
    runId: run.id,
    status: run.status,
    output: run.output,
    error: run.error,
    usage: { tokensUsed: run.tokens_used, durationMs: run.duration_ms },
    createdAt: run.created_at,
  })
}
