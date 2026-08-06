import { useEffect, useRef, useState } from 'react'

interface MermaidRendererProps {
  diagram: string
}

export default function MermaidRenderer({ diagram }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const source = diagram?.trim() || ''
    if (!source || !containerRef.current) return

    let cancelled = false
    const renderId = `gitgrok-mermaid-${Math.random().toString(36).slice(2, 8)}`

    async function render() {
      try {
        const mermaid = (await import('mermaid')).default
        mermaid.initialize({
          startOnLoad: false,
          theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'default',
          securityLevel: 'loose',
        })
        const { svg } = await mermaid.render(renderId, source)
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg
        }
        if (!cancelled) setError(null)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to render diagram')
        }
      }
    }
    render()
    return () => {
      cancelled = true
    }
  }, [diagram])

  if (error) {
    return (
      <div className="surface-elevated" style={{
        padding: 20,
        borderColor: 'rgba(239, 68, 68, 0.15)',
      }}>
        <p style={{ fontSize: 13, color: 'var(--error)', marginBottom: 8 }}>Diagram render failed</p>
        <pre style={{
          fontSize: 11,
          color: 'var(--text-secondary)',
          whiteSpace: 'pre-wrap',
          fontFamily: 'var(--font-mono)',
        }}>{diagram}</pre>
      </div>
    )
  }

  if (!diagram || !diagram.trim()) {
    return (
      <div className="surface-elevated" style={{ padding: 24 }}>
        <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>No architecture diagram was generated for this repository.</p>
      </div>
    )
  }

  return (
    <div className="surface-elevated" style={{ padding: 24, overflowX: 'auto' }}>
      <div ref={containerRef} style={{
        display: 'flex',
        justifyContent: 'center',
        minHeight: 120,
      }} />
    </div>
  )
}
