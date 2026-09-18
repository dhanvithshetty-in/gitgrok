import { useState, useCallback } from 'react'
import type { ChatMessage, ChatRequest } from '../types'
import { clientChatResponse } from '../services/github'

interface UseChatReturn {
  messages: ChatMessage[]
  isStreaming: boolean
  sendMessage: (payload: ChatRequest) => Promise<void>
  clearMessages: () => void
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)

  const sendMessage = useCallback(async (payload: ChatRequest) => {
    if (isStreaming) return

    const userMsg: ChatMessage = { role: 'user', content: payload.message, timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    setIsStreaming(true)

    try {
      const response = await clientChatResponse(payload)
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
