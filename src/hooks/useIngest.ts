import { useState, useCallback } from 'react'
import type { AnalysisRequest, IngestResponse } from '../types'
import { triggerIngestion } from '../services/n8n'

interface UseIngestReturn {
  isIngesting: boolean
  ingestResult: IngestResponse | null
  ingestError: string | null
  runIngestion: (req: AnalysisRequest) => Promise<IngestResponse | null>
}

export function useIngest(): UseIngestReturn {
  const [isIngesting, setIsIngesting] = useState(false)
  const [ingestResult, setIngestResult] = useState<IngestResponse | null>(null)
  const [ingestError, setIngestError] = useState<string | null>(null)

  const runIngestion = useCallback(async (req: AnalysisRequest) => {
    setIsIngesting(true)
    setIngestError(null)
    try {
      const res = await triggerIngestion(req)
      const formatted: IngestResponse = {
        type: 'done',
        repoUrl: req.repoUrl,
        indexedFiles: res.indexedFiles || 0,
        chunks: res.chunks || 0
      }
      setIngestResult(formatted)
      return formatted
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Ingestion failed'
      setIngestError(msg)
      return null
    } finally {
      setIsIngesting(false)
    }
  }, [])

  return { isIngesting, ingestResult, ingestError, runIngestion }
}
