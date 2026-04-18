'use server'

import { redirect } from 'next/navigation'
import { getSessionClient } from '@/lib/session'
import { updateLeadStage } from '@/lib/db/leads'
import type { LeadStage } from '@/lib/db/leads'

const VALID_STAGES: LeadStage[] = ['new', 'contacted', 'qualified', 'demo_booked', 'closed_won', 'closed_lost']

export async function advanceStageAction(formData: FormData) {
  const client = await getSessionClient()
  if (!client) redirect('/dashboard/login')

  const leadId = formData.get('leadId')
  const stage = formData.get('stage')
  const note = formData.get('note')

  if (typeof leadId !== 'string' || typeof stage !== 'string') return
  if (!VALID_STAGES.includes(stage as LeadStage)) return

  await updateLeadStage(leadId, client.id, {
    stage: stage as LeadStage,
    actor: 'dashboard',
    note: typeof note === 'string' && note.trim() ? note.trim() : undefined,
  })

  redirect(`/dashboard/leads/${leadId}`)
}
