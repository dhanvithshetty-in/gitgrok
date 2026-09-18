import { useState, useCallback, useEffect } from 'react'
import RepoInput from './components/RepoInput'
import Hero3DSection from './components/Hero3DSection'
import AnalysisDashboard from './components/AnalysisDashboard'
import HistorySidebar from './components/HistorySidebar'
import LoadingSkeleton from './components/LoadingSkeleton'
import CommandPaletteModal from './components/CommandPaletteModal'
import { useAnalysis } from './hooks/useAnalysis'
import { useChat } from './hooks/useChat'

const STORAGE_KEY = 'gitgrok-history'

import type { RepoAnalysis } from './types'

interface HistoryItem {
  id: string
  repoUrl: string
  branch: string
  analyzedAt: string
  summary: string
  fullAnalysis?: RepoAnalysis
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

function App() {
  const { analysis, isLoading, error, submitAnalysis, setAnalysis, reset } = useAnalysis()
  const [activeUrl, setActiveUrl] = useState('')
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light')
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsCommandPaletteOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

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

  const analysisId = analysis?.id ?? null
  useEffect(() => {
    if (analysis) window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [analysisId, analysis])

  const handleSubmit = useCallback(async (url: string, branch: string) => {
    setActiveUrl(url)
    const result = await submitAnalysis({ repoUrl: url, branch })
    if (result) {
      const newItem: HistoryItem = {
        id: result.id || `ana_${Date.now()}`,
        repoUrl: result.repoUrl || url,
        branch: result.branch || branch,
        analyzedAt: result.analyzedAt || new Date().toISOString(),
        summary: result.summary?.purpose || 'Repository Analysis',
        fullAnalysis: result,
      }
      setHistory(prev => [newItem, ...prev.filter(h => h.id !== newItem.id)].slice(0, 20))
    }
  }, [submitAnalysis])

  // Auto-analyze if shared link has ?repo= parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const repoParam = params.get('repo')
    const branchParam = params.get('branch') || 'main'
    if (repoParam && !analysis && !isLoading) {
      const fullUrl = repoParam.startsWith('http') ? repoParam : `https://github.com/${repoParam}`
      handleSubmit(fullUrl, branchParam)
    }
  }, [analysis, isLoading, handleSubmit])

  const handleChatSend = useCallback((message: string) => {
    if (!analysis) return
    const repoUrl = analysis.repoUrl || activeUrl || 'https://github.com/dhanvithshetty-in/gitgrok'
    const repoName = repoUrl
      .replace(/^https?:\/\/(www\.)?github\.com\//, '')
      .replace(/\/$/, '')
      .replace(/\.git$/, '') || 'dhanvithshetty-in/gitgrok'
    const context = [
      `Repository: ${repoName}`,
      `Branch: ${analysis.branch || 'main'}`,
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
  }, [analysis, activeUrl, sendMessage])

  const handleSelectHistory = useCallback((id: string) => {
    const item = history.find(h => h.id === id)
    if (!item) return
    setActiveUrl(item.repoUrl)
    if (item.fullAnalysis) {
      setAnalysis(item.fullAnalysis)
    }
  }, [history, setAnalysis])

  const handleDeleteHistory = useCallback((id: string) => {
    setHistory(prev => prev.filter(h => h.id !== id))
  }, [])

  const handleNewAnalysis = useCallback(() => {
    setActiveUrl('')
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

  const currentDisplayUrl = activeUrl || analysis?.repoUrl || ''

  return (
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <header className="app-header" style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        backgroundColor: 'rgba(250, 248, 246, 0.85)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="app-header-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(234, 88, 12, 0.25)',
            }}>
              <LogoIcon />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  color: 'var(--text-heading)',
                  lineHeight: 1.2,
                }}>GitGrok</h1>
                {analysis && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '2px 8px',
                    borderRadius: 9999,
                    background: 'var(--accent-soft)',
                    border: '1px solid var(--accent-border)',
                  }}>
                    <div style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#16a34a',
                      boxShadow: '0 0 6px #16a34a',
                    }} />
                    <span style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: 'var(--accent)',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {(analysis.repoUrl || '').replace(/^https?:\/\/(www\.)?github\.com\//, '').replace(/\/$/, '') || 'active'}
                    </span>
                  </div>
                )}
              </div>
              <p style={{
                fontSize: 11,
                color: 'var(--text-secondary)',
                letterSpacing: '0.02em',
              }}>GitHub Repository Analyzer</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              className="btn-ghost"
              onClick={() => setIsCommandPaletteOpen(true)}
              style={{
                fontSize: 12,
                padding: '6px 14px',
                borderRadius: 9999,
                background: 'var(--bg-tertiary, #f5f0eb)',
                border: '1px solid var(--border)',
                color: 'var(--text-heading)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <kbd style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 4,
                padding: '1px 5px',
                fontWeight: 700,
                color: 'var(--accent)',
              }}>⌘K</kbd>
              Command Palette
            </button>

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
          <Hero3DSection onSubmit={handleSubmit} isLoading={isLoading} initialUrl={currentDisplayUrl} />
        )}

        {isLoading && (
          <div className="animate-fade-in">
            <div style={{ maxWidth: 560, margin: '0 auto 32px', textAlign: 'center' }}>
              <RepoInput onSubmit={handleSubmit} isLoading={isLoading} initialUrl={currentDisplayUrl} />
            </div>
            <LoadingSkeleton />
          </div>
        )}

        {error && (
          <div style={{ maxWidth: 560, margin: '40px auto 0', textAlign: 'center' }}>
            <RepoInput onSubmit={handleSubmit} isLoading={isLoading} initialUrl={currentDisplayUrl} />
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
          <div className="animate-fade-in-up">
            <div style={{ maxWidth: 640, margin: '0 auto 28px' }}>
              <RepoInput onSubmit={handleSubmit} isLoading={isLoading} initialUrl={currentDisplayUrl} />
            </div>

            <div className="analysis-layout" style={{
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
          </div>
        )}
      </main>

      <footer style={{
        borderTop: '1px solid var(--border)',
        marginTop: 80,
        padding: '20px 24px',
        textAlign: 'center',
        fontSize: 12,
        color: 'var(--text-secondary)',
      }}>
        Developed with ❤️ by <strong style={{ color: 'var(--accent)', fontWeight: 700 }}>Dhanvith Shetty</strong> • GitGrok AI Repository Intelligence
      </footer>

      {/* Global Command Palette Modal */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectRepo={(url) => {
          setIsCommandPaletteOpen(false)
          handleSubmit(url, 'main')
        }}
        history={history}
        analysis={analysis}
      />
    </div>
  )
}

export default App
