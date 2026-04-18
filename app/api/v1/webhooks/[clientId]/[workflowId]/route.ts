import { NextRequest, NextResponse } from 'next/server'
import { getClientByApiKey } from '@/lib/db/tenants'
import { getWorkflow } from '@/lib/db/tenants'
import { createRun } from '@/lib/db/runs'
import { executeWorkflow } from '@/lib/engine/workflow-runner'

// Webhook secret validation (HMAC-SHA256)
async function validateWebhookSignature(
  request: NextRequest,
  body: string,
  secret: string
): Promise<boolean> {
  const sig = request.headers.get('x-webhook-signature')
  if (!sig) return false
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const signed = await crypto.subtle.sign('HMAC', key, encoder.encode(body))
  const expected = 'sha256=' + Array.from(new Uint8Array(signed)).map(b => b.toString(16).padStart(2, '0')).join('')
  return sig === expected
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string; workflowId: string }> }
) {
  const { clientId, workflowId } = await params

  // Webhooks authenticate via API key in header or query param
  const apiKey = request.headers.get('x-api-key') ?? request.nextUrl.searchParams.get('api_key')
  if (!apiKey) return NextResponse.json({ error: 'Missing API key' }, { status: 401 })

  const client = await getClientByApiKey(apiKey)
  if (!client || client.id !== clientId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const workflow = await getWorkflow(workflowId, client.id)
  if (!workflow) {
    return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
  }

  const bodyText = await request.text()
  let input: Record<string, unknown>
  try {
    input = JSON.parse(bodyText)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  input.clientId = client.id

  // Create run immediately and return 202 — execute async
  const run = await createRun(client.id, workflow.id, input)

  // Fire-and-forget execution (no await)
  executeWorkflow(workflow, input, { runId: run.id }).catch(console.error)

  return NextResponse.json({ runId: run.id, status: 'pending' }, { status: 202 })
}
