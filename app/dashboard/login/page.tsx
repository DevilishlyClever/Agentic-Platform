import { loginAction } from './actions'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams
  const errorMsg = error === 'invalid' ? 'Invalid API key.' : error === 'missing' ? 'API key is required.' : null

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <h1 style={styles.title}>Agentic Platform</h1>
        <p style={styles.subtitle}>Sign in with your API key</p>
        {errorMsg && <p style={styles.error}>{errorMsg}</p>}
        <form action={loginAction} style={styles.form}>
          <label style={styles.label} htmlFor="apiKey">API Key</label>
          <input
            id="apiKey"
            name="apiKey"
            type="password"
            placeholder="sk_..."
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Sign In</button>
        </form>
        <p style={styles.hint}>
          Contact your administrator to get your API key.
        </p>
      </div>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  main: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' },
  card: { background: '#fff', borderRadius: 12, padding: '40px 48px', boxShadow: '0 1px 3px rgba(0,0,0,.1)', width: '100%', maxWidth: 400 },
  title: { margin: '0 0 4px', fontSize: 24, fontWeight: 700, color: '#0f172a' },
  subtitle: { margin: '0 0 28px', color: '#64748b', fontSize: 14 },
  error: { margin: '0 0 16px', padding: '10px 12px', background: '#fee2e2', color: '#b91c1c', borderRadius: 6, fontSize: 13 },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  label: { fontSize: 14, fontWeight: 500, color: '#374151' },
  input: { padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, outline: 'none' },
  button: { padding: '11px 0', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 4 },
  hint: { marginTop: 20, fontSize: 13, color: '#94a3b8', textAlign: 'center' },
}
