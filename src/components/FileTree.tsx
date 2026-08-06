import { useState } from 'react'
import type { FileNode } from '../types'

interface FileTreeProps {
  nodes: FileNode[]
}

function Chevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      style={{
        color: 'var(--text-tertiary)',
        flexShrink: 0,
        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
      }}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function Dot({ color }: { color: string }) {
  return (
    <span style={{
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: color,
      flexShrink: 0,
      boxShadow: `0 0 6px ${color}33`,
    }} />
  )
}

function FileLabel({ name, type }: { name: string; type: string }) {
  const ext = (name || '').split('.').pop()?.toLowerCase()
  const dot: Record<string, string> = {
    ts: '#3178C6', tsx: '#3178C6', js: '#F7DF1E', jsx: '#61DAFB',
    py: '#3776AB', rs: '#DEA584', go: '#00ADD8', java: '#B07219',
    json: '#5C5C5C', md: '#4A9B8F', yml: '#8B5CF6', yaml: '#8B5CF6',
    css: '#1572B6', scss: '#BF4080', html: '#E34F26', sql: '#E38C00',
    toml: '#8B5CF6', lock: '#5C5C5C', gitignore: '#5C5C5C',
  }
  const color = type === 'dir' ? 'var(--accent)' : (dot[ext || ''] || 'var(--text-tertiary)')
  return <Dot color={color} />
}

function TreeNode({ node, depth }: { node: FileNode; depth: number }) {
  const [expanded, setExpanded] = useState(depth < 1)
  const hasChildren = node.type === 'dir' && node.children && node.children.length > 0

  return (
    <div>
      <button
        onClick={() => hasChildren && setExpanded(!expanded)}
        className="tree-row"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 8px',
          paddingLeft: `${depth * 18 + 8}px`,
          borderRadius: 6,
          border: 'none',
          background: 'transparent',
          cursor: hasChildren ? 'pointer' : 'default',
          color: 'var(--text)',
          fontSize: 14,
          fontFamily: 'var(--font-body)',
        }}
      >
        <span style={{ width: 12, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
          {hasChildren ? <Chevron expanded={expanded} /> : <span style={{ width: 10 }} />}
        </span>
        <FileLabel name={node.name} type={node.type} />
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
            fontSize: 11,
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-mono)',
            flexShrink: 0,
          }}>{node.language}</span>
        )}
      </button>
      {hasChildren && (
        <div style={{
          overflow: 'hidden',
          transition: 'max-height 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          maxHeight: expanded ? 5000 : 0,
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
  // Convert flat string[] into FileNode[] if needed
  const fileNodes: FileNode[] = Array.isArray(nodes) && nodes.length > 0 && typeof nodes[0] === 'string'
    ? (nodes as unknown as string[]).map(p => ({ name: p.split('/').pop() || p, path: p, type: 'file' as const }))
    : (nodes as FileNode[])

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
        {fileNodes.map(node => (
          <TreeNode key={node.path} node={node} depth={0} />
        ))}
      </div>
    </div>
  )
}
