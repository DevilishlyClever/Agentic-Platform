import { sql } from './client'

export interface Run {
  id: string
  client_id: string
  workflow_id: string
  status: 'pending' | 'running' | 'done' | 'failed'
  input: Record<string, unknown>
  output: Record<string, unknown> | null
  error: string | null
  tokens_used: number | null
  duration_ms: number | null
  created_at: string
  updated_at: string
}

export async function createRun(
  clientId: string,
  workflowId: string,
  input: Record<string, unknown>
): Promise<Run> {
  const rows = await sql`
    INSERT INTO runs (client_id, workflow_id, input)
    VALUES (${clientId}, ${workflowId}, ${JSON.stringify(input)})
    RETURNING *
  `
  return rows[0] as Run
}

export async function getRun(runId: string, clientId: string): Promise<Run | null> {
  const rows = await sql`
    SELECT * FROM runs WHERE id = ${runId} AND client_id = ${clientId}
  `
  return (rows[0] as Run) ?? null
}

export async function updateRun(
  runId: string,
  patch: Partial<Pick<Run, 'status' | 'output' | 'error' | 'tokens_used' | 'duration_ms'>>
): Promise<void> {
  await sql`
    UPDATE runs
    SET
      status = COALESCE(${patch.status ?? null}, status),
      output = COALESCE(${patch.output ? JSON.stringify(patch.output) : null}::jsonb, output),
      error = COALESCE(${patch.error ?? null}, error),
      tokens_used = COALESCE(${patch.tokens_used ?? null}, tokens_used),
      duration_ms = COALESCE(${patch.duration_ms ?? null}, duration_ms),
      updated_at = NOW()
    WHERE id = ${runId}
  `
}

export async function getMonthlyUsage(clientId: string): Promise<{ runs: number; tokens: number }> {
  const rows = await sql`
    SELECT
      COUNT(*)::int AS runs,
      COALESCE(SUM(tokens_used), 0)::int AS tokens
    FROM runs
    WHERE client_id = ${clientId}
      AND created_at >= date_trunc('month', NOW())
  `
  const row = rows[0] as { runs: number; tokens: number }
  return { runs: row.runs, tokens: row.tokens }
}

export async function listRuns(clientId: string, limit = 50): Promise<Run[]> {
  const rows = await sql`
    SELECT * FROM runs
    WHERE client_id = ${clientId}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `
  return rows as Run[]
}
