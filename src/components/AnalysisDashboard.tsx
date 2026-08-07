import type { RepoAnalysis } from '../types'
import SummaryCard from './SummaryCard'
import TechStackBadge from './TechStackBadge'
import FileTree from './FileTree'
import MermaidRenderer from './MermaidRenderer'
import StatsGrid from './StatsGrid'
import ChatTab from './ChatTab'
import CodeHealthGauge from './CodeHealthGauge'

interface AnalysisDashboardProps {
  analysis: RepoAnalysis
  messages: { role: 'user' | 'assistant'; content: string; timestamp: string }[]
  isStreaming: boolean
  onChatSend: (message: string) => void
  onChatClear: () => void
}

const RepoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ color: 'var(--accent)' }}>
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
  </svg>
)

export default function AnalysisDashboard({
  analysis,
  messages,
  isStreaming,
  onChatSend,
  onChatClear,
}: AnalysisDashboardProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="animate-fade-in-up stagger-1">
        <div className="surface" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'var(--accent-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <RepoIcon />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--text-heading)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {(analysis.repoUrl || '').replace('https://github.com/', '')}
            </h2>
            <p style={{
              fontSize: 12,
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
            }}>
              Analyzed {analysis.analyzedAt ? new Date(analysis.analyzedAt).toLocaleString() : 'N/A'} · branch "{analysis.branch}"
            </p>
          </div>
          <span style={{
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: 'var(--success)',
            background: 'rgba(22, 163, 74, 0.08)',
            border: '1px solid rgba(22, 163, 74, 0.15)',
            flexShrink: 0,
          }}>Analyzed</span>
        </div>
      </div>

      <StatsGrid stats={analysis.stats} />

      <div className="animate-fade-in-up stagger-2">
        <CodeHealthGauge analysis={analysis} />
      </div>

      <SummaryCard summary={analysis.summary} />

      <div className="animate-fade-in-up stagger-3" style={{ marginTop: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 3, height: 16, borderRadius: 2, background: 'var(--accent)' }} />
          <h3 className="section-label">Tech Stack</h3>
        </div>
        <TechStackBadge items={analysis.techStack} />
      </div>

      {analysis.archDiagram && (
        <div style={{ marginTop: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 3, height: 16, borderRadius: 2, background: 'var(--accent)' }} />
            <h3 className="section-label">Architecture Diagram</h3>
          </div>
          <MermaidRenderer diagram={analysis.archDiagram} />
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 20,
        marginTop: 4,
      }}>
        <FileTree nodes={analysis.fileTree} />
        <ChatTab
          messages={messages}
          isStreaming={isStreaming}
          onSend={onChatSend}
          onClear={onChatClear}
        />
      </div>
    </div>
  )
}
