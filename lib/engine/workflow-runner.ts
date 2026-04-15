import { createRun, updateRun } from '@/lib/db/runs'
import type { Workflow } from '@/lib/db/tenants'
import { runLegalPackage } from '@/lib/packages/legal'
import { runRealEstatePackage } from '@/lib/packages/real-estate'

export interface WorkflowResult {
  runId: string
  output: Record<string, unknown>
  tokensUsed: number
  durationMs: number
}

export async function executeWorkflow(
  workflow: Workflow,
  input: Record<string, unknown>
): Promise<WorkflowResult> {
  const run = await createRun(workflow.client_id, workflow.id, input)
  const startedAt = Date.now()

  try {
    await updateRun(run.id, { status: 'running' })

    let output: Record<string, unknown>
    let tokensUsed = 0

    if (workflow.vertical === 'legal') {
      const result = await runLegalPackage(workflow.package, input, workflow.config)
      output = result.output
      tokensUsed = result.tokensUsed
    } else if (workflow.vertical === 'real_estate') {
      const result = await runRealEstatePackage(workflow.package, input, workflow.config)
      output = result.output
      tokensUsed = result.tokensUsed
    } else {
      throw new Error(`Unknown vertical: ${workflow.vertical}`)
    }

    const durationMs = Date.now() - startedAt
    await updateRun(run.id, { status: 'done', output, tokens_used: tokensUsed, duration_ms: durationMs })

    return { runId: run.id, output, tokensUsed, durationMs }
  } catch (err) {
    const durationMs = Date.now() - startedAt
    const error = err instanceof Error ? err.message : String(err)
    await updateRun(run.id, { status: 'failed', error, duration_ms: durationMs })
    throw err
  }
}
