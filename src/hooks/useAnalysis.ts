import { useState, useCallback, useRef } from 'react'
import type { RepoAnalysis, AnalysisRequest } from '../types'
import { triggerAnalysis } from '../services/n8n'
import { ApiError, ERROR_MESSAGES } from '../services/errors'

interface UseAnalysisReturn {
  analysis: RepoAnalysis | null
  isLoading: boolean
  error: string | null
  submitAnalysis: (req: AnalysisRequest) => Promise<void>
  reset: () => void
}

export function useAnalysis(): UseAnalysisReturn {
  const [analysis, setAnalysis] = useState<RepoAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const requestSeq = useRef(0)

  const submitAnalysis = useCallback(async (req: AnalysisRequest) => {
    const seq = ++requestSeq.current
    setAnalysis(null)
    setIsLoading(true)
    setError(null)
    try {
      const result = await triggerAnalysis(req)
      if (seq !== requestSeq.current) return
      setAnalysis(result)
    } catch (err) {
      if (seq !== requestSeq.current) return
      setError(err instanceof ApiError ? err.message : ERROR_MESSAGES.UPSTREAM_ERROR)
    } finally {
      if (seq === requestSeq.current) setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    requestSeq.current++
    setAnalysis(null)
    setIsLoading(false)
    setError(null)
  }, [])

  return { analysis, isLoading, error, submitAnalysis, reset }
}
