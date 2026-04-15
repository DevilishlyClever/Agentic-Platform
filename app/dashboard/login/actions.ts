'use server'

import { redirect } from 'next/navigation'
import { getClientByApiKey } from '@/lib/db/tenants'
import { setSessionCookie, clearSessionCookie } from '@/lib/session'

export async function loginAction(formData: FormData) {
  const apiKey = (formData.get('apiKey') as string)?.trim()
  if (!apiKey) redirect('/dashboard/login?error=missing')

  const client = await getClientByApiKey(apiKey)
  if (!client) redirect('/dashboard/login?error=invalid')

  await setSessionCookie(apiKey)
  redirect('/dashboard')
}

export async function logoutAction() {
  await clearSessionCookie()
  redirect('/dashboard/login')
}
