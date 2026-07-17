import { useEffect, useRef, useState } from 'react'

interface MermaidRendererProps {
  diagram: string
}

export default function MermaidRenderer({ diagram }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!diagram || !containerRef.current) return

    async function render() {
      try {
        const mermaid = (await import('mermaid')).default
        mermaid.initialize({
          startOnLoad: false,
          theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'default',
          securityLevel: 'loose',
        })
        const { svg } = await mermaid.render('mermaid-svg', diagram)
        if (containerRef.current) {
          containerRef.current.innerHTML = svg
        }
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to render diagram')
      }
    }
    render()
  }, [diagram])

  if (error) {
    return (
      <div className="surface-elevated animate-fade-in-up stagger-4" style={{
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

  return (
    <div className="surface-elevated animate-fade-in-up stagger-5" style={{ padding: 20, overflowX: 'auto' }}>
      <div ref={containerRef} style={{
        display: 'flex',
        justifyContent: 'center',
        minHeight: 120,
      }} />
    </div>
  )
}
