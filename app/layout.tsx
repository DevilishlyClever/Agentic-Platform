import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Agentic Platform',
  description: 'AI-powered workflow automation for legal and real estate verticals',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
