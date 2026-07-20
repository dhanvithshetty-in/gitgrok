import type { TechStack } from '../types'

interface TechStackBadgeProps {
  items: TechStack[]
}

export default function TechStackBadge({ items }: TechStackBadgeProps) {
  if (items.length === 0) return null

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {items.map(item => (
        <span
          key={item.name}
          className={`tech-badge badge-${item.category}`}
        >
          <span style={{ fontWeight: 600 }}>{item.name}</span>
          <span style={{ opacity: 0.5, fontFamily: 'var(--font-mono)', fontSize: 11 }}>{item.percentage}%</span>
        </span>
      ))}
    </div>
  )
}
