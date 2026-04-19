import { Resend } from 'resend'
import type { Lead } from './db/leads'

// Fire-and-forget lead notification.
// Returns silently on missing config so the lead is never blocked by email issues.
export async function notifyNewLead(lead: Lead): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.LEAD_NOTIFY_EMAIL
  const from = process.env.LEAD_NOTIFY_FROM ?? 'leads@agentic-platform.com'

  if (!apiKey || !to) return

  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://agentic-platform-azure.vercel.app'}/dashboard/leads/${lead.id}`

  const name = [lead.first_name, lead.last_name].filter(Boolean).join(' ') || '(no name)'
  const company = lead.company ? ` · ${lead.company}` : ''
  const segment = lead.segment.charAt(0).toUpperCase() + lead.segment.slice(1)

  try {
    const resend = new Resend(apiKey)
    await resend.emails.send({
      from,
      to,
      subject: `New lead: ${name}${company} [${segment}]`,
      html: `
        <p style="font-family:sans-serif;font-size:15px;color:#0f172a;">
          A new lead just came in. <strong>Respond within 15 minutes</strong> to hit your SLA.
        </p>
        <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%;max-width:480px;">
          <tr><td style="padding:6px 0;color:#64748b;width:110px">Name</td><td><strong>${name}</strong></td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Email</td><td>${lead.email ?? '—'}</td></tr>
          ${lead.phone ? `<tr><td style="padding:6px 0;color:#64748b">Phone</td><td>${lead.phone}</td></tr>` : ''}
          ${lead.company ? `<tr><td style="padding:6px 0;color:#64748b">Company</td><td>${lead.company}</td></tr>` : ''}
          <tr><td style="padding:6px 0;color:#64748b">Segment</td><td>${segment}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Source</td><td>${lead.source}${lead.utm_campaign ? ` / ${lead.utm_campaign}` : ''}</td></tr>
          ${lead.message ? `<tr><td style="padding:6px 0;color:#64748b;vertical-align:top">Message</td><td>${lead.message}</td></tr>` : ''}
        </table>
        <p style="margin-top:24px">
          <a href="${dashboardUrl}" style="background:#2563eb;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;font-family:sans-serif;font-size:14px;font-weight:600;">
            Open in Dashboard →
          </a>
        </p>
      `,
    })
  } catch (err) {
    // Never let notification failure break the lead creation path
    console.error('[notify] resend failed:', err instanceof Error ? err.message : err)
  }
}
