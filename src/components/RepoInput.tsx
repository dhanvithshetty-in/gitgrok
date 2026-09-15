import { useState } from 'react'
import { isGithubUrl } from '../services/errors'

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
  const [validationError, setValidationError] = useState<string | null>(null)

  const trimmed = url.trim()
  const urlInvalid = trimmed.length > 0 && !isGithubUrl(trimmed)
  const disabled = isLoading || urlInvalid || trimmed.length === 0

  const validate = (value: string) => {
    const v = value.trim()
    if (v.length === 0) {
      setValidationError(null)
    } else if (!isGithubUrl(v)) {
      setValidationError('Enter a valid GitHub URL like https://github.com/facebook/react')
    } else {
      setValidationError(null)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const v = url.trim()
    if (v.length === 0 || !isGithubUrl(v)) {
      setValidationError('Enter a valid public GitHub repository URL, e.g. https://github.com/facebook/react')
      return
    }
    setValidationError(null)
    onSubmit(v, branch)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div
        className="command-input-wrapper"
        style={urlInvalid ? { borderColor: 'rgba(239, 68, 68, 0.6)' } : undefined}
      >
        <span className="input-icon"><SearchIcon /></span>
        <input
          type="text"
          value={url}
          onChange={e => {
            setUrl(e.target.value)
            validate(e.target.value)
          }}
          placeholder="https://github.com/facebook/react"
          className="input-field"
          disabled={isLoading}
          aria-invalid={urlInvalid}
        />
        <span className="input-hint">
          <kbd>⌘K</kbd>
        </span>
      </div>
      {validationError && (
        <p style={{
          marginTop: 8,
          fontSize: 12,
          color: 'var(--error, #ef4444)',
          textAlign: 'center',
        }}>{validationError}</p>
      )}
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
          disabled={disabled}
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