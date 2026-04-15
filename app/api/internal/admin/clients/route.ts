import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db/tenants'

// Simple admin secret — replace with proper auth in production
function isAdmin(request: NextRequest): boolean {
  const secret = request.headers.get('x-admin-secret')
  return secret === process.env.ADMIN_SECRET
}

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { name, plan } = await request.json()
  if (!name) return NextResponse.json({ error: 'name is required' }, { status: 400 })

  const client = await createClient(name, plan)
  return NextResponse.json(client, { status: 201 })
}
