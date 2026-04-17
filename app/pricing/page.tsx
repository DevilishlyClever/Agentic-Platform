const plans = [
  {
    name: 'Starter',
    price: '$99',
    period: '/month',
    description: 'For small firms getting started with AI automation.',
    features: [
      '500 workflow runs/month',
      'All 6 workflow packages',
      'REST API access',
      'Email support',
      'Usage dashboard',
    ],
    cta: 'Get started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$299',
    period: '/month',
    description: 'For growing firms with higher volume needs.',
    features: [
      '3,000 workflow runs/month',
      'All 6 workflow packages',
      'REST API + Webhooks',
      'Priority support',
      'Usage dashboard',
      'Custom workflow configs',
    ],
    cta: 'Start free trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large firms and multi-site operations.',
    features: [
      'Unlimited workflow runs',
      'All 6 workflow packages',
      'REST API + Webhooks',
      'Dedicated support',
      'SLA guarantee',
      'Custom integrations',
      'On-premise option',
    ],
    cta: 'Contact us',
    highlighted: false,
  },
]

export default function PricingPage() {
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
          <a href="/workflows" style={{ color: '#374151', textDecoration: 'none', fontSize: 15 }}>
            Workflows
          </a>
          <a href="/pricing" style={{ color: '#2563eb', textDecoration: 'none', fontSize: 15, fontWeight: 600 }}>
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
      <section style={{ maxWidth: 640, margin: '64px auto 0', padding: '0 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 42, fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>
          Simple, transparent pricing
        </h1>
        <p style={{ fontSize: 18, color: '#475569', lineHeight: 1.6, margin: 0 }}>
          All plans include access to all six AI workflow packages.
          No per-workflow fees, no surprises.
        </p>
      </section>

      {/* Pricing cards */}
      <section style={{ maxWidth: 1000, margin: '56px auto 80px', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'start' }}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{
                border: plan.highlighted ? '2px solid #2563eb' : '1px solid #e2e8f0',
                borderRadius: 16,
                padding: '32px 28px',
                background: plan.highlighted ? '#f8faff' : '#fff',
                position: 'relative',
              }}
            >
              {plan.highlighted && (
                <div
                  style={{
                    position: 'absolute',
                    top: -14,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#2563eb',
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '4px 14px',
                    borderRadius: 20,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Most popular
                </div>
              )}
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>
                {plan.name}
              </h2>
              <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 20px', lineHeight: 1.5 }}>
                {plan.description}
              </p>
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontSize: 40, fontWeight: 800, color: '#0f172a' }}>{plan.price}</span>
                {plan.period && (
                  <span style={{ fontSize: 16, color: '#64748b', marginLeft: 4 }}>{plan.period}</span>
                )}
              </div>
              <a
                href="/dashboard"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  background: plan.highlighted ? '#2563eb' : '#f1f5f9',
                  color: plan.highlighted ? '#fff' : '#0f172a',
                  padding: '12px 20px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontSize: 15,
                  fontWeight: 600,
                  marginBottom: 28,
                }}
              >
                {plan.cta}
              </a>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {plan.features.map((f) => (
                  <li
                    key={f}
                    style={{
                      fontSize: 14,
                      color: '#374151',
                      padding: '7px 0',
                      borderBottom: '1px solid #f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <span style={{ color: '#16a34a', fontWeight: 700, fontSize: 16 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ note */}
        <div
          style={{
            textAlign: 'center',
            marginTop: 56,
            padding: '32px',
            background: '#f8fafc',
            borderRadius: 12,
          }}
        >
          <p style={{ fontSize: 16, color: '#475569', margin: '0 0 16px' }}>
            All plans start with a 14-day free trial. No credit card required.
          </p>
          <a
            href="/workflows"
            style={{ color: '#2563eb', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}
          >
            Browse all workflows →
          </a>
        </div>
      </section>
    </div>
  )
}
