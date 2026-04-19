const workflows = [
  {
    category: 'LEGAL',
    categoryColor: '#eff6ff',
    categoryText: '#2563eb',
    name: 'Document Review',
    package: 'document_review',
    description: 'Upload any contract or agreement and get an instant risk analysis — flagged clauses, severity ratings, and recommended edits.',
    inputs: ['documentText: string'],
    outputs: ['risks[], keyTerms[], overallRisk, summary, disclaimer'],
    avgDuration: '~15s',
    avgTokens: '~1,500',
  },
  {
    category: 'LEGAL',
    categoryColor: '#eff6ff',
    categoryText: '#2563eb',
    name: 'Contract Drafting',
    package: 'contract_draft',
    description: 'Describe what you need and receive a professionally drafted contract with all standard sections pre-populated.',
    inputs: ['templateType: string', 'parameters: object'],
    outputs: ['sections[], reviewPoints[], disclaimer'],
    avgDuration: '~20s',
    avgTokens: '~2,000',
  },
  {
    category: 'LEGAL',
    categoryColor: '#eff6ff',
    categoryText: '#2563eb',
    name: 'Client Intake',
    package: 'client_intake',
    description: 'Turn unstructured intake form responses into structured case summaries with conflict-check data in seconds.',
    inputs: ['formData: object'],
    outputs: ['matterType, urgency, parties[], keyFacts[], relevantDates[], conflictCheckItems[]'],
    avgDuration: '~10s',
    avgTokens: '~800',
  },
  {
    category: 'REAL ESTATE',
    categoryColor: '#f0fdf4',
    categoryText: '#16a34a',
    name: 'Listing Generation',
    package: 'listing_gen',
    description: 'Provide property details and get compelling, MLS-compliant listing copy with highlights and social captions.',
    inputs: ['propertyData: object'],
    outputs: ['headline, description, highlights[], seoKeywords[], socialCaption'],
    avgDuration: '~8s',
    avgTokens: '~600',
  },
  {
    category: 'REAL ESTATE',
    categoryColor: '#f0fdf4',
    categoryText: '#16a34a',
    name: 'Lead Qualification',
    package: 'lead_qualify',
    description: 'Score and prioritise inbound leads from conversation transcripts with intent signals and recommended next steps.',
    inputs: ['conversation: Array<{role, message}>'],
    outputs: ['score, tier, buyerProfile, strengths[], concerns[], recommendedNextAction'],
    avgDuration: '~7s',
    avgTokens: '~500',
  },
  {
    category: 'REAL ESTATE',
    categoryColor: '#f0fdf4',
    categoryText: '#16a34a',
    name: 'Offer Comparison',
    package: 'offer_compare',
    description: 'Analyse multiple purchase offers side-by-side with structured summaries of price, contingencies, and risk factors.',
    inputs: ['offers: object[]', 'propertyDetails: object'],
    outputs: ['summary, offers[]{score, strengths, weaknesses}, recommendation'],
    avgDuration: '~12s',
    avgTokens: '~1,000',
  },
]

export default function WorkflowsPage() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#fff', minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 64, borderBottom: '1px solid #f1f5f9' }}>
        <a href="/" style={{ fontWeight: 700, fontSize: 18, color: '#0f172a', textDecoration: 'none' }}>Agentic Platform</a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="/workflows" style={{ color: '#2563eb', textDecoration: 'none', fontSize: 15, fontWeight: 600 }}>Workflows</a>
          <a href="/pricing" style={{ color: '#374151', textDecoration: 'none', fontSize: 15 }}>Pricing</a>
          <a href="/dashboard" style={{ background: '#2563eb', color: '#fff', padding: '8px 20px', borderRadius: 8, textDecoration: 'none', fontSize: 15, fontWeight: 600 }}>Client Login</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '72px 24px 56px' }}>
        <h1 style={{ fontSize: 44, fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>Six production-ready AI workflows</h1>
        <p style={{ fontSize: 18, color: '#475569', margin: 0 }}>Drop-in AI agents for legal and real estate professionals. Trigger via REST API or webhook.</p>
      </section>

      {/* Workflow cards */}
      <section style={{ maxWidth: 1040, margin: '0 auto 80px', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {workflows.map((w) => (
          <div key={w.package} style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: '28px 32px', background: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ background: w.categoryColor, color: w.categoryText, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', padding: '3px 10px', borderRadius: 4 }}>{w.category}</span>
                  <code style={{ background: '#f1f5f9', color: '#475569', fontSize: 12, padding: '2px 8px', borderRadius: 4 }}>{w.package}</code>
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>{w.name}</h2>
                <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 20px', lineHeight: 1.6 }}>{w.description}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 6 }}>Inputs</div>
                    {w.inputs.map((i) => (
                      <div key={i} style={{ fontSize: 12, color: '#475569', fontFamily: 'monospace', marginBottom: 2 }}>{i}</div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 6 }}>Outputs</div>
                    <div style={{ fontSize: 12, color: '#475569', fontFamily: 'monospace', lineHeight: 1.5 }}>{w.outputs}</div>
                  </div>
                </div>
              </div>
              <div style={{ flexShrink: 0, textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Avg duration</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>{w.avgDuration}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Avg tokens</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{w.avgTokens}</div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Bottom CTA */}
      <section style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '64px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>Ready to put these to work?</h2>
        <p style={{ fontSize: 16, color: '#475569', margin: '0 0 32px' }}>Book a demo or join the waitlist — we&apos;ll have you running in under a day.</p>
        <a href="/#get-started" style={{ display: 'inline-block', background: '#2563eb', color: '#fff', padding: '13px 32px', borderRadius: 8, textDecoration: 'none', fontSize: 16, fontWeight: 700 }}>
          Get started →
        </a>
      </section>
    </div>
  )
}
