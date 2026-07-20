import type { RepoSummary } from '../types'

interface SummaryCardProps {
  summary: RepoSummary
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
  return (
    <div className="surface-elevated animate-fade-in-up stagger-2" style={{ padding: 24 }}>
      <Section title="Purpose">
        <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.75, fontWeight: 450 }}>{summary.purpose}</p>
      </Section>

      <Section title="Architecture">
        <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.75, fontWeight: 450 }}>{summary.architecture}</p>
      </Section>

      <Section title="Code Quality">
        <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.75, fontWeight: 450 }}>{summary.quality}</p>
      </Section>


    </div>
  )
}
