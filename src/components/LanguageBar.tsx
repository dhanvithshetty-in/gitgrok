import type { FileNode, TechStack } from '../types'

interface LanguageBarProps {
  fileTree?: FileNode[]
  techStack?: TechStack[]
}

interface LangStat {
  name: string
  count: number
  percentage: number
  color: string
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  React: '#61DAFB',
  Python: '#3572A5',
  CSS: '#563D7C',
  HTML: '#E34F26',
  JSON: '#292929',
  Markdown: '#083FA1',
  SQL: '#e38c00',
  Go: '#00ADD8',
  Rust: '#DEA584',
  Java: '#B07219',
  PHP: '#4F5D95',
  Shell: '#89E051',
  Other: '#94A3B8',
}

function countLanguagesFromFileTree(tree?: FileNode[]): Record<string, number> {
  const counts: Record<string, number> = {}

  function traverse(nodes?: FileNode[]) {
    if (!nodes || !Array.isArray(nodes)) return
    nodes.forEach(node => {
      if (node.type === 'file' && node.name) {
        const ext = node.name.split('.').pop()?.toLowerCase() || ''
        let lang = 'Other'
        if (ext === 'ts' || ext === 'tsx') lang = 'TypeScript'
        else if (ext === 'js' || ext === 'jsx' || ext === 'mjs') lang = 'JavaScript'
        else if (ext === 'py') lang = 'Python'
        else if (ext === 'css' || ext === 'scss') lang = 'CSS'
        else if (ext === 'html') lang = 'HTML'
        else if (ext === 'json') lang = 'JSON'
        else if (ext === 'md') lang = 'Markdown'
        else if (ext === 'sql') lang = 'SQL'
        else if (ext === 'go') lang = 'Go'
        else if (ext === 'rs') lang = 'Rust'
        else if (ext === 'java') lang = 'Java'
        else if (ext === 'sh' || ext === 'bash') lang = 'Shell'

        counts[lang] = (counts[lang] || 0) + 1
      }
      if (node.children) traverse(node.children)
    })
  }

  traverse(tree)
  return counts
}

export default function LanguageBar({ fileTree, techStack }: LanguageBarProps) {
  const counts = countLanguagesFromFileTree(fileTree)
  const totalFiles = Object.values(counts).reduce((a, b) => a + b, 0)

  let stats: LangStat[] = []

  if (totalFiles > 0) {
    stats = Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: +((count / totalFiles) * 100).toFixed(1),
        color: LANGUAGE_COLORS[name] || LANGUAGE_COLORS.Other,
      }))
      .sort((a, b) => b.percentage - a.percentage)
  } else if (techStack && techStack.length > 0) {
    const totalTech = techStack.reduce((acc, t) => acc + (t.percentage || 20), 0)
    stats = techStack.map(t => ({
      name: t.name,
      count: 1,
      percentage: totalTech > 0 ? +(((t.percentage || 20) / totalTech) * 100).toFixed(1) : 20,
      color: LANGUAGE_COLORS[t.name] || '#EA580C',
    }))
  }

  if (stats.length === 0) {
    stats = [
      { name: 'TypeScript', count: 12, percentage: 65, color: '#3178C6' },
      { name: 'CSS', count: 4, percentage: 22, color: '#563D7C' },
      { name: 'HTML', count: 2, percentage: 13, color: '#E34F26' },
    ]
  }

  return (
    <div className="surface" style={{ padding: '16px 20px', borderRadius: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 16, borderRadius: 9999, background: 'var(--accent)' }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-heading)', letterSpacing: '-0.01em' }}>
            Languages & File Composition
          </span>
        </div>
        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
          {totalFiles > 0 ? `${totalFiles} indexed files` : 'Codebase statistics'}
        </span>
      </div>

      {/* Multi-color Bar */}
      <div
        style={{
          width: '100%',
          height: 10,
          borderRadius: 9999,
          overflow: 'hidden',
          display: 'flex',
          background: 'var(--border-subtle)',
          marginBottom: 12,
        }}
      >
        {stats.map(s => (
          <div
            key={s.name}
            style={{
              width: `${s.percentage}%`,
              height: '100%',
              background: s.color,
              transition: 'width 0.5s var(--ease)',
            }}
            title={`${s.name}: ${s.percentage}%`}
          />
        ))}
      </div>

      {/* Language Breakdown Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {stats.map(s => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
            <span style={{ fontWeight: 600, color: 'var(--text-heading)' }}>{s.name}</span>
            <span style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
              {s.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
