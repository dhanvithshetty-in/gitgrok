import type { RepoAnalysis } from '../types'
import SummaryCard from './SummaryCard'
import TechStackBadge from './TechStackBadge'
import FileTree from './FileTree'
import MermaidRenderer from './MermaidRenderer'
import StatsGrid from './StatsGrid'
import ChatTab from './ChatTab'

interface AnalysisDashboardProps {
  analysis: RepoAnalysis
  messages: { role: 'user' | 'assistant'; content: string; timestamp: string }[]
  isStreaming: boolean
  onChatSend: (message: string) => void
  onChatClear: () => void
}

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'var(--accent-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
          }}>
            {analysis.repoUrl.includes('facebook/react') ? '⚛️' : '📦'}
          </div>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--text-heading)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}>
              {analysis.repoUrl.replace('https://github.com/', '')}
            </h2>
            <p style={{
              fontSize: 12,
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
            }}>
              Analyzed {new Date(analysis.analyzedAt).toLocaleString()} · branch "{analysis.branch}"
            </p>
          </div>
        </div>
      </div>

      <StatsGrid stats={analysis.stats} />

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
