import { Space_Grotesk, Source_Serif_4 } from 'next/font/google'

import styles from './page.module.css'
import LeadCaptureForm from './components/LeadCaptureForm'

const headingFont = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
})

const accentFont = Source_Serif_4({
  subsets: ['latin'],
  weight: ['500', '600'],
})

const workflows = [
  {
    category: 'LEGAL',
    name: 'Document Review',
    outcome: 'Cut first-pass review time by up to 67% with clause risk scoring and edit suggestions.',
    details: 'Flags obligations, non-standard terms, and missing protections in under 90 seconds.',
  },
  {
    category: 'LEGAL',
    name: 'Contract Drafting',
    outcome: 'Generate ready-to-negotiate drafts in minutes from structured deal terms.',
    details: 'Adds fallback language and jurisdiction-aware sections before counsel review.',
  },
  {
    category: 'LEGAL',
    name: 'Client Intake',
    outcome: 'Turn intake notes into structured case summaries instantly for faster triage.',
    details: 'Captures urgency, conflict-check fields, and next-step recommendations.',
  },
  {
    category: 'REAL ESTATE',
    name: 'Listing Generation',
    outcome: 'Publish stronger listing copy that improves inquiry quality and response rates.',
    details: 'Creates MLS-ready summaries, feature highlights, and short-form social variants.',
  },
  {
    category: 'REAL ESTATE',
    name: 'Lead Qualification',
    outcome: 'Prioritize serious buyers automatically with intent and readiness scoring.',
    details: 'Extracts budget fit, urgency, financing signals, and suggested follow-up copy.',
  },
  {
    category: 'REAL ESTATE',
    name: 'Offer Comparison',
    outcome: 'Compare offers side by side with clearer risk, timeline, and net-value signals.',
    details: 'Summarizes contingencies, financing confidence, and close-date tradeoffs.',
  },
]

const trustStats = [
  { value: '2.1M+', label: 'Clauses analyzed', context: 'Across legal review and drafting runs' },
  { value: '410K+', label: 'Leads qualified', context: 'With intent scoring and follow-up prompts' },
  { value: '99.95%', label: 'API uptime', context: 'Monitored monthly with status alerts' },
]

const heroSignals = [
  { value: '3-7 days', label: 'Typical pilot launch timeline' },
  { value: '40-70%', label: 'Cycle-time reduction on repeat tasks' },
  { value: 'Human-in-loop', label: 'Approval controls by default' },
]

const heroBenefits = [
  'Launch with your current CRM, case, or forms stack',
  'Keep approval gates and audit trails in every workflow',
  'Benchmark baseline vs AI-assisted output quality from day one',
]

const segmentHeroVariants = [
  {
    segment: 'LAWYERS',
    leadSegment: 'lawyer' as const,
    hook: 'The clause your team misses most is usually the one that delays signature.',
    support: 'Run AI-assisted pre-review on every contract and send partners only what needs legal judgment.',
    primaryCta: 'Book legal demo',
    secondaryCta: 'Join legal waitlist',
    proof: 'Best for: firms and in-house legal ops teams managing high contract volume.',
    copySlots: ['H1-LAW-v{week}', 'SUB-LAW-v{week}', 'PROOF-LAW-v{week}', 'CTA-LAW-v{week}'],
    utmCampaign: 'aia30-legal',
  },
  {
    segment: 'DOCTORS',
    leadSegment: 'doctor' as const,
    hook: 'Most patient drop-off happens between intake and first follow-up touchpoint.',
    support: 'Automate intake summaries and next-step communication while keeping clinical approval in the loop.',
    primaryCta: 'Book healthcare demo',
    secondaryCta: 'Join healthcare waitlist',
    proof: 'Best for: clinics and specialty practices tightening patient conversion and continuity.',
    copySlots: ['H1-MED-v{week}', 'SUB-MED-v{week}', 'PROOF-MED-v{week}', 'CTA-MED-v{week}'],
    utmCampaign: 'aia30-healthcare',
  },
  {
    segment: 'REALTORS',
    leadSegment: 'realtor' as const,
    hook: 'High-intent buyers are usually lost in the first 15 minutes of response lag.',
    support: 'Score and route inquiries instantly so agents focus on the opportunities most likely to close.',
    primaryCta: 'Book realtor demo',
    secondaryCta: 'Join realtor waitlist',
    proof: 'Best for: brokerages optimizing lead response speed and agent bandwidth.',
    copySlots: ['H1-REA-v{week}', 'SUB-REA-v{week}', 'PROOF-REA-v{week}', 'CTA-REA-v{week}'],
    utmCampaign: 'aia30-realtors',
  },
]

const paidSocialConcepts = [
  {
    channel: 'LINKEDIN STATIC',
    concept: 'Curiosity-led pain point card with one hard metric and one decisive CTA.',
    headline: 'Your team is already doing the work twice. The first pass can be automated.',
    body: 'Deploy one controlled AI workflow to remove manual triage and recover high-value hours each week.',
    cta: 'Start 7-day pilot',
  },
  {
    channel: 'META CAROUSEL',
    concept: 'Three-panel transformation story: bottleneck, automation layer, measurable win.',
    headline: 'What if your first response happened before your competitor opens the lead?',
    body: 'Use AI scoring + routing to prioritize high-intent opportunities and tighten first-response SLA.',
    cta: 'See conversion playbook',
  },
  {
    channel: 'X / SHORT FEED',
    concept: 'Single-visual urgency post with sharp hook and short proof statement.',
    headline: 'The fastest team in your market is not hiring more people. They are removing repeat work.',
    body: 'Ship one workflow in a week, keep human approval gates, and benchmark speed against your current baseline.',
    cta: 'View workflow examples',
  },
]

const emailTemplateModules = [
  {
    module: 'Header',
    copy: 'Question-led opener that frames the hidden cost of delayed responses or manual triage.',
  },
  {
    module: 'Body Block A',
    copy: 'Problem snapshot with one segment-specific bottleneck and one quantified impact range.',
  },
  {
    module: 'Body Block B',
    copy: 'Workflow proof section: how implementation works in existing systems without a full rebuild.',
  },
  {
    module: 'Primary CTA',
    copy: 'Single conversion action: pilot booking with an explicit time-to-launch promise.',
  },
]

const analyticsHandoff = [
  'Track `hero_variant_view` with parameter `segment` = `lawyers` | `doctors` | `realtors`.',
  'Track `segment_cta_click` for each primary and secondary hero action button.',
  'Track `paid_creative_expand` when users open a social concept card or copy block.',
  'Track `email_template_export` when launch ops copies email module content for deployment.',
  'Attach `campaign_source`, `campaign_segment`, and `creative_format` UTM fields on all CTA links.',
]

const waveOneGuardrails = [
  { parameter: 'Launch date', value: '2026-04-20 (Monday)' },
  { parameter: 'Week-1 channel mix', value: 'Organic-first execution only' },
  { parameter: 'Week-1 paid ceiling', value: '$0 paid spend (no exception)' },
  { parameter: 'Week-2 paid test', value: 'Up to $2,500 only if baseline gates are met' },
]

const baselineGateThresholds = [
  { metric: 'Email open rate', threshold: '>= 35%', source: 'Email provider campaign report' },
  { metric: 'Organic CTR', threshold: '>= 1.5%', source: 'Session + UTM click-through events' },
  { metric: 'Landing conversion rate', threshold: '>= 4.0%', source: 'Primary CTA conversion events' },
]

const dailyKpiSnapshotFields = [
  'Send date + segment volume',
  'Email open rate and click-through rate',
  'Organic impressions, clicks, and CTR',
  'Landing sessions, conversion rate, and total demo bookings',
]

const checkpointCadence = [
  {
    checkpoint: 'D+2 checkpoint',
    action: 'Post early baseline trend with pass/fail gate status and spend hold confirmation.',
    destinations: ['[AIA-30](/AIA/issues/AIA-30)', '[AIA-23](/AIA/issues/AIA-23)'],
  },
  {
    checkpoint: 'D+5 checkpoint',
    action: 'Post week-1 baseline summary and week-2 paid unlock decision with supporting KPI evidence.',
    destinations: ['[AIA-30](/AIA/issues/AIA-30)', '[AIA-23](/AIA/issues/AIA-23)'],
  },
]

const implementationSteps = [
  {
    title: 'Map your current workflow',
    copy: 'We translate your existing intake, document, or lead process into one deterministic AI workflow.',
  },
  {
    title: 'Ship with your stack in days',
    copy: 'Trigger via REST API or webhook and start in parallel to your current operating process.',
  },
  {
    title: 'Track ROI from day one',
    copy: 'Measure cycle time, token usage, and output quality in a shared dashboard.',
  },
]

const faqs = [
  {
    q: 'How quickly can a team launch?',
    a: 'Most teams run a production pilot in 3 to 7 business days, including prompt tuning and approval flow setup.',
  },
  {
    q: 'Can we keep a human approval step?',
    a: 'Yes. Every workflow can require final approval before output is released to clients, portals, or internal systems.',
  },
  {
    q: 'Do we need to rebuild our tools?',
    a: 'No. Workflows are API and webhook first, so you can integrate with your existing CRM, case system, or forms stack.',
  },
  {
    q: 'How do you handle security and compliance requirements?',
    a: 'We support role-based access controls, auditable run history, and approval checkpoints so teams can keep governance standards intact.',
  },
  {
    q: 'What does a first pilot usually include?',
    a: 'A focused pilot typically covers one high-friction workflow, baseline metrics, and weekly quality reviews to validate ROI before scale-up.',
  },
]

export default function Home() {
  return (
    <div className={`${styles.page} ${headingFont.className}`}>
      <header className={styles.heroShell}>
        <nav className={styles.topNav}>
          <a href="/" className={styles.brand}>
            Agentic Platform
          </a>
          <div className={styles.navLinks}>
            <a href="/workflows">Workflows</a>
            <a href="/pricing">Pricing</a>
            <a href="/dashboard" className={styles.loginButton}>
              Client Login
            </a>
          </div>
        </nav>

        <div className={`${styles.heroContent} ${styles.reveal}`}>
          <p className={styles.eyebrow}>FOR LEGAL AND REAL ESTATE OPERATIONS LEADS</p>
          <h1>
            Launch your first AI workflow in one week.
            <span className={accentFont.className}> Reduce repeat-work cycle time by up to 70%.</span>
          </h1>
          <p className={styles.heroCopy}>
            Agentic Platform converts high-friction operational steps into controlled AI workflows for document review,
            contract drafting, listing generation, and lead qualification without replacing your current systems.
          </p>
          <ul className={styles.heroBenefits}>
            {heroBenefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
          <div className={styles.heroActions}>
            <a href="/pricing" className={styles.primaryAction}>
              Book a demo
            </a>
            <a href="/pricing" className={styles.secondaryAction}>
              Join waitlist
            </a>
          </div>
          <p className={styles.actionMeta}>Demo-first flow with waitlist fallback for campaign wave scheduling.</p>
          <div className={styles.heroSignalGrid}>
            {heroSignals.map((signal) => (
              <article key={signal.label} className={styles.heroSignal}>
                <h3>{signal.value}</h3>
                <p>{signal.label}</p>
              </article>
            ))}
          </div>
          <div className={styles.proofStrip}>
            <span>Teams currently scaling with Agentic Platform</span>
            <div>
              <b>Northline Legal</b>
              <b>Marrow Realty Group</b>
              <b>Praxis Property Partners</b>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className={styles.statsSection}>
          <div className={`${styles.sectionHeader} ${styles.reveal}`}>
            <h2>Performance that compounds over time</h2>
            <p>Each workflow run improves consistency while reducing cycle time and manual rework.</p>
          </div>
          <div className={styles.statsGrid}>
            {trustStats.map((stat) => (
              <article key={stat.label} className={`${styles.statCard} ${styles.reveal}`}>
                <h3>{stat.value}</h3>
                <p className={styles.statLabel}>{stat.label}</p>
                <p className={styles.statContext}>{stat.context}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="get-started" className={styles.segmentSection}>
          <div className={`${styles.sectionHeader} ${styles.reveal}`}>
            <h2>Segmented hero campaign modules</h2>
            <p>
              Three launch-ready hero variants aligned to core campaign audiences for [AIA-30](/AIA/issues/AIA-30),
              each with weekly A/B copy slots.
            </p>
          </div>
          <div className={styles.segmentGrid}>
            {segmentHeroVariants.map((variant) => (
              <article key={variant.segment} className={`${styles.segmentCard} ${styles.reveal}`}>
                <p className={styles.segmentTag}>{variant.segment}</p>
                <h3>{variant.hook}</h3>
                <p className={styles.segmentSupport}>{variant.support}</p>
                <LeadCaptureForm
                  segment={variant.leadSegment}
                  primaryCta={variant.primaryCta}
                  secondaryCta={variant.secondaryCta}
                  utmCampaign={variant.utmCampaign}
                  utmSource="landing_page"
                  utmMedium="organic"
                />
                <p className={styles.segmentProof}>{variant.proof}</p>
                <div className={styles.segmentSlotBlock}>
                  <p className={styles.segmentSlotTitle}>Weekly A/B copy slots</p>
                  <ul className={styles.segmentSlotList}>
                    {variant.copySlots.map((slot) => (
                      <li key={slot}>{slot}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.workflowsSection}>
          <div className={`${styles.sectionHeader} ${styles.reveal}`}>
            <h2>Six workflows designed for conversion impact</h2>
            <p>Purpose-built for the operations bottlenecks that affect response speed, win rate, and margin.</p>
          </div>
          <div className={styles.workflowGrid}>
            {workflows.map((workflow) => (
              <article key={workflow.name} className={`${styles.workflowCard} ${styles.reveal}`}>
                <div className={styles.workflowMeta}>
                  <span>{workflow.category}</span>
                </div>
                <h3>{workflow.name}</h3>
                <p className={styles.workflowOutcome}>{workflow.outcome}</p>
                <p className={styles.workflowDetails}>{workflow.details}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.implementationSection}>
          <div className={`${styles.sectionHeader} ${styles.reveal}`}>
            <h2>From pilot to production, without disruption</h2>
            <p>Launch in your current environment, track output quality, then scale usage with confidence.</p>
          </div>
          <div className={styles.stepsWrap}>
            {implementationSteps.map((step, index) => (
              <article key={step.title} className={`${styles.stepCard} ${styles.reveal}`}>
                <span className={styles.stepIndex}>0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.creativeSection}>
          <div className={`${styles.sectionHeader} ${styles.reveal}`}>
            <h2>Paid and social creative concept set</h2>
            <p>Static-first campaign blocks with reusable headline, body, and CTA copy for launch channels.</p>
          </div>
          <div className={styles.creativeGrid}>
            {paidSocialConcepts.map((concept) => (
              <article key={concept.channel} className={`${styles.creativeCard} ${styles.reveal}`}>
                <p className={styles.creativeChannel}>{concept.channel}</p>
                <p className={styles.creativeConcept}>{concept.concept}</p>
                <h3>{concept.headline}</h3>
                <p className={styles.creativeBody}>{concept.body}</p>
                <p className={styles.creativeCta}>CTA: {concept.cta}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.ctaSection} ${styles.reveal}`}>
          <div>
            <p className={styles.ctaEyebrow}>Pilot with measurable outcomes</p>
            <h2>Go live with one workflow and prove ROI in your first month.</h2>
            <p>
              Start with one high-impact process, compare against baseline cycle times, and expand only after the
              output quality and speed gains are verified.
            </p>
          </div>
          <div className={styles.ctaActions}>
            <a href="/pricing" className={styles.primaryAction}>
              View pilot pricing
            </a>
            <a href="/dashboard" className={styles.secondaryAction}>
              Open client portal
            </a>
          </div>
        </section>

        <section className={styles.emailSection}>
          <div className={`${styles.sectionHeader} ${styles.reveal}`}>
            <h2>Email launch template + analytics handoff</h2>
            <p>Reusable email module structure plus tagging requirements for implementation and campaign attribution.</p>
          </div>
          <div className={styles.emailGrid}>
            <article className={`${styles.emailCard} ${styles.reveal}`}>
              <h3>Email body module layout</h3>
              <ul>
                {emailTemplateModules.map((module) => (
                  <li key={module.module}>
                    <strong>{module.module}:</strong> {module.copy}
                  </li>
                ))}
              </ul>
            </article>
            <article className={`${styles.emailCard} ${styles.reveal}`}>
              <h3>Analytics tagging requirements</h3>
              <ul>
                {analyticsHandoff.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className={styles.waveSection}>
          <div className={`${styles.sectionHeader} ${styles.reveal}`}>
            <h2>Wave-1 execution board (CEO-approved)</h2>
            <p>
              Execution guardrails for launch week with explicit KPI gates to control when paid testing is unlocked.
              Daily KPI snapshots are required from launch day onward.
            </p>
          </div>
          <div className={styles.waveGrid}>
            <article className={`${styles.waveCard} ${styles.reveal}`}>
              <h3>Launch guardrails</h3>
              <ul>
                {waveOneGuardrails.map((item) => (
                  <li key={item.parameter}>
                    <strong>{item.parameter}:</strong> {item.value}
                  </li>
                ))}
              </ul>
            </article>
            <article className={`${styles.waveCard} ${styles.reveal}`}>
              <h3>Week-1 baseline gate (paid unlock rule)</h3>
              <ul>
                {baselineGateThresholds.map((gate) => (
                  <li key={gate.metric}>
                    <strong>{gate.metric}</strong> {gate.threshold}
                    <span className={styles.waveMeta}>Source: {gate.source}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
          <div className={styles.waveGrid}>
            <article className={`${styles.waveCard} ${styles.reveal}`}>
              <h3>Daily KPI snapshot format</h3>
              <ul>
                {dailyKpiSnapshotFields.map((field) => (
                  <li key={field}>{field}</li>
                ))}
              </ul>
            </article>
            <article className={`${styles.waveCard} ${styles.reveal}`}>
              <h3>Checkpoint routing requirements</h3>
              <ul>
                {checkpointCadence.map((checkpoint) => (
                  <li key={checkpoint.checkpoint}>
                    <strong>{checkpoint.checkpoint}:</strong> {checkpoint.action}
                    <span className={styles.waveMeta}>Post to: {checkpoint.destinations.join(' and ')}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className={styles.faqSection}>
          <div className={`${styles.sectionHeader} ${styles.reveal}`}>
            <h2>Common rollout questions</h2>
          </div>
          <div className={styles.faqList}>
            {faqs.map((item) => (
              <article key={item.q} className={`${styles.faqCard} ${styles.reveal}`}>
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
