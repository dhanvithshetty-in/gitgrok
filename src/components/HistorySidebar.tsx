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

const ClockIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ color: 'var(--text-tertiary)', opacity: 0.4 }}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

export default function HistorySidebar({ items, onSelect, onDelete, activeId }: HistorySidebarProps) {
  if (items.length === 0) {
    return (
      <div className="surface" style={{ padding: 24, textAlign: 'center' }}>
        <ClockIcon />
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 10 }}>No analyses yet</p>
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
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <div style={{ width: 3, height: 16, borderRadius: 2, background: 'var(--accent)' }} />
        <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-heading)' }}>History</h3>
        <span style={{
          marginLeft: 'auto',
          fontSize: 10,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-tertiary)',
          background: 'var(--bg-tertiary)',
          padding: '1px 6px',
          borderRadius: 4,
        }}>{items.length}</span>
      </div>
      <div style={{ maxHeight: 400, overflowY: 'auto' }}>
        {items.map(item => (
          <div
            key={item.id}
            className="history-row"
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              borderBottom: '1px solid var(--border-subtle)',
              background: activeId === item.id ? 'var(--accent-medium)' : 'transparent',
              borderLeft: activeId === item.id ? '2px solid var(--accent)' : '2px solid transparent',
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
                  {new Date(item.analyzedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
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
