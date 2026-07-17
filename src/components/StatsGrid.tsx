import type { RepoStats } from '../types'

interface StatsGridProps {
  stats: RepoStats
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const items = [
    { label: 'Stars', value: stats.stars.toLocaleString(), icon: '⭐' },
    { label: 'Forks', value: stats.forks.toLocaleString(), icon: '⑂' },
    { label: 'Open Issues', value: stats.openIssues.toLocaleString(), icon: '!' },
    { label: 'License', value: stats.license, icon: '©' },
    { label: 'Contributors', value: stats.contributors.toLocaleString(), icon: '👥' },
    { label: 'Last Commit', value: stats.lastCommit.slice(0, 10), icon: '🕐' },
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
            padding: '16px 12px',
            textAlign: 'center',
            animation: 'fadeInUp 0.5s ease-out both',
            animationDelay: `${0.05 + i * 0.04}s`,
          }}
        >
          <div style={{ fontSize: 20, marginBottom: 6, lineHeight: 1 }}>{item.icon}</div>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--text-heading)',
            letterSpacing: '-0.03em',
            lineHeight: 1.2,
            marginBottom: 2,
          }}>
            {item.value}
          </div>
          <div style={{
            fontSize: 11,
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-heading)',
            fontWeight: 500,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}
