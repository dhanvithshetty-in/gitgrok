import type { TechStack } from '../types'

interface TechStackBadgeProps {
  items: TechStack[]
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  language: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3B82F6' },
  framework: { bg: 'rgba(139, 92, 246, 0.1)', text: '#8B5CF6' },
  tool: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10B981' },
  database: { bg: 'rgba(245, 158, 11, 0.1)', text: '#F59E0B' },
}

export default function TechStackBadge({ items }: TechStackBadgeProps) {
  if (items.length === 0) return null

  return (
    <div className="animate-fade-in-up stagger-3" style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {items.map(item => {
        const colors = categoryColors[item.category] || { bg: 'var(--accent-soft)', text: 'var(--accent)' }
        return (
          <span
            key={item.name}
            className={`tech-badge badge-${item.category}`}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
            <span style={{ opacity: 0.5, fontSize: 11 }}>{item.percentage}%</span>
          </span>
        )
      })}
    </div>
  )
}
