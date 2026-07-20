import { useState } from 'react'

interface RepoInputProps {
  onSubmit: (url: string, branch: string) => void
  isLoading: boolean
}

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const BoltIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
)

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
      <div className="command-input-wrapper">
        <span className="input-icon"><SearchIcon /></span>
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://github.com/facebook/react"
          className="input-field"
          disabled={isLoading}
        />
        <span className="input-hint">
          <kbd>⌘K</kbd>
        </span>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 12,
      }}>
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
            style={{ width: 100, padding: '7px 10px', fontSize: 13, borderRadius: 8 }}
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !url.includes('github.com')}
          className="btn-accent"
          style={{ padding: '10px 24px', fontSize: 14 }}
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
              <BoltIcon />
              Analyze Repo
            </>
          )}
        </button>
      </div>
    </form>
  )
}
