import { getSessionClient } from '@/lib/session'
import { logoutAction } from './login/actions'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const client = await getSessionClient()
  // Keep login page reachable. Individual protected pages already enforce auth.
  if (!client) return <>{children}</>

  return (
    <div style={styles.shell}>
      <nav style={styles.nav}>
        <span style={styles.brand}>Agentic Platform</span>
        <span style={styles.clientName}>{client.name}</span>
        <div style={styles.navLinks}>
          <a href="/dashboard" style={styles.navLink}>Overview</a>
          <a href="/dashboard/runs" style={styles.navLink}>Runs</a>
          <a href="/dashboard/docs" style={styles.navLink}>API Docs</a>
        </div>
        <form action={logoutAction} style={{ margin: 0 }}>
          <button type="submit" style={styles.logoutBtn}>Sign out</button>
        </form>
      </nav>
      <main style={styles.main}>{children}</main>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  shell: { minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: '#f8fafc' },
  nav: { display: 'flex', alignItems: 'center', gap: 24, padding: '0 32px', height: 56, background: '#fff', borderBottom: '1px solid #e2e8f0' },
  brand: { fontWeight: 700, fontSize: 16, color: '#0f172a', marginRight: 8 },
  clientName: { fontSize: 13, color: '#64748b', flex: 1 },
  navLinks: { display: 'flex', gap: 4 },
  navLink: { padding: '6px 12px', color: '#374151', textDecoration: 'none', borderRadius: 6, fontSize: 14 },
  logoutBtn: { padding: '6px 14px', background: 'none', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, cursor: 'pointer', color: '#64748b' },
  main: { maxWidth: 1100, margin: '0 auto', padding: '32px 32px' },
}
