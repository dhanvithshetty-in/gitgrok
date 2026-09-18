import type { RepoSummary } from '../types'

interface SummaryCardProps {
  summary: RepoSummary
}

/** Renders inline markdown: **bold**, *italic*, `code` as real HTML elements */
export function renderInlineMarkdown(text: string): React.ReactNode[] {
  // Split on **bold**, *italic*, or `code`
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ fontWeight: 700, color: 'var(--text-heading)' }}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88em', background: 'var(--bg-tertiary)', padding: '1px 5px', borderRadius: 4 }}>
          {part.slice(1, -1)}
        </code>
      )
    }
    // Strip any stray lone asterisks left over
    return part.replace(/\*/g, '')
  })
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{
          width: 3,
          height: 16,
          borderRadius: 2,
          background: 'var(--accent)',
          flexShrink: 0,
        }} />
        <h3 className="section-label">{title}</h3>
      </div>
      {children}
    </div>
  )
}

export default function SummaryCard({ summary }: SummaryCardProps) {
  const safeSummary = summary || {}
  return (
    <div className="surface-elevated animate-fade-in-up stagger-2" style={{ padding: 24 }}>
      <Section title="Purpose">
        <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.75, fontWeight: 450 }}>
          {renderInlineMarkdown(safeSummary.purpose || '')}
        </p>
      </Section>

      <Section title="Architecture">
        <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.75, fontWeight: 450 }}>
          {renderInlineMarkdown(safeSummary.architecture || '')}
        </p>
      </Section>

      <Section title="Code Quality">
        <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.75, fontWeight: 450 }}>
          {renderInlineMarkdown(safeSummary.quality || '')}
        </p>
      </Section>
    </div>
  )
}
