const plans = [
  {
    name: 'Starter',
    price: '$99',
    period: '/month',
    runs: '100 runs/mo',
    description: 'For small teams evaluating AI workflow automation.',
    features: [
      '100 workflow runs per month',
      'All 6 AI packages included',
      'REST API + webhook access',
      'Client dashboard',
      'Email support',
    ],
    cta: 'Get started',
    ctaHref: '/#get-started',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$499',
    period: '/month',
    runs: '1,000 runs/mo',
    description: 'For growing firms running AI workflows at scale.',
    features: [
      '1,000 workflow runs per month',
      'All 6 AI packages included',
      'REST API + webhook access',
      'Client dashboard with run history',
      'Priority support',
      'Custom workflow configuration',
    ],
    cta: 'Start Pro',
    ctaHref: '/#get-started',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    runs: 'Unlimited runs',
    description: 'For large organisations with custom requirements.',
    features: [
      'Unlimited workflow runs',
      'All 6 AI packages included',
      'Dedicated infrastructure',
      'SLA & uptime guarantees',
      'Custom integrations',
      'Dedicated account manager',
    ],
    cta: 'Contact us',
    ctaHref: '/#get-started',
    highlight: false,
  },
]

export default function PricingPage() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#fff', minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 64, borderBottom: '1px solid #f1f5f9' }}>
        <a href="/" style={{ fontWeight: 700, fontSize: 18, color: '#0f172a', textDecoration: 'none' }}>Agentic Platform</a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="/workflows" style={{ color: '#374151', textDecoration: 'none', fontSize: 15 }}>Workflows</a>
          <a href="/pricing" style={{ color: '#2563eb', textDecoration: 'none', fontSize: 15, fontWeight: 600 }}>Pricing</a>
          <a href="/dashboard" style={{ background: '#2563eb', color: '#fff', padding: '8px 20px', borderRadius: 8, textDecoration: 'none', fontSize: 15, fontWeight: 600 }}>Client Login</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '72px 24px 56px' }}>
        <h1 style={{ fontSize: 44, fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>Simple, transparent pricing</h1>
        <p style={{ fontSize: 18, color: '#475569', margin: 0 }}>Pay for what you use. No hidden fees.</p>
      </section>

      {/* Plans */}
      <section style={{ maxWidth: 1040, margin: '0 auto 80px', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {plans.map((plan) => (
          <div key={plan.name} style={{
            border: plan.highlight ? '2px solid #2563eb' : '1px solid #e2e8f0',
            borderRadius: 14,
            padding: '32px 28px 36px',
            background: plan.highlight ? '#eff6ff' : '#fff',
            position: 'relative',
          }}>
            {plan.highlight && (
              <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: '#2563eb', color: '#fff', fontSize: 12, fontWeight: 700, padding: '3px 14px', borderRadius: 20 }}>
                Most popular
              </div>
            )}
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{plan.name}</div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>{plan.description}</div>
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 40, fontWeight: 800, color: '#0f172a' }}>{plan.price}</span>
              <span style={{ fontSize: 15, color: '#64748b' }}>{plan.period}</span>
            </div>
            <div style={{ fontSize: 13, color: '#2563eb', fontWeight: 600, marginBottom: 28 }}>{plan.runs}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px' }}>
              {plan.features.map((f) => (
                <li key={f} style={{ fontSize: 14, color: '#374151', padding: '5px 0', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ color: '#16a34a', fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
                </li>
              ))}
            </ul>
            <a href={plan.ctaHref} style={{
              display: 'block',
              textAlign: 'center',
              background: plan.highlight ? '#2563eb' : '#fff',
              color: plan.highlight ? '#fff' : '#0f172a',
              border: plan.highlight ? 'none' : '1px solid #e2e8f0',
              padding: '11px 0',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: 'none',
            }}>
              {plan.cta}
            </a>
          </div>
        ))}
      </section>
    </div>
  )
}
