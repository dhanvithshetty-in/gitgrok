import { useState } from 'react'
import type { FileNode } from '../types'

interface FileTreeProps {
  nodes: FileNode[]
}

function FileIcon({ name, type }: { name: string; type: string }) {
  if (type === 'dir') return <span>📁</span>
  const ext = name.split('.').pop()?.toLowerCase()
  const icons: Record<string, string> = {
    ts: '🔷', tsx: '⚛️', js: '🟨', jsx: '⚛️',
    py: '🐍', rs: '🦀', go: '🔵', java: '☕',
    json: '📋', md: '📝', yml: '⚙️', yaml: '⚙️',
    css: '🎨', scss: '🎨', html: '🌐', sql: '🗃️',
    toml: '⚙️', lock: '🔒', gitignore: '🙈',
  }
  return <span>{icons[ext || ''] || '📄'}</span>
}

function TreeNode({ node, depth }: { node: FileNode; depth: number }) {
  const [expanded, setExpanded] = useState(depth < 1)
  const hasChildren = node.type === 'dir' && node.children && node.children.length > 0

  return (
    <div>
      <button
        onClick={() => hasChildren && setExpanded(!expanded)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '5px 8px',
          paddingLeft: `${depth * 18 + 8}px`,
          borderRadius: 6,
          border: 'none',
          background: 'transparent',
          cursor: hasChildren ? 'pointer' : 'default',
          color: 'var(--text)',
          fontSize: 13,
          fontFamily: 'var(--font-body)',
          transition: 'background 0.12s',
        }}
        onMouseEnter={e => { if (hasChildren) e.currentTarget.style.background = 'var(--accent-soft)' }}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        {hasChildren ? (
          <span style={{
            fontSize: 9,
            color: 'var(--text-secondary)',
            width: 12,
            textAlign: 'center',
            transition: 'transform 0.15s',
            transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
          }}>▶</span>
        ) : (
          <span style={{ width: 12 }} />
        )}
        <FileIcon name={node.name} type={node.type} />
        <span style={{
          color: 'var(--text-heading)',
          fontWeight: node.type === 'dir' ? 500 : 400,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>{node.name}</span>
        {node.type === 'file' && node.language && (
          <span style={{
            marginLeft: 'auto',
            fontSize: 10,
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
          }}>{node.language}</span>
        )}
      </button>
      {hasChildren && (
        <div style={{
          overflow: 'hidden',
          transition: 'max-height 0.2s ease',
          maxHeight: expanded ? 2000 : 0,
        }}>
          {node.children!.map(child => (
            <TreeNode key={child.path} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function FileTree({ nodes }: FileTreeProps) {
  return (
    <div className="surface-elevated animate-fade-in-up stagger-4" style={{ overflow: 'hidden' }}>
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <div style={{
          width: 3,
          height: 16,
          borderRadius: 2,
          background: 'var(--accent)',
        }} />
        <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-heading)' }}>Repository Files</h3>
      </div>
      <div style={{ padding: 6, maxHeight: 420, overflowY: 'auto' }}>
        {nodes.map(node => (
          <TreeNode key={node.path} node={node} depth={0} />
        ))}
      </div>
    </div>
  )
}
