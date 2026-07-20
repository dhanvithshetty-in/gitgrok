import type { AnalysisRequest, RepoAnalysis, ChatRequest, ChatMessage } from '../types'
import { isDemoMode } from './mockData'

const N8N_BASE = import.meta.env.VITE_N8N_WEBHOOK_URL || '/webhook'

const mockResponses: Record<string, string> = {
  architecture: 'React uses a unidirectional data flow with a virtual DOM. The key components are:\n\n1. **React Reconciler** — The core diffing engine (Fiber architecture)\n2. **React DOM** — Web renderer that mounts components to the browser DOM\n3. **Scheduler** — Coordinates work priorities for smooth rendering\n\nThe flow: Public API → Reconciler (Fiber) → Renderer (DOM) → Browser paints.',
  testing: 'React uses **Jest** as its test runner with custom matchers via `@testing-library/react`. Key patterns:\n\n- Unit tests for individual components and hooks\n- Snapshot tests for UI consistency\n- E2E tests for critical user flows\n\nRun tests with `yarn test` — the test suite has thousands of tests running in CI/CD.',
  features: 'Key features of React:\n\n• **Component-based** architecture for reusable UI\n• **Virtual DOM** for efficient rendering\n• **Hooks** (useState, useEffect, useContext) for state management\n• **Concurrent Mode** for interruptible rendering\n• **Server Components** for reduced bundle size\n• Extensive **TypeScript support** (migration in progress)',
}

const mockChat = async (message: string): Promise<string> => {
  const lower = message.toLowerCase()
  if (lower.includes('architecture') || lower.includes('how does it work') || lower.includes('structure')) {
    return mockResponses.architecture
  }
  if (lower.includes('test') || lower.includes('jest') || lower.includes('coverage')) {
    return mockResponses.testing
  }
  if (lower.includes('feature') || lower.includes('what can') || lower.includes('key')) {
    return mockResponses.features
  }
  await new Promise(r => setTimeout(r, 800))
  return `Based on the analysis of this repository, I can help you understand its architecture, tech stack, and design patterns. Could you be more specific about what you'd like to know?\n\nTry asking about:\n- **Architecture** (how the code is structured)\n- **Testing** (test frameworks and coverage)\n- **Features** (key capabilities)`
}

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
  const isDemo = isDemoMode()
  if (isDemo) {
    const content = await mockChat(req.message)
    return { role: 'assistant', content, timestamp: new Date().toISOString() }
  }
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
