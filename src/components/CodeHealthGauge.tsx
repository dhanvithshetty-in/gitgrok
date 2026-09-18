import { useState, useEffect } from 'react'
import type { RepoAnalysis } from '../types'
import { renderInlineMarkdown } from './SummaryCard'

interface CodeHealthGaugeProps {
  analysis: RepoAnalysis
}

function computeGrade(quality: string, strengthsCount: number): { letter: string; score: number; color: string } {
  const hasExcellent = /excellent|outstanding|exceptional|well[- ]structured|battle[- ]tested|comprehensive|extensive/i.test(quality)
  const hasGood = /good|solid|clean|consistent|mature|robust/i.test(quality)
  const hasFair = /fair|adequate|decent|acceptable|needs improvement/i.test(quality)
  const base = hasExcellent ? 90 : hasGood ? 75 : hasFair ? 60 : 65
  const bonus = Math.min(strengthsCount * 3, 15)
  const score = Math.min(base + bonus, 98)
  const letter = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F'
  const color = score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--error)'
  return { letter, score, color }
}

function toFiniteScore(value: unknown, max: number): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Math.min(max, Math.round(value)))
  }
  if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) {
    return Math.max(0, Math.min(max, Math.round(Number(value))))
  }
  return null
}

const springIn = (delay: number) => ({
  opacity: 0,
  transform: 'translateY(12px) scale(0.95)',
  animation: `springIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s forwards`,
})

export default function CodeHealthGauge({ analysis }: CodeHealthGaugeProps) {
  const [mounted, setMounted] = useState(false)
  const summary = analysis?.summary || {}
  const quality = summary.quality || 'Good codebase structure and maintainability.'
  const strengths = Array.isArray(summary.strengths) ? summary.strengths : []
  const recommendations = Array.isArray(summary.recommendations) ? summary.recommendations : []

  const fallback = computeGrade(quality, strengths.length)

  const rawScore =
    analysis?.summary?.healthScore ??
    analysis?.healthScore ??
    analysis?.summary?.score ??
    analysis?.score ??
    null
  const rawGrade =
    analysis?.summary?.healthGrade ??
    analysis?.healthGrade ??
    analysis?.summary?.grade ??
    analysis?.grade ??
    null

  const healthScore = toFiniteScore(rawScore, 100) ?? fallback.score
  const healthGrade =
    typeof rawGrade === 'string' && /^[A-F]$/i.test(rawGrade.trim())
      ? rawGrade.trim().toUpperCase()
      : fallback.letter
  const color = healthScore >= 80 ? 'var(--success)' : healthScore >= 60 ? 'var(--warning)' : 'var(--error)'

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(t)
  }, [])

  const circumference = 2 * Math.PI * 42
  const offset = circumference - (healthScore / 100) * circumference

  return (
    <div className="surface-elevated" style={{
      padding: 28,
      display: 'flex',
      flexDirection: 'column',
      gap: 28,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 32,
        flexWrap: 'wrap',
      }}>
        <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
          <svg width="120" height="120" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="6" />
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={mounted ? offset : circumference}
              style={{
                transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
              }}
            />
          </svg>
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 36,
              fontWeight: 800,
              color,
              lineHeight: 1,
              letterSpacing: '-0.04em',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'scale(1)' : 'scale(0.5)',
              transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s',
            }}>{healthGrade}</span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--text-tertiary)',
              marginTop: 2,
            }}>{healthScore}%</span>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text-heading)',
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}>Code Health</h3>
          <p style={{
            fontSize: 14,
            color: 'var(--text)',
            lineHeight: 1.7,
            fontFamily: 'var(--font-body)',
            fontWeight: 450,
          }}>{renderInlineMarkdown(quality)}</p>
        </div>
      </div>

      <div style={mounted ? {} : {}}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 14,
        }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: color }} />
          <h4 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--text-heading)',
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
          }}>Strengths</h4>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {strengths.map((s, i) => (
            <span
              key={i}
              style={{
                ...springIn(0.6 + i * 0.08),
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 14px',
                borderRadius: 8,
                fontSize: 13,
                color: 'var(--text-heading)',
                background: 'var(--accent-soft)',
                border: '1px solid var(--accent-border)',
                lineHeight: 1.4,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {renderInlineMarkdown(s)}
            </span>
          ))}
        </div>
      </div>

      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 14,
        }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: 'var(--warning)' }} />
          <h4 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--text-heading)',
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
          }}>Recommendations</h4>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {recommendations.map((r, i) => (
            <div
              key={i}
              style={{
                ...springIn(0.8 + i * 0.1),
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 10,
                background: 'var(--glass-bg)',
                border: '1px solid var(--border)',
              }}
            >
              <span style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 20,
                height: 20,
                borderRadius: 6,
                background: 'rgba(217, 119, 6, 0.1)',
                color: 'var(--warning)',
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                flexShrink: 0,
                marginTop: 1,
              }}>{i + 1}</span>
            <span style={{
              fontSize: 14,
              color: 'var(--text)',
              lineHeight: 1.6,
              fontWeight: 450,
            }}>{renderInlineMarkdown(r)}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes springIn {
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
