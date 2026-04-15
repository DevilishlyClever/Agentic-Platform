import { NextRequest, NextResponse } from 'next/server'
import { insertWorkflowRecord, listWorkflowRecords } from '@/lib/db/tenants'

function isAdmin(request: NextRequest): boolean {
  return request.headers.get('x-admin-secret') === process.env.ADMIN_SECRET
}

const VALID_VERTICALS = ['legal', 'real_estate']
const VALID_PACKAGES = ['document_review', 'contract_draft', 'client_intake', 'listing_gen', 'lead_qualify', 'offer_compare']

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { clientId, name, vertical, package: pkg, config } = await request.json()
  if (!clientId || !name || !vertical || !pkg) {
    return NextResponse.json({ error: 'clientId, name, vertical, package are required' }, { status: 400 })
  }
  if (!VALID_VERTICALS.includes(vertical)) {
    return NextResponse.json({ error: `vertical must be one of: ${VALID_VERTICALS.join(', ')}` }, { status: 400 })
  }
  if (!VALID_PACKAGES.includes(pkg)) {
    return NextResponse.json({ error: `package must be one of: ${VALID_PACKAGES.join(', ')}` }, { status: 400 })
  }

  const record = await insertWorkflowRecord(clientId, name, vertical, pkg, config ?? {})
  return NextResponse.json(record, { status: 201 })
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const clientId = request.nextUrl.searchParams.get('clientId')
  if (!clientId) return NextResponse.json({ error: 'clientId query param required' }, { status: 400 })

  const records = await listWorkflowRecords(clientId)
  return NextResponse.json(records)
}
