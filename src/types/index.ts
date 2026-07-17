export interface RepoAnalysis {
  id: string
  repoUrl: string
  branch: string
  summary: RepoSummary
  techStack: TechStack[]
  fileTree: FileNode[]
  archDiagram: string
  stats: RepoStats
  analyzedAt: string
}

export interface RepoSummary {
  purpose: string
  architecture: string
  quality: string
  strengths: string[]
  recommendations: string[]
}

export interface TechStack {
  name: string
  category: 'language' | 'framework' | 'tool' | 'database'
  icon: string
  percentage: number
}

export interface FileNode {
  name: string
  path: string
  type: 'file' | 'dir'
  size?: number
  language?: string
  children?: FileNode[]
}

export interface RepoStats {
  stars: number
  forks: number
  openIssues: number
  license: string
  contributors: number
  lastCommit: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface AnalysisRequest {
  repoUrl: string
  branch?: string
}

export interface AnalysisResponse {
  analysisId: string
  status: 'pending' | 'processing' | 'completed' | 'error'
}

export interface ChatRequest {
  analysisId: string
  message: string
  context?: string
}

export interface ChatChunk {
  type: 'token' | 'done' | 'error'
  content: string
}
