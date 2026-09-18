import { useState, useRef } from 'react'
import RepoInput from './RepoInput'

interface Hero3DSectionProps {
  onSubmit: (url: string, branch: string) => void
  isLoading: boolean
  initialUrl?: string
}

const SAMPLE_REPOS = [
  { name: 'facebook/react', label: 'React JS', icon: '⚛️', url: 'https://github.com/facebook/react' },
  { name: 'expressjs/express', label: 'Express', icon: '🚀', url: 'https://github.com/expressjs/express' },
  { name: 'python/cpython', label: 'Python', icon: '🐍', url: 'https://github.com/python/cpython' },
  { name: 'vercel/next.js', label: 'Next.js', icon: '▲', url: 'https://github.com/vercel/next.js' },
  { name: 'dhanvithshetty-in/gitgrok', label: 'GitGrok AI', icon: '⚡', url: 'https://github.com/dhanvithshetty-in/gitgrok' },
]

export default function Hero3DSection({ onSubmit, isLoading, initialUrl = '' }: Hero3DSectionProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    // Calculate rotation: max 12 degrees
    const rotateX = (-y / (rect.height / 2)) * 10
    const rotateY = (x / (rect.width / 2)) * 10
    setTilt({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  const handleQuickSelect = (url: string) => {
    onSubmit(url, 'main')
  }

  return (
    <div className="pro-hero-container animate-fade-in">
      {/* Dynamic Background Mesh & Glow Orbs */}
      <div className="hero-glow-orb orb-primary" />
      <div className="hero-glow-orb orb-secondary" />
      <div className="hero-grid-pattern" />

      {/* Pro Badge Header */}
      <div className="hero-content text-center">
        <div className="hero-badge animate-fade-in-up">
          <span className="badge-pulse-dot" />
          <span className="hero-badge-text">AI-POWERED REPOSITORY INTELLIGENCE 2.0</span>
          <span className="hero-badge-pill">Groq + Supabase RAG</span>
        </div>

        {/* 3D Holographic Heading */}
        <h1 className="hero-title animate-fade-in-up stagger-1">
          Deconstruct Any Codebase <br />
          <span className="gradient-text-glow">With Neural AI Precision</span>
        </h1>

        <p className="hero-subtitle animate-fade-in-up stagger-2">
          Paste any public GitHub repository to generate interactive architecture diagrams,
          deep code health scorecards, AST dependency graphs, and perform semantic RAG chat.
        </p>

        {/* 3D Interactive Search Box Card */}
        <div 
          className="hero-3d-wrapper animate-fade-in-up stagger-3"
          style={{ perspective: '1200px' }}
        >
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="hero-3d-card"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: tilt.x === 0 && tilt.y === 0 ? 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
            }}
          >
            <div className="hero-3d-card-inner">
              <div className="card-top-bar">
                <div className="window-dots">
                  <span className="dot dot-red" />
                  <span className="dot dot-yellow" />
                  <span className="dot dot-green" />
                </div>
                <div className="window-title">gitgrok // ingest & analyze</div>
                <div className="window-badge">⚡ Vector RAG</div>
              </div>

              <div className="card-body">
                <RepoInput onSubmit={onSubmit} isLoading={isLoading} initialUrl={initialUrl} />
              </div>

              {/* Quick Select Preset Pills */}
              <div className="quick-repos-section">
                <div className="quick-repos-label">Try instant analysis on popular repositories:</div>
                <div className="quick-repos-pills">
                  {SAMPLE_REPOS.map((repo) => (
                    <button
                      key={repo.name}
                      onClick={() => handleQuickSelect(repo.url)}
                      disabled={isLoading}
                      className="quick-repo-pill"
                    >
                      <span className="pill-icon">{repo.icon}</span>
                      <span className="pill-name">{repo.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Feature Grid */}
        <div className="pro-features-grid animate-fade-in-up stagger-4">
          <div className="pro-feature-card">
            <div className="feature-card-glow" />
            <div className="feature-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="2" />
                <rect x="14" y="3" width="7" height="7" rx="2" />
                <rect x="14" y="14" width="7" height="7" rx="2" />
                <rect x="3" y="14" width="7" height="7" rx="2" />
              </svg>
            </div>
            <h3>Mermaid Architecture</h3>
            <p>Automated visual graph diagrams detailing module relationships and component boundaries.</p>
            <div className="feature-card-tag">Interactive Graph</div>
          </div>

          <div className="pro-feature-card">
            <div className="feature-card-glow" />
            <div className="feature-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                <path d="M8 10h8" />
                <path d="M8 14h5" />
              </svg>
            </div>
            <h3>Vector Neural Chat</h3>
            <p>Chunk-level embeddings stored in Supabase pgvector for contextual repository Q&A.</p>
            <div className="feature-card-tag">768-D Embeddings</div>
          </div>

          <div className="pro-feature-card">
            <div className="feature-card-glow" />
            <div className="feature-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h3>Code Health Scorecard</h3>
            <p>Automated quality assessment, technical debt detection, strengths, and recommendations.</p>
            <div className="feature-card-tag">Grades A - F</div>
          </div>
        </div>

        {/* Live System Capabilities Marquee Ticker */}
        <div className="marquee-ticker-container animate-fade-in-up stagger-5">
          <div className="ticker-track">
            <span>🔥 HNSW Vector Indexing Active</span>
            <span>⚡ Groq Qwen-3.8 27B LLM Engine</span>
            <span>🛡️ Automated Health & Quality Auditor</span>
            <span>🚀 Instant Multi-File AST Decomposition</span>
            <span>📊 Interactive Mermaid Flowchart Visualizer</span>
            <span>🔥 HNSW Vector Indexing Active</span>
            <span>⚡ Groq Qwen-3.8 27B LLM Engine</span>
          </div>
        </div>
      </div>
    </div>
  )
}
