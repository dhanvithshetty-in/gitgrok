import type { AnalysisRequest, RepoAnalysis, ChatRequest, ChatMessage } from '../types'

const N8N_BASE = import.meta.env.VITE_N8N_WEBHOOK_URL || '/webhook'

export async function triggerAnalysis(req: AnalysisRequest): Promise<RepoAnalysis> {
  const res = await fetch(`${N8N_BASE}/gitgrok-analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
  if (!res.ok) throw new Error(`Analysis failed: ${res.statusText}`)
  return res.json()
}

export async function sendChatMessage(req: ChatRequest): Promise<ChatMessage> {
  const res = await fetch(`${N8N_BASE}/gitgrok-chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
  if (!res.ok) throw new Error(`Chat failed: ${res.statusText}`)
  const data = await res.json()
  return {
    role: 'assistant',
    content: data.content || data.output || data.text || data.message || data.response || JSON.stringify(data),
    timestamp: new Date().toISOString(),
  }
}
