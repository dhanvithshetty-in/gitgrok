import type { RepoStats } from '../types'

interface StatsGridProps {
  stats: RepoStats
}

function StatIcon({ label }: { label: string }) {
  const icons: Record<string, JSX.Element> = {
    Stars: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
    Forks: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="6" r="3" /><circle cx="18" cy="18" r="3" /><line x1="6" y1="9" x2="18" y2="15" /></svg>,
    'Open Issues': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
    License: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>,
    Contributors: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>,
    'Last Commit': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  }
  return (
    <div style={{ color: 'var(--text-tertiary)', marginBottom: 8, lineHeight: 1 }}>
      {icons[label] || null}
    </div>
  )
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const items = [
    { label: 'Stars', value: stats.stars.toLocaleString() },
    { label: 'Forks', value: stats.forks.toLocaleString() },
    { label: 'Open Issues', value: stats.openIssues.toLocaleString() },
    { label: 'License', value: stats.license },
    { label: 'Contributors', value: stats.contributors.toLocaleString() },
    { label: 'Last Commit', value: stats.lastCommit.slice(0, 10) },
  ]

  return (
    <div className="animate-fade-in-up stagger-1" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
      gap: 8,
    }}>
      {items.map((item, i) => (
        <div
          key={item.label}
          className="surface"
          style={{
            padding: '18px 10px',
            textAlign: 'center',
            animation: 'fadeInUp 0.5s ease-out both',
            animationDelay: `${0.05 + i * 0.04}s`,
          }}
        >
          <StatIcon label={item.label} />
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--text-heading)',
            letterSpacing: '-0.03em',
            lineHeight: 1.2,
            marginBottom: 3,
          }}>
            {item.value}
          </div>
          <div style={{
            fontSize: 10,
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}
