export default function Home() {
  return (
    <main style={{ fontFamily: 'system-ui', maxWidth: 800, margin: '60px auto', padding: '0 24px' }}>
      <h1>Agentic Platform API</h1>
      <p>AI-powered workflow automation for legal and real estate professionals.</p>
      <h2>Quick Start</h2>
      <pre style={{ background: '#f4f4f4', padding: 16, borderRadius: 8, overflow: 'auto' }}>{`# Run a legal document review
curl -X POST https://your-domain.com/api/v1/workflows/{workflowId}/run \\
  -H "Authorization: Bearer sk_..." \\
  -H "Content-Type: application/json" \\
  -d '{"documentText": "..."}'

# Check run status
curl https://your-domain.com/api/v1/runs/{runId} \\
  -H "Authorization: Bearer sk_..."

# View usage
curl https://your-domain.com/api/v1/usage \\
  -H "Authorization: Bearer sk_..."`}</pre>
      <h2>Supported Packages</h2>
      <ul>
        <li><strong>legal / document_review</strong> — Contract risk analysis</li>
        <li><strong>legal / contract_draft</strong> — Draft contract sections</li>
        <li><strong>legal / client_intake</strong> — Intake form → structured case data</li>
        <li><strong>real_estate / listing_gen</strong> — Property listing copy</li>
        <li><strong>real_estate / lead_qualify</strong> — Lead scoring from conversation</li>
        <li><strong>real_estate / offer_compare</strong> — Multi-offer comparison</li>
      </ul>
    </main>
  )
}
