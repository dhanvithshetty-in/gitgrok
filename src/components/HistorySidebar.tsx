interface HistoryItem {
  id: string
  repoUrl: string
  branch: string
  analyzedAt: string
  summary: string
}

interface HistorySidebarProps {
  items: HistoryItem[]
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  activeId?: string
}

export default function HistorySidebar({ items, onSelect, onDelete, activeId }: HistorySidebarProps) {
  if (items.length === 0) {
    return (
      <div className="surface" style={{ padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 24, marginBottom: 8, opacity: 0.4 }}>📋</div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>No analyses yet</p>
        <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>
          Results appear here
        </p>
      </div>
    )
  }

  return (
    <div className="surface" style={{ overflow: 'hidden' }}>
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--border)',
      }}>
        <h3 style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-heading)' }}>History</h3>
      </div>
      <div style={{ maxHeight: 400, overflowY: 'auto' }}>
        {items.map(item => (
          <div
            key={item.id}
            className="animate-fade-in history-row"
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              borderBottom: '1px solid var(--border-subtle)',
              transition: 'background 0.12s',
              background: activeId === item.id ? 'var(--accent-soft)' : 'transparent',
            }}
            onClick={() => onSelect(item.id)}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--text-heading)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginBottom: 2,
                }}>
                  {item.repoUrl.replace('https://github.com/', '')}
                </p>
                <p style={{
                  fontSize: 11,
                  color: 'var(--text-secondary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginBottom: 2,
                }}>{item.summary}</p>
                <p style={{
                  fontSize: 10,
                  color: 'var(--text-tertiary)',
                  fontFamily: 'var(--font-mono)',
                }}>
                  {new Date(item.analyzedAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={e => { e.stopPropagation(); onDelete(item.id) }}
                className="btn-icon"
                aria-label="Delete"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
