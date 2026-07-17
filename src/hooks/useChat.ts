import { useState, useCallback } from 'react'
import type { ChatMessage } from '../types'
import { sendChatMessage } from '../services/n8n'

interface UseChatReturn {
  messages: ChatMessage[]
  isStreaming: boolean
  sendMessage: (analysisId: string, content: string, context?: string) => Promise<void>
  clearMessages: () => void
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)

  const sendMessage = useCallback(async (analysisId: string, content: string, context?: string) => {
    if (isStreaming) return

    const userMsg: ChatMessage = { role: 'user', content, timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    setIsStreaming(true)

    try {
      const response = await sendChatMessage({ analysisId, message: content, context })
      setMessages(prev => [...prev, response])
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `Error: ${err instanceof Error ? err.message : 'Chat failed'}`, timestamp: new Date().toISOString() },
      ])
    } finally {
      setIsStreaming(false)
    }
  }, [isStreaming])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return { messages, isStreaming, sendMessage, clearMessages }
}
