export type ErrorCode =
  | 'INVALID_URL'
  | 'REPO_NOT_FOUND'
  | 'RATE_LIMITED'
  | 'UPSTREAM_ERROR'
  | 'NOT_INDEXED'
  | 'TIMEOUT'

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  INVALID_URL:
    'Please enter a valid public GitHub repository URL (e.g. https://github.com/facebook/react).',
  REPO_NOT_FOUND:
    'Repository not found. Check the URL — the repo may not exist or may be private.',
  RATE_LIMITED:
    'GitHub API rate limit reached. Wait about a minute, then try again.',
  UPSTREAM_ERROR:
    'The analysis service hit an unexpected error. Please try again.',
  NOT_INDEXED:
    "This repository's code hasn't been indexed yet. Run a fresh analysis and wait a few seconds, then ask again.",
  TIMEOUT: 'The request timed out. Please try again.',
}

export const GITHUB_URL_PATTERN =
  /^https?:\/\/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)(\/.*)?$/

export function isGithubUrl(value: string): boolean {
  return GITHUB_URL_PATTERN.test(value.trim())
}

export class ApiError extends Error {
  code: ErrorCode

  constructor(code: ErrorCode, message?: string) {
    super(message || ERROR_MESSAGES[code])
    this.name = 'ApiError'
    this.code = code
  }
}