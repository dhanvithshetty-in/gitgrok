import { useState, useCallback, useEffect } from 'react'
import RepoInput from './components/RepoInput'
import AnalysisDashboard from './components/AnalysisDashboard'
import HistorySidebar from './components/HistorySidebar'
import LoadingSkeleton from './components/LoadingSkeleton'
import { useAnalysis } from './hooks/useAnalysis'
import { useChat } from './hooks/useChat'
import { mockAnalysis } from './services/mockData'
import type { RepoAnalysis } from './types'

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

function App() {
  const { analysis: liveAnalysis, isLoading: liveLoading, error, submitAnalysis, reset } = useAnalysis()
  const { messages, isStreaming, sendMessage, clearMessages } = useChat()
  const [history, setHistory] = useState<HistoryItem[]>(loadHistory)
  const [demoAnalysis, setDemoAnalysis] = useState<RepoAnalysis | null>(null)
  const [showSplash, setShowSplash] = useState(true)

  const analysis = liveAnalysis || demoAnalysis
  const isLoading = liveLoading

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  }, [history])

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (analysis) window.scrollTo({ top: 0 })
  }, [!!analysis])

  const handleSubmit = useCallback(async (url: string, branch: string) => {
    if (url === demoAnalysis?.repoUrl) {
      setDemoAnalysis(demoAnalysis)
      return
    }
    await submitAnalysis({ repoUrl: url, branch })
  }, [submitAnalysis, demoAnalysis])

  const handleTryDemo = useCallback(() => {
    const demo = { ...mockAnalysis, id: `demo-${Date.now()}` }
    setDemoAnalysis(demo)
    setHistory(prev => {
      const newItem: HistoryItem = {
        id: demo.id,
        repoUrl: demo.repoUrl,
        branch: demo.branch,
        analyzedAt: demo.analyzedAt,
        summary: demo.summary.purpose.slice(0, 100),
      }
      return [newItem, ...prev.filter(h => h.repoUrl !== demo.repoUrl)].slice(0, 20)
    })
  }, [])

  const handleChatSend = useCallback((message: string) => {
    if (!analysis) return
    sendMessage(analysis.id, message, analysis.summary.architecture)
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
    setDemoAnalysis(null)
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
            fontSize: 32,
            marginBottom: 12,
            animation: 'pulse 2s ease-in-out infinite',
          }}>🔍</div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 20,
            fontWeight: 600,
            color: 'var(--text-heading)',
            marginBottom: 4,
          }}>GitGrok</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <header style={{
        borderBottom: '1px solid var(--border)',
        background: 'rgba(248, 249, 251, 0.8)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 22 }}>🔍</span>
            <div>
              <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 17,
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: 'var(--text-heading)',
                lineHeight: 1.2,
              }}>GitGrok</h1>
              <p style={{
                fontSize: 11,
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-body)',
                letterSpacing: '0.02em',
              }}>GitHub Repository Analyzer</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {!analysis && !isLoading && (
              <button className="btn-accent" onClick={handleTryDemo} style={{ fontSize: 13, padding: '8px 16px' }}>
                <span>🚀</span>
                Try Demo
              </button>
            )}
            {analysis && (
              <button className="btn-ghost" onClick={handleNewAnalysis}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New Analysis
              </button>
            )}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        {!analysis && !isLoading && !error && (
          <div className="splash-pattern" style={{ maxWidth: 560, margin: '60px auto 0', textAlign: 'center' }}>
            <div className="animate-fade-in-up stagger-1" style={{ marginBottom: 40 }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: 'var(--accent-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: 28,
              }}>🔍</div>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--fs-2xl)',
                fontWeight: 700,
                color: 'var(--text-heading)',
                marginBottom: 10,
                lineHeight: 1.2,
              }}>
                Understand any<br />GitHub repository
              </h2>
              <p style={{
                fontSize: 15,
                color: 'var(--text)',
                lineHeight: 1.6,
                maxWidth: 420,
                margin: '0 auto',
              }}>
                Paste a repository URL and get instant AI-powered analysis — architecture overview,
                tech stack, file structure, and dependency graphs.
              </p>
            </div>

            <div className="animate-fade-in-up stagger-3">
              <button className="btn-accent" onClick={handleTryDemo} style={{
                fontSize: 15,
                padding: '14px 28px',
                borderRadius: 10,
                marginBottom: 28,
              }}>
                <span>🚀</span>
                Try Demo Analysis
              </button>
            </div>

            <div className="animate-fade-in-up stagger-4" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 24,
            }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{
                fontSize: 12,
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-body)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>Or analyze a real repo</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            <div className="animate-fade-in-up stagger-5">
              <RepoInput onSubmit={handleSubmit} isLoading={isLoading} />
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
              <button className="btn-accent" onClick={handleTryDemo} style={{ fontSize: 13, padding: '10px 20px' }}>
                <span>🚀</span> Try Demo Instead
              </button>
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
        color: 'var(--text-secondary)',
      }}>
        GitGrok — React + TypeScript + Tailwind CSS + n8n
      </footer>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (prefers-color-scheme: dark) {
          header { background: rgba(9, 9, 11, 0.8) !important; }
        }
        @media (max-width: 768px) {
          .analysis-layout {
            grid-template-columns: 1fr !important;
          }
          .sidebar-sticky {
            position: static !important;
          }
        }
      `}</style>
    </div>
  )
}

export default App
