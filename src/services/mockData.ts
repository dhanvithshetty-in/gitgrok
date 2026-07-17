import type { RepoAnalysis } from '../types'

const DEMO_REPO = 'https://github.com/facebook/react'

export const mockAnalysis: RepoAnalysis = {
  id: 'demo-001',
  repoUrl: DEMO_REPO,
  branch: 'main',
  analyzedAt: new Date().toISOString(),
  summary: {
    purpose: 'React is a JavaScript library for building user interfaces, primarily single-page applications with a component-based architecture using a virtual DOM.',
    architecture: 'Follows a unidirectional data flow pattern with a virtual DOM diffing engine at its core. Uses a fiber reconciler for async rendering, with React DOM as the web renderer and React Native for mobile. The package is monorepo-structured with packages like react, react-dom, react-reconciler, and scheduler.',
    quality: 'Well-structured monorepo with extensive test coverage, consistent coding standards, TypeScript migration in progress, and clear separation of concerns across packages.',
    strengths: [
      'Battle-tested virtual DOM implementation with fiber architecture',
      'Extensive ecosystem and backwards compatibility commitment',
      'Comprehensive test suite with automated CI/CD',
      'Well-documented public API with codemods for migrations',
      'Performance-focused with concurrent mode and automatic batching',
    ],
    recommendations: [
      'Continue TypeScript migration across all packages',
      'Reduce bundle size by tree-shaking legacy APIs',
      'Improve error messages with actionable debugging hints',
    ],
  },
  techStack: [
    { name: 'JavaScript', category: 'language', icon: '🟨', percentage: 65 },
    { name: 'TypeScript', category: 'language', icon: '🔷', percentage: 20 },
    { name: 'Flow', category: 'language', icon: '🔵', percentage: 10 },
    { name: 'React', category: 'framework', icon: '⚛️', percentage: 100 },
    { name: 'Jest', category: 'tool', icon: '🧪', percentage: 80 },
    { name: 'Rollup', category: 'tool', icon: '📦', percentage: 60 },
    { name: 'ESLint', category: 'tool', icon: '🔍', percentage: 90 },
  ],
  fileTree: [
    {
      name: 'packages', path: 'packages', type: 'dir', children: [
        {
          name: 'react', path: 'packages/react', type: 'dir', children: [
            { name: 'index.js', path: 'packages/react/index.js', type: 'file', language: 'javascript', size: 2048 },
            { name: 'src', path: 'packages/react/src', type: 'dir', children: [
              { name: 'React.js', path: 'packages/react/src/React.js', type: 'file', language: 'javascript', size: 4096 },
              { name: 'ReactHooks.js', path: 'packages/react/src/ReactHooks.js', type: 'file', language: 'javascript', size: 8192 },
            ]},
          ],
        },
        {
          name: 'react-dom', path: 'packages/react-dom', type: 'dir', children: [
            { name: 'index.js', path: 'packages/react-dom/index.js', type: 'file', language: 'javascript', size: 1024 },
            { name: 'src', path: 'packages/react-dom/src', type: 'dir', children: [
              { name: 'client', path: 'packages/react-dom/src/client', type: 'dir', children: [
                { name: 'ReactDOM.js', path: 'packages/react-dom/src/client/ReactDOM.js', type: 'file', language: 'javascript', size: 16384 },
              ]},
            ]},
          ],
        },
        {
          name: 'react-reconciler', path: 'packages/react-reconciler', type: 'dir', children: [
            { name: 'src', path: 'packages/react-reconciler/src', type: 'dir', children: [
              { name: 'ReactFiber.js', path: 'packages/react-reconciler/src/ReactFiber.js', type: 'file', language: 'javascript', size: 32768 },
              { name: 'ReactFiberWorkLoop.js', path: 'packages/react-reconciler/src/ReactFiberWorkLoop.js', type: 'file', language: 'javascript', size: 24576 },
            ]},
          ],
        },
        {
          name: 'scheduler', path: 'packages/scheduler', type: 'dir', children: [
            { name: 'index.js', path: 'packages/scheduler/index.js', type: 'file', language: 'javascript', size: 512 },
          ],
        },
      ],
    },
    {
      name: 'scripts', path: 'scripts', type: 'dir', children: [
        { name: 'rollup', path: 'scripts/rollup', type: 'dir', children: [
          { name: 'build.js', path: 'scripts/rollup/build.js', type: 'file', language: 'javascript', size: 12288 },
        ]},
      ],
    },
    {
      name: 'fixtures', path: 'fixtures', type: 'dir', children: [
        { name: 'packaging', path: 'fixtures/packaging', type: 'dir', children: [
          { name: 'build-teardown.js', path: 'fixtures/packaging/build-teardown.js', type: 'file', language: 'javascript', size: 2048 },
        ]},
      ],
    },
    { name: 'package.json', path: 'package.json', type: 'file', language: 'json', size: 4096 },
    { name: 'README.md', path: 'README.md', type: 'file', language: 'markdown', size: 8192 },
    { name: '.eslintrc.js', path: '.eslintrc.js', type: 'file', language: 'javascript', size: 1024 },
    { name: 'tsconfig.json', path: 'tsconfig.json', type: 'file', language: 'json', size: 1536 },
  ],
  archDiagram: `graph TD
    A[React Public API] --> B[React Reconciler]
    A --> C[React DOM / Native]
    B --> D[Fiber Architecture]
    D --> E[Work Loop]
    E --> F[Begin Work]
    E --> G[Complete Work]
    F --> H[Diff / Reconciliation]
    G --> I[Commit Phase]
    I --> C
    C --> J[DOM Updates]
    subgraph "Scheduling"
      K[Scheduler] --> E
    end
    subgraph "State Management"
      L[Hooks / State] --> D
    end`,
  stats: {
    stars: 234000,
    forks: 48000,
    openIssues: 850,
    license: 'MIT',
    contributors: 1800,
    lastCommit: '2026-07-10T12:00:00Z',
  },
}

export function isDemoMode(): boolean {
  return !import.meta.env.VITE_N8N_WEBHOOK_URL || import.meta.env.VITE_N8N_WEBHOOK_URL === 'http://localhost:5678/webhook'
}
