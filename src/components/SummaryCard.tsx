import type { RepoSummary } from '../types'

interface SummaryCardProps {
  summary: RepoSummary
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{
          width: 3,
          height: 16,
          borderRadius: 2,
          background: 'var(--accent)',
          flexShrink: 0,
        }} />
        <h3 className="section-label" style={{ fontSize: 11 }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

export default function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <div className="surface-elevated animate-fade-in-up stagger-2" style={{ padding: 24 }}>
      <Section title="Purpose">
        <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7 }}>{summary.purpose}</p>
      </Section>

      <Section title="Architecture">
        <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7 }}>{summary.architecture}</p>
      </Section>

      <Section title="Code Quality">
        <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7 }}>{summary.quality}</p>
      </Section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <Section title="Strengths">
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {summary.strengths.map((s, i) => (
              <li key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                fontSize: 13,
                color: 'var(--text)',
                lineHeight: 1.6,
                marginBottom: 6,
              }}>
                <span style={{
                  color: 'var(--success)',
                  fontWeight: 700,
                  fontSize: 12,
                  marginTop: 2,
                }}>+</span>
                {s}
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Recommendations">
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {summary.recommendations.map((r, i) => (
              <li key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                fontSize: 13,
                color: 'var(--text)',
                lineHeight: 1.6,
                marginBottom: 6,
              }}>
                <span style={{
                  color: 'var(--warning)',
                  fontWeight: 700,
                  fontSize: 12,
                  marginTop: 2,
                }}>→</span>
                {r}
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  )
}
