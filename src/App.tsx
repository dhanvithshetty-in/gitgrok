import { useState, useCallback, useEffect } from 'react'
import RepoInput from './components/RepoInput'
import AnalysisDashboard from './components/AnalysisDashboard'
import HistorySidebar from './components/HistorySidebar'
import LoadingSkeleton from './components/LoadingSkeleton'
import { useAnalysis } from './hooks/useAnalysis'
import { useChat } from './hooks/useChat'

const STORAGE_KEY = 'gitgrok-history'

interface HistoryItem {
  id: string
  repoUrl: string
  branch: string
  analyzedAt: string
  summary: string
}

function loadHistory(): HistoryItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

const MagnifyingGlassIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const LogoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'currentColor' }}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const RepoIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ color: 'currentColor' }}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <path d="M11 6v10" strokeWidth="2" />
    <path d="M6 11h10" strokeWidth="2" />
  </svg>
)

const StatsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
)

const ArchitectureIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
)

const ChatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
)

function App() {
  const { analysis, isLoading, error, submitAnalysis, reset } = useAnalysis()
  const { messages, isStreaming, sendMessage, clearMessages } = useChat()
  const [history, setHistory] = useState<HistoryItem[]>(loadHistory)
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  }, [history])

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (analysis) window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [analysis ? analysis.id : null])

  const handleSubmit = useCallback(async (url: string, branch: string) => {
    await submitAnalysis({ repoUrl: url, branch })
  }, [submitAnalysis])

  const handleChatSend = useCallback((message: string) => {
    if (!analysis) return
    const repoUrl = analysis.repoUrl || 'https://github.com/dhanvithshetty-in/gitgrok'
    const repoName = repoUrl
      .replace(/^https?:\/\/(www\.)?github\.com\//, '')
      .replace(/\/$/, '')
      .replace(/\.git$/, '') || 'dhanvithshetty-in/gitgrok'
    const context = [
      `Repository: ${repoName}`,
      `Purpose: ${analysis.summary?.purpose || ''}`,
      `Architecture: ${analysis.summary?.architecture || ''}`,
      `Code quality: ${analysis.summary?.quality || ''}`,
    ].filter(Boolean).join('\n')
    sendMessage({
      analysisId: analysis.id,
      message,
      repoName,
      repoUrl,
      context,
    })
  }, [analysis, sendMessage])

  const handleSelectHistory = useCallback((id: string) => {
    const item = history.find(h => h.id === id)
    if (!item) return
  }, [history])

  const handleDeleteHistory = useCallback((id: string) => {
    setHistory(prev => prev.filter(h => h.id !== id))
  }, [])

  const handleNewAnalysis = useCallback(() => {
    reset()
    clearMessages()
  }, [reset, clearMessages])

  if (showSplash) {
    return (
      <div style={{
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 18,
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: '#fff',
            animation: 'pulse 2s ease-in-out infinite',
          }}>
            <MagnifyingGlassIcon />
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--text-heading)',
            marginBottom: 4,
            letterSpacing: '-0.03em',
          }}>GitGrok</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <header className="app-header">
        <div className="app-header-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              flexShrink: 0,
            }}>
              <LogoIcon />
            </div>
            <div>
              <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: 'var(--text-heading)',
                lineHeight: 1.2,
              }}>GitGrok</h1>
              <p style={{
                fontSize: 11,
                color: 'var(--text-secondary)',
                letterSpacing: '0.02em',
              }}>GitHub Repository Analyzer</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {analysis && (
              <button className="btn-ghost" onClick={handleNewAnalysis}>
                <PlusIcon />
                New Analysis
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="content-container">
        {!analysis && !isLoading && !error && (
          <div className="splash-hero animate-fade-in">
            <div className="splash-blob splash-blob-1" />
            <div className="splash-blob splash-blob-2" />
            <div className="splash-blob splash-blob-3" />

            <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
              <div className="animate-fade-in-up">
                <div className="splash-icon">
                  <RepoIcon />
                </div>
                <h2 className="splash-heading" style={{ color: 'var(--text-heading)' }}>
                  Understand any<br />GitHub repository
                </h2>
                <p style={{
                  fontSize: 15,
                  color: 'var(--text)',
                  lineHeight: 1.7,
                  maxWidth: 440,
                  margin: '0 auto',
                }}>
                  Paste a repository URL and get instant AI-powered analysis — architecture overview,
                  tech stack, file structure, and dependency graphs.
                </p>
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: '0.3s', marginTop: 40, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                  <span style={{
                    fontSize: 12,
                    color: 'var(--text-secondary)',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}>Or analyze a real repo</span>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                </div>
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <RepoInput onSubmit={handleSubmit} isLoading={isLoading} />
              </div>

              <div className="splash-features animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <div className="splash-feature-card">
                  <div className="feature-icon"><StatsIcon /></div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-heading)', marginBottom: 3 }}>Repo Stats</div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Stars, forks, contributors</div>
                </div>
                <div className="splash-feature-card">
                  <div className="feature-icon"><ArchitectureIcon /></div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-heading)', marginBottom: 3 }}>Architecture</div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Dependency graphs & structure</div>
                </div>
                <div className="splash-feature-card">
                  <div className="feature-icon"><ChatIcon /></div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-heading)', marginBottom: 3 }}>AI Chat</div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Ask questions about the code</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="animate-fade-in">
            <div style={{ maxWidth: 560, margin: '0 auto 32px', textAlign: 'center' }}>
              <RepoInput onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
            <LoadingSkeleton />
          </div>
        )}

        {error && (
          <div style={{ maxWidth: 560, margin: '40px auto 0', textAlign: 'center' }}>
            <RepoInput onSubmit={handleSubmit} isLoading={isLoading} />
            <div className="animate-fade-in-up" style={{
              marginTop: 32,
              padding: 24,
              borderRadius: 12,
              background: 'rgba(239, 68, 68, 0.06)',
              border: '1px solid rgba(239, 68, 68, 0.15)',
            }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--error)', marginBottom: 4 }}>Analysis failed</p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>{error}</p>
            </div>
          </div>
        )}

        {analysis && (
          <div className="animate-fade-in-up analysis-layout" style={{
            display: 'grid',
            gridTemplateColumns: '280px 1fr',
            gap: 28,
            alignItems: 'start',
          }}>
            <div className="sidebar-sticky" style={{ position: 'sticky', top: 80 }}>
              <HistorySidebar
                items={history}
                onSelect={handleSelectHistory}
                onDelete={handleDeleteHistory}
                activeId={analysis.id}
              />
            </div>
            <div style={{ minWidth: 0 }}>
              <AnalysisDashboard
                analysis={analysis}
                messages={messages}
                isStreaming={isStreaming}
                onChatSend={handleChatSend}
                onChatClear={clearMessages}
              />
            </div>
          </div>
        )}
      </main>

      <footer style={{
        borderTop: '1px solid var(--border)',
        marginTop: 80,
        padding: '20px 24px',
        textAlign: 'center',
        fontSize: 12,
        color: 'var(--text-tertiary)',
      }}>
        GitGrok — React + TypeScript + Tailwind CSS + n8n
      </footer>
    </div>
  )
}

export default App
