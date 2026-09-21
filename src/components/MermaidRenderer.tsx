import { useEffect, useState, useRef } from 'react'
import type { FileNode, TechStack } from '../types'

interface MermaidRendererProps {
  diagram?: string
  fileTree?: FileNode[]
  techStack?: TechStack[]
  repoName?: string
}

function cleanMermaid(raw?: string): string {
  if (!raw || typeof raw !== 'string' || !raw.trim()) return ''
  let cleaned = raw.trim()
  cleaned = cleaned.replace(/^```(mermaid)?/gi, '').replace(/```$/gi, '').trim()
  cleaned = cleaned.replace(/<br\s*\/?>/gi, ' ')
  return cleaned
}

function buildSimpleDefaultDiagram(fileTree?: FileNode[], _techStack?: TechStack[], repoName?: string): string {
  const dirs = (fileTree || []).filter(n => n.type === 'dir' && !n.name.startsWith('.'))
  const mainDirs = dirs.slice(0, 4).map(d => d.name)
  const name = repoName || 'Repository'

  let diagram = `graph TD\n`
  diagram += `  Client["User / Client"] --> App["${name}"]\n`
  if (mainDirs.length > 0) {
    mainDirs.forEach((dir, i) => {
      const id = dir.replace(/[^a-zA-Z0-9]/g, '_')
      diagram += `  App --> ${id}${i}["${dir}/"]\n`
    })
  } else {
    diagram += `  App --> Core["Core Logic"]\n`
    diagram += `  Core --> Storage["Storage / Cache"]\n`
  }
  return diagram
}

function processSvgString(svg: string): string {
  if (!svg) return ''
  let cleaned = svg
    .replace(/max-width:\s*[^;"]+;?/gi, '')
    .replace(/width="100%"/gi, '')

  const customStyles = `<style>
    .mermaid-wrapper svg {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      width: 100% !important;
      max-width: 480px !important;
      height: auto !important;
      margin: 0 auto !important;
      display: block !important;
    }
    .mermaid-wrapper .node rect, .mermaid-wrapper .node circle, .mermaid-wrapper .node polygon, .mermaid-wrapper .node path {
      fill: #ffffff !important;
      stroke: #ea580c !important;
      stroke-width: 1.5px !important;
      rx: 8px !important;
      ry: 8px !important;
    }
    .mermaid-wrapper text, .mermaid-wrapper .label text, .mermaid-wrapper .nodeLabel {
      fill: #0f172a !important;
      font-size: 11px !important;
      font-family: system-ui, -apple-system, sans-serif !important;
    }
    .mermaid-wrapper .edgePath path {
      stroke: #ea580c !important;
      stroke-width: 1.5px !important;
    }
    .mermaid-wrapper .arrowheadPath {
      fill: #ea580c !important;
      stroke: #ea580c !important;
    }
  </style>`

  return cleaned.replace(/<svg([^>]*)>/, `<svg$1>${customStyles}`)
}

function getSvgData(svgEl: SVGElement): { svgString: string; width: number; height: number } {
  const clone = svgEl.cloneNode(true) as SVGElement
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')

  // Convert foreignObject nodes to native SVG text nodes to prevent canvas tainting in Chrome
  const foreignObjects = Array.from(clone.querySelectorAll('foreignObject'))
  foreignObjects.forEach(fo => {
    const textContent = fo.textContent?.trim() || ''
    const x = parseFloat(fo.getAttribute('x') || '0')
    const y = parseFloat(fo.getAttribute('y') || '0')
    const width = parseFloat(fo.getAttribute('width') || '100')
    const height = parseFloat(fo.getAttribute('height') || '20')

    const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    textEl.setAttribute('x', `${x + width / 2}`)
    textEl.setAttribute('y', `${y + height / 2 + 4}`)
    textEl.setAttribute('text-anchor', 'middle')
    textEl.setAttribute('dominant-baseline', 'middle')
    textEl.setAttribute('fill', '#0f172a')
    textEl.setAttribute('font-size', '11px')
    textEl.setAttribute('font-family', 'sans-serif')
    textEl.textContent = textContent

    fo.parentNode?.replaceChild(textEl, fo)
  })

  // Strip style tags containing external imports, url(), or font-face references
  const styleElements = Array.from(clone.querySelectorAll('style'))
  styleElements.forEach(s => {
    let css = s.textContent || ''
    css = css.replace(/@import\s+url\([^)]+\);?/gi, '')
    css = css.replace(/url\([^)]+\)/gi, 'none')
    s.textContent = css
  })

  // Strip images with external hrefs
  const images = Array.from(clone.querySelectorAll('image'))
  images.forEach(img => img.remove())

  let width = 600
  let height = 400

  const viewBox = svgEl.getAttribute('viewBox') || clone.getAttribute('viewBox')
  if (viewBox) {
    const parts = viewBox.split(/[\s,]+/).filter(Boolean).map(Number)
    if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
      width = Math.round(parts[2])
      height = Math.round(parts[3])
    }
  } else {
    const bbox = svgEl.getBoundingClientRect()
    if (bbox.width > 0 && bbox.height > 0) {
      width = Math.round(bbox.width)
      height = Math.round(bbox.height)
    }
  }

  width = Math.max(width, 400)
  height = Math.max(height, 200)

  clone.setAttribute('width', `${width}`)
  clone.setAttribute('height', `${height}`)
  if (!clone.getAttribute('viewBox')) {
    clone.setAttribute('viewBox', `0 0 ${width} ${height}`)
  }

  clone.setAttribute('style', `background-color: #ffffff; font-family: sans-serif;`)

  const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  bgRect.setAttribute('x', '0')
  bgRect.setAttribute('y', '0')
  bgRect.setAttribute('width', '100%')
  bgRect.setAttribute('height', '100%')
  bgRect.setAttribute('fill', '#ffffff')
  clone.insertBefore(bgRect, clone.firstChild)

  const styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style')
  styleEl.textContent = `
    svg { background-color: #ffffff !important; }
    .node rect, .node circle, .node polygon, .node path {
      fill: #ffffff !important;
      stroke: #ea580c !important;
      stroke-width: 1.5px !important;
      rx: 8px !important;
      ry: 8px !important;
    }
    text, .label text, .nodeLabel, tspan {
      fill: #0f172a !important;
      color: #0f172a !important;
      font-size: 11px !important;
      font-family: sans-serif !important;
    }
    .edgePath path {
      stroke: #ea580c !important;
      stroke-width: 1.5px !important;
    }
    .arrowheadPath {
      fill: #ea580c !important;
      stroke: #ea580c !important;
    }
  `
  clone.insertBefore(styleEl, clone.firstChild)

  const xmlSerializer = new XMLSerializer()
  let svgString = xmlSerializer.serializeToString(clone)

  svgString = svgString.replace(/@import\s+url\([^)]+\);?/gi, '')
  svgString = svgString.replace(/url\(["']?https?:[^)]+["']?\)/gi, 'none')

  if (!svgString.startsWith('<?xml')) {
    svgString = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' + svgString
  }

  return { svgString, width, height }
}

function triggerDownload(url: string, filename: string) {
  const cleanFilename = filename.endsWith('.png') ? filename : `${filename}.png`
  const a = document.createElement('a')
  a.href = url
  a.download = cleanFilename
  a.setAttribute('download', cleanFilename)
  a.target = '_self'
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    if (a.parentNode) a.parentNode.removeChild(a)
  }, 1000)
}

export default function MermaidRenderer({ diagram, fileTree, techStack, repoName }: MermaidRendererProps) {
  const [svgContent, setSvgContent] = useState<string>('')
  const [isRendering, setIsRendering] = useState(true)
  const [zoom, setZoom] = useState(1.0)
  const [isExportingPng, setIsExportingPng] = useState(false)
  const diagramContainerRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = () => setZoom(prev => Math.min(2.0, +(prev + 0.15).toFixed(2)))
  const handleZoomOut = () => setZoom(prev => Math.max(0.5, +(prev - 0.15).toFixed(2)))
  const handleResetZoom = () => setZoom(1.0)

  const handleDownloadPng = async () => {
    const container = diagramContainerRef.current
    const svgEl = container?.querySelector('svg')
    if (!svgEl) return

    try {
      setIsExportingPng(true)
      const { svgString, width, height } = getSvgData(svgEl)

      const scale = 2
      const canvas = document.createElement('canvas')
      canvas.width = width * scale
      canvas.height = height * scale
      const ctx = canvas.getContext('2d')

      if (!ctx) throw new Error('Could not get canvas context')

      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const base64Svg = window.btoa(unescape(encodeURIComponent(svgString)))
      const dataUrl = `data:image/svg+xml;base64,${base64Svg}`
      const img = new Image()

      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          try {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            resolve()
          } catch (err) {
            reject(err)
          }
        }
        img.onerror = (err) => reject(err)
        img.src = dataUrl
      })

      canvas.toBlob((pngBlob) => {
        if (!pngBlob) {
          console.error('Failed to create PNG blob')
          return
        }
        const safeRepoName = typeof repoName === 'string' && repoName.trim()
          ? repoName.replace(/[^a-zA-Z0-9_-]/g, '_')
          : 'gitgrok'
        const filename = `${safeRepoName}-architecture.png`
        const pngBlobUrl = URL.createObjectURL(pngBlob)

        triggerDownload(pngBlobUrl, filename)
        setTimeout(() => URL.revokeObjectURL(pngBlobUrl), 10000)
      }, 'image/png')
    } catch (err) {
      console.error('PNG export failed:', err)
    } finally {
      setIsExportingPng(false)
    }
  }

  useEffect(() => {
    let isSubscribed = true

    async function render() {
      setIsRendering(true)
      const rawCleaned = cleanMermaid(diagram)
      const source = rawCleaned || buildSimpleDefaultDiagram(fileTree, techStack, repoName)

      let renderedSvg = ''
      try {
        const mermaid = (await import('mermaid')).default
        mermaid.initialize({
          startOnLoad: false,
          theme: 'neutral',
          themeVariables: {
            darkMode: false,
            background: 'transparent',
            primaryColor: '#ffffff',
            primaryTextColor: '#0f172a',
            primaryBorderColor: '#ea580c',
            lineColor: '#ea580c',
            secondaryColor: '#fcfbf9',
            tertiaryColor: '#f5f0eb',
            fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
            fontSize: '11px',
          },
          securityLevel: 'loose',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: false,
            curve: 'basis',
            nodeSpacing: 25,
            rankSpacing: 30,
            padding: 10,
          },
        })

        const iterationId = `gitgrok-mermaid-${Math.random().toString(36).slice(2, 7)}`
        const oldEl = document.getElementById(iterationId) || document.getElementById(`d${iterationId}`)
        if (oldEl) oldEl.remove()

        const { svg } = await mermaid.render(iterationId, source)
        if (svg && svg.length > 30) {
          renderedSvg = processSvgString(svg)
        }
      } catch (err) {
        console.warn('Mermaid render error, trying fallback', err)
      }

      if (!renderedSvg) {
        try {
          const mermaid = (await import('mermaid')).default
          const fallbackSource = buildSimpleDefaultDiagram(fileTree, techStack, repoName)
          const iterationId = `gitgrok-mermaid-fb-${Math.random().toString(36).slice(2, 7)}`
          const { svg } = await mermaid.render(iterationId, fallbackSource)
          if (svg) renderedSvg = processSvgString(svg)
        } catch {
          // ignore
        }
      }

      if (isSubscribed) {
        setSvgContent(renderedSvg)
        setIsRendering(false)
      }
    }

    render()

    return () => {
      isSubscribed = false
    }
  }, [diagram, repoName, fileTree?.length, techStack?.length])

  return (
    <div className="surface" style={{ padding: 16, borderRadius: 16 }}>
      <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 9999, background: 'var(--accent)' }} />
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-heading)', letterSpacing: '-0.01em' }}>
              System Architecture Flowchart
            </span>
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            background: 'var(--bg-tertiary, #f5f0eb)',
            padding: '2px 4px',
            borderRadius: 9999,
            border: '1px solid var(--border)',
          }}>
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              title="Zoom Out"
              style={{
                background: 'none',
                border: 'none',
                cursor: zoom <= 0.5 ? 'not-allowed' : 'pointer',
                opacity: zoom <= 0.5 ? 0.4 : 1,
                color: 'var(--text-heading)',
                fontSize: 14,
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: 8,
              }}
            >
              −
            </button>

            <button
              onClick={handleResetZoom}
              title="Reset Zoom"
              style={{
                background: 'var(--glass-bg, #ffffff)',
                border: '1px solid var(--accent-border)',
                color: 'var(--accent)',
                fontSize: 10,
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                padding: '2px 8px',
                borderRadius: 9999,
                cursor: 'pointer',
              }}
            >
              {Math.round(zoom * 100)}%
            </button>

            <button
              onClick={handleZoomIn}
              disabled={zoom >= 2.0}
              title="Zoom In"
              style={{
                background: 'none',
                border: 'none',
                cursor: zoom >= 2.0 ? 'not-allowed' : 'pointer',
                opacity: zoom >= 2.0 ? 0.4 : 1,
                color: 'var(--text-heading)',
                fontSize: 14,
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: 8,
              }}
            >
              +
            </button>
          </div>

          <button
            onClick={handleDownloadPng}
            disabled={isExportingPng}
            title="Download PNG"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: 'var(--accent)',
              border: 'none',
              color: '#ffffff',
              fontSize: 11,
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: 9999,
              cursor: isExportingPng ? 'wait' : 'pointer',
            }}
          >
            {isExportingPng ? 'Exporting...' : 'Download PNG'}
          </button>
        </div>
      </div>

      <div
        style={{
          padding: '16px 12px',
          borderRadius: 14,
          background: 'var(--surface-elevated)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          overflow: 'auto',
          minHeight: 200,
        }}
      >
        {isRendering ? (
          <div style={{ color: 'var(--text-tertiary)', fontSize: 11, fontFamily: 'var(--font-mono)', padding: '16px 0' }}>
            Rendering diagram...
          </div>
        ) : (
          <div
            ref={diagramContainerRef}
            className="mermaid-wrapper"
            dangerouslySetInnerHTML={{ __html: svgContent }}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease',
            }}
          />
        )}
      </div>
    </div>
  )
}
