function Pulse({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      className="skeleton-shimmer"
      style={style}
    />
  )
}

function StatBox() {
  return (
    <div className="surface" style={{ padding: '16px 14px', textAlign: 'center', borderColor: 'transparent' }}>
      <Pulse style={{ width: 20, height: 20, borderRadius: 10, margin: '0 auto 10px' }} />
      <Pulse style={{ width: '50%', height: 20, margin: '0 auto 6px', borderRadius: 4 }} />
      <Pulse style={{ width: '35%', height: 10, margin: '0 auto', borderRadius: 3 }} />
    </div>
  )
}

function TextLine({ width = '100%' }: { width?: string }) {
  return <Pulse style={{ width, height: 12, marginBottom: 8, borderRadius: 4 }} />
}

function SectionBlock() {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <Pulse style={{ width: 3, height: 16, borderRadius: 2 }} />
        <Pulse style={{ width: 80, height: 11 }} />
      </div>
      <TextLine width="100%" />
      <TextLine width="95%" />
      <TextLine width="60%" />
    </div>
  )
}

function TreeLine({ depth = 0 }: { depth?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', paddingLeft: `${depth * 18 + 8}px` }}>
      <Pulse style={{ width: 12, height: 12, borderRadius: 3, flexShrink: 0 }} />
      <Pulse style={{ width: `${50 + Math.random() * 30}%`, height: 11, borderRadius: 3 }} />
    </div>
  )
}

export default function LoadingSkeleton() {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Pulse style={{ width: 40, height: 40, borderRadius: 12 }} />
        <div style={{ flex: 1 }}>
          <Pulse style={{ width: '40%', height: 16, marginBottom: 6, borderRadius: 4 }} />
          <Pulse style={{ width: '25%', height: 11, borderRadius: 3 }} />
        </div>
        <Pulse style={{ width: 60, height: 20, borderRadius: 6 }} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
        gap: 8,
      }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.04}s` }}>
            <StatBox />
          </div>
        ))}
      </div>

      <div className="surface-elevated" style={{ padding: 24, borderColor: 'transparent' }}>
        <SectionBlock />
        <SectionBlock />
        <SectionBlock />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <Pulse style={{ width: 12, height: 12, borderRadius: 6, flexShrink: 0, marginTop: 2 }} />
                <Pulse style={{ width: '85%', height: 11 }} />
              </div>
            ))}
          </div>
          <div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <Pulse style={{ width: 12, height: 12, borderRadius: 6, flexShrink: 0, marginTop: 2 }} />
                <Pulse style={{ width: '75%', height: 11 }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Pulse style={{ width: 3, height: 16, borderRadius: 2 }} />
          <Pulse style={{ width: 80, height: 11 }} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Pulse key={i} style={{ width: `${70 + i * 15}px`, height: 24, borderRadius: 6 }} />
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="surface-elevated" style={{ padding: 6, borderColor: 'transparent' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
            <Pulse style={{ width: 120, height: 13 }} />
          </div>
          {Array.from({ length: 12 }).map((_, i) => (
            <TreeLine key={i} depth={i % 4} />
          ))}
        </div>

        <div className="surface-elevated" style={{ height: 400, display: 'flex', flexDirection: 'column', borderColor: 'transparent' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
            <Pulse style={{ width: 120, height: 13 }} />
            <Pulse style={{ width: 40, height: 13 }} />
          </div>
          <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
            <Pulse style={{ width: 32, height: 32, borderRadius: 16 }} />
            <Pulse style={{ width: 180, height: 13 }} />
            <Pulse style={{ width: 240, height: 11 }} />
          </div>
          <div style={{ borderTop: '1px solid var(--border)', padding: 12 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <Pulse style={{ flex: 1, height: 36, borderRadius: 8 }} />
              <Pulse style={{ width: 36, height: 36, borderRadius: 8 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
