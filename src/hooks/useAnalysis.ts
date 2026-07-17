import { useState, useCallback } from 'react'
import type { RepoAnalysis, AnalysisRequest } from '../types'
import { triggerAnalysis } from '../services/n8n'

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

  const submitAnalysis = useCallback(async (req: AnalysisRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await triggerAnalysis(req)
      setAnalysis(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setAnalysis(null)
    setIsLoading(false)
    setError(null)
  }, [])

  return { analysis, isLoading, error, submitAnalysis, reset }
}
