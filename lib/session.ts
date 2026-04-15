import { cookies } from 'next/headers'
import { getClientByApiKey } from './db/tenants'
import type { Client } from './db/tenants'

const COOKIE_NAME = 'ap_session'

export async function getSessionClient(): Promise<Client | null> {
  const jar = await cookies()
  const apiKey = jar.get(COOKIE_NAME)?.value
  if (!apiKey) return null
  return getClientByApiKey(apiKey)
}

export async function setSessionCookie(apiKey: string): Promise<void> {
  const jar = await cookies()
  jar.set(COOKIE_NAME, apiKey, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function clearSessionCookie(): Promise<void> {
  const jar = await cookies()
  jar.delete(COOKIE_NAME)
}
