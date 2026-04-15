import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth'
import { getWorkflow } from '@/lib/db/tenants'
import { executeWorkflow } from '@/lib/engine/workflow-runner'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ workflowId: string }> }
) {
  const client = await authenticateRequest(request)
  if (!client) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { workflowId } = await params
  const workflow = await getWorkflow(workflowId, client.id)
  if (!workflow) {
    return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
  }

  let input: Record<string, unknown>
  try {
    input = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // Inject clientId so packages can tag gateway calls
  input.clientId = client.id

  try {
    const result = await executeWorkflow(workflow, input)
    return NextResponse.json({
      runId: result.runId,
      status: 'done',
      output: result.output,
      usage: { tokensUsed: result.tokensUsed, durationMs: result.durationMs },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Workflow execution failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
