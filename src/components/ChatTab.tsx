import { useState, useRef, useEffect } from 'react'
import type { ChatMessage } from '../types'

interface ChatTabProps {
  messages: ChatMessage[]
  isStreaming: boolean
  onSend: (message: string) => void
  onClear: () => void
}

const ChatBubbleIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ color: 'var(--text-tertiary)', opacity: 0.5 }}>
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
)

const SendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12 }}>
      <div style={{
        background: 'var(--code-bg)',
        borderRadius: '14px 14px 14px 4px',
        padding: '12px 16px',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        gap: 4,
        alignItems: 'center',
      }}>
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  )
}

/** Render inline markdown: **bold**, *italic*, `code` */
function renderChatMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n')
  return lines.map((line, li) => {
    const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g)
    const rendered = parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ fontWeight: 700 }}>{part.slice(2, -2)}</strong>
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i}>{part.slice(1, -1)}</em>
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85em', background: 'rgba(0,0,0,0.08)', padding: '1px 4px', borderRadius: 3 }}>{part.slice(1, -1)}</code>
      }
      return part
    })
    return (
      <span key={li}>
        {rendered}
        {li < lines.length - 1 && <br />}
      </span>
    )
  })
}

const SUGGESTED_PROMPTS = [
  'How does the architecture work?',
  'What are the main dependencies?',
  'Are there any code quality issues?',
  'Explain entry points & routing',
]

export default function ChatTab({ messages, isStreaming, onSend, onClear }: ChatTabProps) {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isStreaming) return
    onSend(input.trim())
    setInput('')
  }

  const handlePromptClick = (prompt: string) => {
    if (isStreaming) return
    onSend(prompt)
  }

  return (
    <div className="surface-elevated animate-fade-in-up stagger-6" style={{
      display: 'flex',
      flexDirection: 'column',
      height: 440,
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 3,
            height: 16,
            borderRadius: 2,
            background: 'var(--accent)',
          }} />
          <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-heading)' }}>Ask about this repo</h3>
        </div>
        {messages.length > 0 && (
          <button onClick={onClear} className="chat-clear-btn">
            Clear
          </button>
        )}
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 16,
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: 28, paddingBottom: 16 }}>
            <ChatBubbleIcon />
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-heading)', marginTop: 8, marginBottom: 4 }}>Ask anything about the codebase</p>
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 20 }}>
              Click a suggested question or type your own:
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              maxWidth: 320,
              margin: '0 auto',
            }}>
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePromptClick(prompt)}
                  disabled={isStreaming}
                  style={{
                    background: 'var(--bg-tertiary, #f5f0eb)',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    padding: '8px 12px',
                    fontSize: 12,
                    color: 'var(--text-heading)',
                    fontWeight: 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-border)'
                    e.currentTarget.style.background = 'var(--accent-soft)'
                    e.currentTarget.style.color = 'var(--accent)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.background = 'var(--bg-tertiary, #f5f0eb)'
                    e.currentTarget.style.color = 'var(--text-heading)'
                  }}
                >
                  ✨ {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className="animate-slide-down" style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: 12,
          }}>
            <div style={{
              maxWidth: '80%',
              padding: '10px 14px',
              fontSize: 14,
              lineHeight: 1.65,
              ...(msg.role === 'user'
                ? { background: 'var(--accent)', color: '#fff', borderRadius: '14px 14px 4px 14px' }
                : { background: 'var(--code-bg)', backdropFilter: 'blur(8px)', color: 'var(--text-heading)', borderRadius: '14px 14px 14px 4px', border: '1px solid var(--border-subtle)' }
              ),
            }}>
              <div style={{ whiteSpace: msg.role === 'user' ? 'pre-wrap' : undefined }}>
                {msg.role === 'assistant' ? renderChatMarkdown(msg.content) : msg.content}
              </div>
              {msg.timestamp && (
                <div style={{
                  fontSize: 11,
                  marginTop: 6,
                  opacity: 0.6,
                  fontFamily: 'var(--font-mono)',
                  ...(msg.role === 'user' ? { color: 'rgba(255,255,255,0.6)' } : { color: 'var(--text-secondary)' }),
                }}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
          </div>
        ))}
        {isStreaming && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} style={{
        borderTop: '1px solid var(--border)',
        padding: 12,
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask a question..."
            disabled={isStreaming}
            className="input-field"
            style={{ padding: '9px 12px', fontSize: 13, borderRadius: 10 }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="btn-accent"
            style={{ padding: '9px 16px', flexShrink: 0 }}
          >
            <SendIcon />
          </button>
        </div>
      </form>
    </div>
  )
}
