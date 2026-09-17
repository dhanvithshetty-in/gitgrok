import type { AnalysisRequest, RepoAnalysis, ChatRequest, ChatMessage } from '../types'
import { ApiError, ERROR_MESSAGES, type ErrorCode } from './errors'

const N8N_BASE = import.meta.env.VITE_N8N_WEBHOOK_URL || '/webhook'
const REQUEST_TIMEOUT_MS = 120000

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  let res: Response
  try {
    res = await fetch(`${N8N_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('TIMEOUT')
    }
    throw new ApiError('UPSTREAM_ERROR')
  } finally {
    clearTimeout(timer)
  }

  if (!res.ok) throw new ApiError('UPSTREAM_ERROR', `Request failed: ${res.statusText}`)

  const data = await res.json()
  const error = extractApiError(data)
  if (error) throw error
  return data as T
}

function unwrap(data: unknown): unknown {
  return Array.isArray(data) ? (data[0]?.json || data[0]) : data
}

function extractApiError(data: unknown): ApiError | null {
  const unwrapped = unwrap(data)
  if (!unwrapped || typeof unwrapped !== 'object') return null

  const maybe = unwrapped as {
    error?: { code?: string; message?: string } | string
    code?: string
  }

  if (typeof maybe.error === 'string') {
    return new ApiError('UPSTREAM_ERROR', maybe.error)
  }
  if (maybe.error && typeof maybe.error === 'object') {
    const code = maybe.error.code as ErrorCode
    if (code && code in ERROR_MESSAGES) {
      return new ApiError(code, maybe.error.message)
    }
    return new ApiError('UPSTREAM_ERROR', maybe.error.message)
  }
  const rootCode = maybe.code as ErrorCode
  if (rootCode && rootCode in ERROR_MESSAGES) return new ApiError(rootCode)
  return null
}

export async function triggerAnalysis(req: AnalysisRequest): Promise<RepoAnalysis> {
  const data = await postJson<unknown>('/gitgrok-analyze', req)
  return unwrap(data) as RepoAnalysis
}

export async function triggerIngestion(req: AnalysisRequest): Promise<{ indexedFiles: number; chunks: number }> {
  const data = await postJson<unknown>('/gitgrok-ingest', req)
  return unwrap(data) as { indexedFiles: number; chunks: number }
}

export async function sendChatMessage(req: ChatRequest): Promise<ChatMessage> {
  const data = await postJson<unknown>('/gitgrok-chat', req)
  const unwrapped = unwrap(data) as
    | { reply?: unknown; output?: unknown; text?: unknown; message?: unknown; content?: unknown; response?: unknown; citedFiles?: string[] }
    | null

  let content = ''
  let citedFiles: string[] | undefined

  if (unwrapped && typeof unwrapped === 'object') {
    const c =
      unwrapped.reply ??
      unwrapped.output ??
      unwrapped.text ??
      unwrapped.message ??
      unwrapped.content ??
      unwrapped.response
    content = c === undefined ? '' : String(c)
    if (Array.isArray(unwrapped.citedFiles)) citedFiles = unwrapped.citedFiles.slice(0, 5)
  } else if (unwrapped !== null && unwrapped !== undefined) {
    content = String(unwrapped)
  }

  if (content.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(content)
      if (parsed && typeof parsed === 'object') {
        content = String(
          parsed.reply ?? parsed.output ?? parsed.text ?? parsed.message ?? parsed.content ?? content,
        )
      }
    } catch {
      // not valid JSON, keep as-is
    }
  }

  return {
    role: 'assistant',
    content: content || JSON.stringify(data),
    timestamp: new Date().toISOString(),
    citedFiles,
  }
}