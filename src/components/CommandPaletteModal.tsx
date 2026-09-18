import { useState, useEffect, useRef } from 'react'
import type { RepoAnalysis } from '../types'

interface HistoryItem {
  id: string
  repoUrl: string
  branch: string
  analyzedAt: string
  summary: string
}

interface CommandPaletteModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectRepo: (url: string) => void
  onExportMarkdown?: () => void
  onNewAnalysis?: () => void
  history?: HistoryItem[]
  analysis?: RepoAnalysis | null
}

const SAMPLE_COMMANDS = [
  { id: 'react', title: 'facebook/react', category: 'PRESET', url: 'https://github.com/facebook/react' },
  { id: 'express', title: 'expressjs/express', category: 'PRESET', url: 'https://github.com/expressjs/express' },
  { id: 'python', title: 'python/cpython', category: 'PRESET', url: 'https://github.com/python/cpython' },
  { id: 'vite', title: 'vitejs/vite', category: 'PRESET', url: 'https://github.com/vitejs/vite' },
  { id: 'next', title: 'vercel/next.js', category: 'PRESET', url: 'https://github.com/vercel/next.js' },
  { id: 'gitgrok', title: 'dhanvithshetty-in/gitgrok', category: 'PRESET', url: 'https://github.com/dhanvithshetty-in/gitgrok' },
]

export default function CommandPaletteModal({
  isOpen,
  onClose,
  onSelectRepo,
  onExportMarkdown,
  onNewAnalysis,
  history = [],
  analysis,
}: CommandPaletteModalProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  if (!isOpen) return null

  const filteredCommands = SAMPLE_COMMANDS.filter(cmd =>
    cmd.title.toLowerCase().includes(query.toLowerCase())
  )

  // Recent history items for quick access
  const recentItems = history
    .slice(0, 3)
    .map(h => ({
      id: h.id,
      title: h.repoUrl.replace('https://github.com/', ''),
      category: 'RECENT' as const,
      url: h.repoUrl,
    }))

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
        paddingLeft: 16,
        paddingRight: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 600,
          background: 'var(--bg-secondary, #ffffff)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search repositories or commands..."
            autoFocus
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              background: 'none',
              fontSize: 15,
              fontWeight: 600,
              color: 'var(--text-heading)',
              fontFamily: 'var(--font-body)',
            }}
          />
          <kbd style={{
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            padding: '3px 8px',
            borderRadius: 6,
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
          }}>
            ESC
          </kbd>
        </div>

        {/* Quick Actions & Suggestions */}
        <div style={{ padding: 12, maxHeight: 360, overflowY: 'auto' }}>
          {analysis && onExportMarkdown && (
            <div
              onClick={() => {
                onExportMarkdown()
                onClose()
              }}
              className="command-item"
              style={{
                padding: '12px 16px',
                borderRadius: 14,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'background 0.15s var(--ease)',
                marginBottom: 6,
              }}
            >
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-heading)' }}>
                  Copy README Markdown Report
                </span>
                <span style={{ display: 'block', fontSize: 11, color: 'var(--text-tertiary)' }}>
                  Copy architecture summary ready to paste into GitHub README
                </span>
              </div>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent)', background: 'var(--accent-soft)', padding: '2px 8px', borderRadius: 9999 }}>
                ACTION
              </span>
            </div>
          )}

          {onNewAnalysis && (
            <div
              onClick={() => {
                onNewAnalysis()
                onClose()
              }}
              className="command-item"
              style={{
                padding: '12px 16px',
                borderRadius: 14,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'background 0.15s var(--ease)',
                marginBottom: 10,
              }}
            >
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-heading)' }}>
                  Start New Repository Analysis
                </span>
                <span style={{ display: 'block', fontSize: 11, color: 'var(--text-tertiary)' }}>
                  Clear current session and input a new GitHub link
                </span>
              </div>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: 9999 }}>
                NEW
              </span>
            </div>
          )}

          {recentItems.length > 0 && (
            <>
              <div style={{ padding: '6px 16px 6px', fontSize: 11, fontWeight: 800, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Recent Analyses
              </div>
              {recentItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectRepo(item.url)
                    onClose()
                  }}
                  className="command-item"
                  style={{
                    padding: '10px 16px',
                    borderRadius: 14,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'background 0.15s var(--ease)',
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-heading)' }}>
                    {item.title}
                  </span>
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#10b981', background: 'rgba(16,185,129,0.08)', padding: '2px 8px', borderRadius: 9999 }}>
                    RECENT
                  </span>
                </div>
              ))}
            </>
          )}

          <div style={{ padding: '6px 16px 6px', fontSize: 11, fontWeight: 800, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Popular Repositories
          </div>

          {filteredCommands.map(cmd => (
            <div
              key={cmd.id}
              onClick={() => {
                onSelectRepo(cmd.url)
                onClose()
              }}
              className="command-item"
              style={{
                padding: '10px 16px',
                borderRadius: 14,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'background 0.15s var(--ease)',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-heading)' }}>
                {cmd.title}
              </span>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
                {cmd.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
