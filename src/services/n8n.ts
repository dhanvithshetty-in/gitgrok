import type { AnalysisRequest, RepoAnalysis, ChatRequest, ChatMessage } from '../types'

const N8N_BASE = import.meta.env.VITE_N8N_WEBHOOK_URL || '/webhook'

export async function triggerAnalysis(req: AnalysisRequest): Promise<RepoAnalysis> {
  const res = await fetch(`${N8N_BASE}/gitgrok-analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
  if (!res.ok) throw new Error(`Analysis failed: ${res.statusText}`)
  const data = await res.json()
  // n8n wraps items in { json: {...} } format when respondWith is "allIncomingItems"
  const unwrapped = Array.isArray(data) ? (data[0]?.json || data[0]) : data
  return unwrapped as RepoAnalysis
}

export async function sendChatMessage(req: ChatRequest): Promise<ChatMessage> {
  const res = await fetch(`${N8N_BASE}/gitgrok-chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
  if (!res.ok) throw new Error(`Chat failed: ${res.statusText}`)
  const data = await res.json()
  const unwrapped = Array.isArray(data) ? (data[0]?.json || data[0]) : data
  let content = ''
  if (unwrapped && typeof unwrapped === 'object') {
    const c = unwrapped.reply ?? unwrapped.output ?? unwrapped.text ?? unwrapped.message ?? unwrapped.content ?? unwrapped.response
    content = c === undefined ? '' : String(c)
  } else if (unwrapped != null) {
    content = String(unwrapped)
  }
  if (content.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(content)
      if (parsed && typeof parsed === 'object') {
        content = String(parsed.reply ?? parsed.output ?? parsed.text ?? parsed.message ?? parsed.content ?? content)
      }
    } catch {
      // not valid JSON, keep as-is
    }
  }
  return {
    role: 'assistant',
    content: content || JSON.stringify(data),
    timestamp: new Date().toISOString(),
  }
}
