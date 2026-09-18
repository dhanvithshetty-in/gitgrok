# GitGrok — AI-Powered GitHub Repository Analyzer

Paste any GitHub URL. GitGrok returns a complete engineering overview of the repo: **stats, tech stack, file tree, an auto-generated architecture diagram, a code-health grade, and an AI chat assistant** that answers questions about the codebase — all grounded in the real repo data, no hallucinated stacks.

🔗 **Live app:** https://dhanvith-n8n-frontend.slicearrow.com
🐙 **This repo:** https://github.com/dhanvithshetty-in/gitgrok

## Features

- **Repo stats** — stars, forks, open issues, license, contributors, last commit (live GitHub API)
- **Tech stack detection** — derived strictly from the file-extension breakdown; the LLM is never allowed to invent a stack
- **File tree** — full recursive repository structure
- **Architecture diagram** — auto-generated Mermaid flowchart grounded in the real layout + README + `package.json`
- **Summary** — purpose, architecture, code quality, strengths, and recommendations
- **Code health gauge** — letter grade (A–F) and score (0–100) from backend AI metrics
- **AI chat assistant** — context-aware Q&A about the repo, grounded in the analysis result

## How it works

```
User → React frontend → n8n webhooks
                          ├── /gitgrok-analyze → GitHub API (metadata, tree, README, package.json)
                          │                     → Groq LLM → structured JSON → dashboard
                          └── /gitgrok-chat    → chat prompt (analysis context) → Groq → reply
```

## Tech stack

| Layer        | Technology                                                    |
|--------------|---------------------------------------------------------------|
| Frontend     | React 19 + TypeScript + Vite                                  |
| Styling      | Tailwind CSS                                                   |
| Diagrams     | Mermaid (`mermaid` + `@types/mermaid`)                         |
| Backend      | n8n workflows (webhooks)                                       |
| AI / LLM     | Groq — `llama-3.3-70b-versatile`                               |
| GitHub       | GitHub REST API (metadata, tree, README, `package.json`)       |

## Quick start

```bash
npm install
```

Create a `.env` file:

```env
# Base n8n webhook URL (public webhooks exposed by the backend instance)
VITE_N8N_WEBHOOK_URL=https://n8n-csr-interns.slicearrow.com/webhook
```

Run the dev server:

```bash
npm run dev
```

Open the app, paste any GitHub URL, and let GitGrok do the homework.

## Project structure

```
gitgrok/
├── src/
│   ├── components/          # UI: RepoInput, AnalysisDashboard, MermaidRenderer,
│   │                        #      CodeHealthGauge, FileTree, StatsGrid, ChatTab, ...
│   ├── hooks/               # useAnalysis, useChat (state + response handling)
│   ├── services/n8n.ts      # API layer: triggerAnalysis, sendChatMessage
│   ├── types/index.ts       # RepoAnalysis, RepoStats, TechStack, FileNode, ...
│   ├── App.tsx
│   └── main.tsx
├── n8n-workflows/           # Backend workflow definitions (importable into n8n)
│   ├── gitgrok-analyze.json # analyze: GitHub API → LLM → structured JSON
│   ├── gitgrok-chat.json    # chat: analysis context → LLM → reply
│   └── prompts/             # LLM system prompts (analyze + chat)
└── public/
```

## Backend workflows

The two n8n workflow JSON files under `n8n-workflows/` define the entire backend — no custom server code needed:

- **`gitgrok-analyze.json`** — fetches GitHub metadata + tree + README + `package.json`, computes the extension breakdown, sends everything to Groq with a strict JSON-output prompt, and returns the structured analysis.
- **`gitgrok-chat.json`** — takes the user question plus the analysis context and returns a concise, file-referencing answer.

Prompts are kept in `n8n-workflows/prompts/` and are referenced from the workflows.

## Verified

- `npx tsc --noEmit` — clean
- `npm run lint` — no new warnings
- `npm run build` — passes
- Live webhook tests — `analyze` returns valid structured JSON; `chat` returns clean replies
