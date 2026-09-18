import { useState, useCallback, useRef } from 'react'
import type { RepoAnalysis, AnalysisRequest } from '../types'
import { analyzeRepoFromGitHub } from '../services/github'
import { ApiError, ERROR_MESSAGES } from '../services/errors'

interface UseAnalysisReturn {
  analysis: RepoAnalysis | null
  isLoading: boolean
  error: string | null
  submitAnalysis: (req: AnalysisRequest) => Promise<RepoAnalysis | null>
  setAnalysis: (analysis: RepoAnalysis | null) => void
  reset: () => void
}

export function useAnalysis(): UseAnalysisReturn {
  const [analysis, setAnalysis] = useState<RepoAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const requestSeq = useRef(0)

  const submitAnalysis = useCallback(async (req: AnalysisRequest): Promise<RepoAnalysis | null> => {
    const seq = ++requestSeq.current
    setAnalysis(null)
    setIsLoading(true)
    setError(null)
    try {
      const result = await analyzeRepoFromGitHub(req)
      if (seq !== requestSeq.current) return null
      setAnalysis(result)
      return result
    } catch (err) {
      if (seq !== requestSeq.current) return null
      setError(err instanceof ApiError ? err.message : ERROR_MESSAGES.UPSTREAM_ERROR)
      return null
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

  return { analysis, isLoading, error, submitAnalysis, setAnalysis, reset }
}
