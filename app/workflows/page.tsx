const workflows = [
  {
    category: 'LEGAL',
    name: 'Document Review',
    description:
      'Upload any contract or agreement and get an instant risk analysis — flagged clauses, severity ratings, and recommended edits.',
    input: 'documentText: string',
  },
  {
    category: 'LEGAL',
    name: 'Contract Drafting',
    description:
      'Describe what you need and receive a professionally drafted contract with all standard sections pre-populated.',
    input: 'templateType: string',
  },
  {
    category: 'LEGAL',
    name: 'Client Intake',
    description:
      'Turn unstructured intake form responses into structured case summaries with conflict-check data in seconds.',
    input: 'formData: object',
  },
  {
    category: 'REAL ESTATE',
    name: 'Listing Generation',
    description:
      'Provide property details and photos and get compelling, SEO-optimised listing copy across all major portals.',
    input: 'propertyData: object',
  },
  {
    category: 'REAL ESTATE',
    name: 'Lead Qualification',
    description:
      'Score and prioritise inbound leads from conversation transcripts — complete with intent signals and recommended next steps.',
    input: 'conversation: array',
  },
  {
    category: 'REAL ESTATE',
    name: 'Offer Comparison',
    description:
      'Analyse multiple purchase offers side-by-side with structured summaries of price, contingencies, and risk factors.',
    input: 'offers: array',
  },
]

const categoryColor: Record<string, { bg: string; text: string }> = {
  LEGAL: { bg: '#eff6ff', text: '#2563eb' },
  'REAL ESTATE': { bg: '#f0fdf4', text: '#16a34a' },
}

export default function WorkflowsPage() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#fff', minHeight: '100vh' }}>
      {/* Nav */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 48px',
          height: 64,
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        <a href="/" style={{ fontWeight: 700, fontSize: 18, color: '#0f172a', textDecoration: 'none' }}>
          Agentic Platform
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="/workflows" style={{ color: '#2563eb', textDecoration: 'none', fontSize: 15, fontWeight: 600 }}>
            Workflows
          </a>
          <a href="/pricing" style={{ color: '#374151', textDecoration: 'none', fontSize: 15 }}>
            Pricing
          </a>
          <a
            href="/dashboard"
            style={{
              background: '#2563eb',
              color: '#fff',
              padding: '8px 20px',
              borderRadius: 8,
              textDecoration: 'none',
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            Client Login
          </a>
        </div>
      </nav>

      {/* Header */}
      <section style={{ maxWidth: 760, margin: '64px auto 0', padding: '0 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 42, fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>
          All Workflows
        </h1>
        <p style={{ fontSize: 18, color: '#475569', lineHeight: 1.6, margin: '0 0 16px' }}>
          Six production-ready AI agents for legal and real estate professionals.
          Trigger via REST API or webhook — results in seconds.
        </p>
      </section>

      {/* Workflow grid */}
      <section style={{ maxWidth: 1080, margin: '56px auto 80px', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {workflows.map((w) => {
            const colors = categoryColor[w.category] ?? { bg: '#f8fafc', text: '#475569' }
            return (
              <div
                key={w.name}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: '24px 24px 28px',
                  background: '#fff',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    background: colors.bg,
                    color: colors.text,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    padding: '3px 10px',
                    borderRadius: 4,
                    marginBottom: 14,
                  }}
                >
                  {w.category}
                </span>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>
                  {w.name}
                </h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, margin: '0 0 16px' }}>
                  {w.description}
                </p>
                <div
                  style={{
                    background: '#f8fafc',
                    borderRadius: 6,
                    padding: '8px 12px',
                    fontSize: 12,
                    color: '#64748b',
                    fontFamily: 'monospace',
                  }}
                >
                  Input: {w.input}
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 64 }}>
          <p style={{ fontSize: 16, color: '#475569', marginBottom: 20 }}>
            Ready to automate? Get started with a client account.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <a
              href="/pricing"
              style={{
                background: '#2563eb',
                color: '#fff',
                padding: '13px 28px',
                borderRadius: 8,
                textDecoration: 'none',
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              See pricing
            </a>
            <a
              href="/dashboard"
              style={{
                background: '#fff',
                color: '#0f172a',
                padding: '13px 28px',
                borderRadius: 8,
                textDecoration: 'none',
                fontSize: 16,
                fontWeight: 600,
                border: '1px solid #e2e8f0',
              }}
            >
              Client login
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
