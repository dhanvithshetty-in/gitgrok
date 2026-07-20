import { useState } from 'react'

interface RepoInputProps {
  onSubmit: (url: string, branch: string) => void
  isLoading: boolean
}

export default function RepoInput({ onSubmit, isLoading }: RepoInputProps) {
  const [url, setUrl] = useState('')
  const [branch, setBranch] = useState('main')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim() || !url.includes('github.com')) return
    onSubmit(url.trim(), branch)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://github.com/facebook/react"
            className="input-field"
            style={{ paddingRight: 44 }}
            disabled={isLoading}
          />
          <span style={{
            position: 'absolute',
            right: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-secondary)',
            pointerEvents: 'none',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <label htmlFor="branch" style={{
              fontSize: 13,
              color: 'var(--text)',
              fontFamily: 'var(--font-body)',
            }}>Branch</label>
            <input
              id="branch"
              type="text"
              value={branch}
              onChange={e => setBranch(e.target.value)}
              className="input-field"
              style={{ width: 100, padding: '7px 10px', fontSize: 13 }}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !url.includes('github.com')}
            className="btn-accent"
            style={{ marginLeft: 'auto' }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.25)',
                  borderTopColor: 'var(--btn-text)',
                  animation: 'spin 0.8s linear infinite',
                }} />
                Analyzing...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                Analyze Repo
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
