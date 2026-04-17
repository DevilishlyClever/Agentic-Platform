'use client'

import { useState } from 'react'
import styles from './LeadCaptureForm.module.css'

type Segment = 'lawyer' | 'doctor' | 'realtor' | 'other'
type FormMode = 'demo' | 'waitlist'

interface Props {
  segment: Segment
  primaryCta: string
  secondaryCta: string
  utmCampaign?: string
  utmSource?: string
  utmMedium?: string
}

export default function LeadCaptureForm({
  segment,
  primaryCta,
  secondaryCta,
  utmCampaign,
  utmSource,
  utmMedium,
}: Props) {
  const [mode, setMode] = useState<FormMode | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) {
      setError('Email is required.')
      return
    }
    setError(null)
    setSubmitting(true)

    try {
      const res = await fetch('/api/v1/leads/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          segment,
          source: 'landing_page',
          utmSource: utmSource ?? 'organic',
          utmMedium: utmMedium ?? 'web',
          utmCampaign: utmCampaign ?? (mode === 'demo' ? 'book_demo' : 'waitlist'),
          firstName,
          lastName,
          email,
          company,
          message,
          metadata: { formMode: mode },
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error((body as { error?: string }).error ?? 'Submission failed. Please try again.')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className={styles.success}>
        {mode === 'demo'
          ? "You're on the list — we'll reach out within one business day to confirm your demo slot."
          : "You've joined the waitlist. We'll notify you when your access window opens."}
      </div>
    )
  }

  if (!mode) {
    return (
      <div className={styles.actions}>
        <button className={styles.primaryBtn} onClick={() => setMode('demo')}>
          {primaryCta}
        </button>
        <button className={styles.secondaryBtn} onClick={() => setMode('waitlist')}>
          {secondaryCta}
        </button>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor={`fn-${segment}`}>First name</label>
          <input
            id={`fn-${segment}`}
            className={styles.input}
            type="text"
            placeholder="Jane"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor={`ln-${segment}`}>Last name</label>
          <input
            id={`ln-${segment}`}
            className={styles.input}
            type="text"
            placeholder="Smith"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor={`email-${segment}`}>Work email *</label>
        <input
          id={`email-${segment}`}
          className={styles.input}
          type="email"
          placeholder="jane@firm.com"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor={`co-${segment}`}>Firm / company</label>
        <input
          id={`co-${segment}`}
          className={styles.input}
          type="text"
          placeholder="Northline Legal"
          value={company}
          onChange={e => setCompany(e.target.value)}
        />
      </div>
      {mode === 'demo' && (
        <div className={styles.field}>
          <label className={styles.label} htmlFor={`msg-${segment}`}>What are you solving for?</label>
          <textarea
            id={`msg-${segment}`}
            className={styles.textarea}
            placeholder="Briefly describe the workflow or bottleneck you want to address."
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
        </div>
      )}
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.actions}>
        <button type="submit" className={styles.primaryBtn} disabled={submitting}>
          {submitting ? 'Submitting…' : mode === 'demo' ? 'Request demo' : 'Join waitlist'}
        </button>
        <button
          type="button"
          className={styles.secondaryBtn}
          disabled={submitting}
          onClick={() => { setMode(null); setError(null) }}
        >
          Back
        </button>
      </div>
    </form>
  )
}
