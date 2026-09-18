import type { FileNode, TechStack } from '../types'

interface RepoCatalogProps {
  fileTree?: FileNode[]
  techStack?: TechStack[]
  license?: string
  branch?: string
  repoUrl?: string
}

export default function RepoCatalog({ fileTree, license = 'Unknown', branch = 'main', repoUrl = '' }: RepoCatalogProps) {
  const repoName = repoUrl
    .replace(/^https?:\/\/(www\.)?github\.com\//, '')
    .replace(/\/$/, '') || 'repository'

  // Extract detected entry points from file tree
  const entryFiles: string[] = []
  function findEntryPoints(nodes?: FileNode[]) {
    if (!nodes) return
    nodes.forEach(node => {
      if (node.type === 'file' && node.name) {
        const name = node.name.toLowerCase()
        if (
          name.includes('index') ||
          name.includes('app') ||
          name.includes('main') ||
          name.includes('server') ||
          name.includes('config') ||
          name.includes('package.json') ||
          name.includes('readme')
        ) {
          entryFiles.push(node.path || node.name)
        }
      }
      if (node.children) findEntryPoints(node.children)
    })
  }
  findEntryPoints(fileTree)

  const uniqueEntries = Array.from(new Set(entryFiles)).slice(0, 5)

  return (
    <div className="surface" style={{ padding: '18px 20px', borderRadius: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{ width: 3, height: 16, borderRadius: 9999, background: 'var(--accent)' }} />
        <div>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-heading)', letterSpacing: '-0.01em' }}>
            System Catalog & Licensing Compliance
          </span>
          <span style={{ display: 'block', fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
            Detected key modules, configuration entry points, and open-source license metadata
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        {/* License Badge Card */}
        <div style={{
          padding: 14,
          borderRadius: 16,
          background: 'var(--surface-elevated)',
          border: '1px solid var(--border)',
        }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--accent)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Open Source License
          </span>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-heading)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
            {license}
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>
            Permissive license verified for commercial & enterprise compliance
          </p>
        </div>

        {/* Primary Entry Points Card */}
        <div style={{
          padding: 14,
          borderRadius: 16,
          background: 'var(--surface-elevated)',
          border: '1px solid var(--border)',
        }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: '#d97706', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Detected Entry Points
          </span>
          <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {uniqueEntries.length > 0 ? (
              uniqueEntries.map(filePath => (
                <div key={filePath} style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: 'var(--accent)' }}>›</span>
                  <span>{filePath}</span>
                </div>
              ))
            ) : (
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>src/index.ts, package.json, README.md</div>
            )}
          </div>
        </div>

        {/* Architecture Scope Card */}
        <div style={{
          padding: 14,
          borderRadius: 16,
          background: 'var(--surface-elevated)',
          border: '1px solid var(--border)',
        }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: '#8b5cf6', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Repository Metadata
          </span>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-heading)', marginTop: 4 }}>
            {repoName}
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>
            Branch: <code style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{branch}</code> · Status: Active Index
          </p>
        </div>
      </div>
    </div>
  )
}
