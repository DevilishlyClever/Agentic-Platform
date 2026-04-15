import { sql } from './client'
import { randomBytes } from 'crypto'

export interface Client {
  id: string
  name: string
  api_key: string
  plan: string
  created_at: string
}

export interface Workflow {
  id: string
  client_id: string
  name: string
  vertical: string
  package: string
  config: Record<string, unknown>
  active: boolean
  created_at: string
}

export async function createClient(name: string, plan = 'starter'): Promise<Client> {
  const api_key = 'sk_' + randomBytes(32).toString('hex')
  const rows = await sql`
    INSERT INTO clients (name, api_key, plan)
    VALUES (${name}, ${api_key}, ${plan})
    RETURNING *
  `
  return rows[0] as Client
}

export async function getClientByApiKey(apiKey: string): Promise<Client | null> {
  const rows = await sql`SELECT * FROM clients WHERE api_key = ${apiKey}`
  return (rows[0] as Client) ?? null
}

export async function getWorkflow(workflowId: string, clientId: string): Promise<Workflow | null> {
  const rows = await sql`
    SELECT * FROM workflows
    WHERE id = ${workflowId} AND client_id = ${clientId} AND active = TRUE
  `
  return (rows[0] as Workflow) ?? null
}

export async function insertWorkflowRecord(
  clientId: string,
  name: string,
  vertical: string,
  pkg: string,
  config: Record<string, unknown> = {}
): Promise<Workflow> {
  const rows = await sql`
    INSERT INTO workflows (client_id, name, vertical, package, config)
    VALUES (${clientId}, ${name}, ${vertical}, ${pkg}, ${JSON.stringify(config)})
    RETURNING *
  `
  return rows[0] as Workflow
}

export async function listWorkflowRecords(clientId: string): Promise<Workflow[]> {
  const rows = await sql`
    SELECT * FROM workflows WHERE client_id = ${clientId} AND active = TRUE ORDER BY created_at DESC
  `
  return rows as Workflow[]
}
