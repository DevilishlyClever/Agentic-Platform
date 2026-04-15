import { getClientByApiKey } from './db/tenants'
import type { Client } from './db/tenants'

export async function authenticateRequest(request: Request): Promise<Client | null> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  const apiKey = authHeader.slice(7).trim()
  if (!apiKey) return null
  return getClientByApiKey(apiKey)
}
