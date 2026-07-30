import React from 'react'
import type { RepoStats } from '../types'

interface StatsGridProps {
  stats: RepoStats
}

const icons: Record<string, React.ReactNode> = {
  Stars: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
  Forks: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="6" r="3" /><circle cx="18" cy="18" r="3" /><line x1="6" y1="9" x2="18" y2="15" /></svg>,
  'Open Issues': <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
  License: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>,
  Contributors: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>,
  'Last Commit': <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const items = [
    { label: 'Stars', value: stats.stars.toLocaleString(), primary: true },
    { label: 'Forks', value: stats.forks.toLocaleString() },
    { label: 'Open Issues', value: stats.openIssues.toLocaleString() },
    { label: 'License', value: stats.license },
    { label: 'Contributors', value: stats.contributors.toLocaleString() },
    { label: 'Last Commit', value: (stats.lastCommit || '').slice(0, 10) },
  ]

  return (
    <div className="animate-fade-in-up stagger-1" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
      gap: 8,
    }}>
      {items.map((item, i) => (
        <div
          key={item.label}
          className="surface"
          style={{
            padding: '16px 14px',
            textAlign: 'center',
            animation: 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: `${i * 0.06}s`,
          }}
        >
          <div style={{
            color: item.primary ? 'var(--accent)' : 'var(--text-tertiary)',
            marginBottom: 10,
            lineHeight: 1,
            opacity: 0.7,
          }}>
            {icons[item.label]}
          </div>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 20,
            fontWeight: 700,
            color: item.primary ? 'var(--accent)' : 'var(--text-heading)',
            letterSpacing: '-0.03em',
            lineHeight: 1.2,
            marginBottom: 4,
          }}>
            {item.value}
          </div>
          <div style={{
            fontSize: 11,
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}
