# GitGrok — Complete-The-Project Spec (for Antigravity)

## PROMPT TO PASTE INTO ANTIGRAVITY

> **IMPORTANT — READ FIRST:** You MUST go through the ENTIRE spec document below in this file, line by line, BEFORE writing or changing any code. This file is the single source of truth. Follow it end-to-end: Supabase (Part 1), n8n workflows (Part 2), frontend (Part 3), verification (Part 4). Do not skip sections, do not improvise, do not rebuild from scratch — fix existing files and build on top of the "Already done" checkpoint (commit `d1768baa`). Re-read the spec after completing each part to confirm nothing was missed.
>
> ---
>
> **Task:** Finish the GitGrok project per the full spec below. Repo `C:\dhanvithshetty\gitgrok`, branch `DhanvithShetty`. Frontend = React 19 + TS + Vite + Tailwind v4, inline SVG icons only (NO lucide). Backend = 3 n8n webhook workflows in `n8n-workflows/` (analyze, chat, ingest) against shared remote n8n `https://n8n-csr-interns.slicearrow.com/webhook/*`. Do NOT touch design/colors/icons.
>
> ---
>
> (Continue by executing Parts 1–4 exactly as specified below.)

> **Context you MUST know before writing code:**
> Repo: `C:\dhanvithshetty\gitgrok` (branch `DhanvithShetty`). Frontend = React 19 + TypeScript + Vite + Tailwind v4, inline SVG icons (NO lucide — do not add it). Backend = 3 n8n webhook workflows in `n8n-workflows/` (analyze, chat, ingest). Everything talks to a shared remote n8n at `https://n8n-csr-interns.slicearrow.com/webhook/*`; frontend deploys to `dhanvith-n8n-frontend.slicearrow.com`. **Fix existing files — do NOT rebuild from scratch.**
>
> **Known state (you're fixing this):** analyze+ingest webhooks currently return 404 "not registered"; only chat is active. All workflows hardcode `YOUR-SUPABASE-URL.supabase.co`. Frontend never calls ingest. `App.tsx` history click is a no-op stub.
>
> **Already done (commit `d1768baa`) — do NOT redo these, build ON TOP of them:**
> - `gitgrok-analyze.json`: AI Agent (Groq) node wired via `ai_languageModel` → Groq Chat Model (`qwen/qwen3.8-27b`, temp 0.2); repos save is a real upsert (`/rest/v1/repos?on_conflict=repo_url&select=id` + `Prefer: return=representation,resolution=merge-duplicates`); emoji tech-stack icons.
> - `src/services/n8n.ts`: `triggerIngestion()` added → POST `/gitgrok-ingest`.
> - `src/hooks/useAnalysis.ts`: fires `triggerIngestion()` in parallel with `triggerAnalysis()` (ingestion errors swallowed).

## Part 1 — Supabase (new files: `supabase/schema.sql`, `supabase/README.md`)

Create the schema (Postgres + pgvector):

- `repos` table: id uuid pk default gen_random_uuid, repo_url text unique, full_name text, branch text, analyzed_at timestamptz default now(), health_score int, health_grade text, summary jsonb, stats jsonb, tech_stack jsonb, arch_diagram text, file_tree jsonb
- `document_chunks`: id bigserial pk, repo_url text, full_name text, file_path text, chunk_index int, chunk_text text, embedding vector(768)
- `match_documents(query_embedding vector(768), match_count int default 5, filter_repo text default '')` plpgsql RPC → returns id, file_path, chunk_text, similarity (`1 - (embedding <=> query_embedding)`)
- HNSW index: `CREATE INDEX ... ON document_chunks USING hnsw (embedding vector_cosine_ops)`
- README: step-by-step Supabase project setup + dashboard instructions for the human.

## Part 2 — n8n workflows (rewrite the 3 JSONs, import-safe)

Normalize BEFORE finishing: every `connections` block must be array-of-arrays (`"main": [ [ {...} ] ]`), node names ASCII, no unicode escapes in names.

- **`gitgrok-analyze.json`** (keep topology: Webhook → Parse URL1 → Check URL → parallel [Meta → Sanitize→Check→Merge] + [Tree→Merge] → Merge → Build Prompt1 → AI Agent (Groq) → Parse AI Response1 → Save to Supabase → Attach ID → Respond):
  - LLM stage: `AI Agent (Groq)` with `Groq Chat Model = qwen/qwen3.8-27b`, wired `ai_languageModel`.
  - Prompt: strict raw-JSON output, Mermaid `graph TD` grounded in real top-level dirs, ban generic nodes.
  - Replace `YOUR-SUPABASE-URL` → configured URL. Repos save becomes a real **upsert** (`Prefer: resolution=merge-duplicates` or `on_conflict=repo_url`).
  - Keep deterministic healthScore/grade fallback when LLM JSON is malformed. Keep typed error branches (`INVALID_URL`, `REPO_NOT_FOUND`, `RATE_LIMITED`).

- **`gitgrok-ingest.json`** (Webhook → Parse URL → Delete Old Chunks → [Meta, Tree] → Select Source Files (top-25, ≤300KB, exclude node_modules/dist/tests) → File Content → Chunk File (3200 chars, 300 overlap, cap 12000) → Embed Chunk (`nomic-embed-text-v1.5`) → Zip Rows → Insert Chunks → Build Response → Respond):
  - Replace `YOUR-SUPABASE-URL`. Return `{type:'done', repoUrl, indexedFiles, chunks, error?}`.

- **`gitgrok-chat.json`** (Webhook → Build Chat Prompt → Embed Question → Match Chunks → Build RAG Prompt → AI Agent (Groq) → Format Response → Respond):
  - Add **multi-turn memory**: keep last ~6 messages, append to prompt. Keep `qwen/qwen3.8-27b`.
  - If `match_documents` returns nothing → "not indexed yet" guidance. Return `{type:'done', content, citedFiles}` (keep existing unwrap chain the frontend expects: reply/output/text/message/content).

## Part 3 — Frontend fixes (`src/`)

- `services/n8n.ts`: add `triggerIngest(req)` calling `/gitgrok-ingest`; keep `postJson`/`unwrap`/`extractApiError` patterns.
- New `hooks/useIngest.ts` (or fold into `useAnalysis`): call ingest right after a successful analyze; expose indexing status.
- `App.tsx`: implement `handleSelectHistory` — store full `RepoAnalysis` in localStorage history (not just summary) and render cached analysis on click; keep existing silent-catch guards.
- `types/index.ts`: add `AnalysisResponse`-style ingest types; remove or wire dead `ChatChunk` (only if you convert chat to SSE — otherwise delete).
- Do not touch design/colors/icons.

## Part 4 — Verification (MUST all pass)

1. `npx tsc --noEmit`
2. `npm run lint`
3. `npm run build`

Then the human imports all 3 workflows into `n8n-csr-interns.slicearrow.com`, creates the Supabase tables/RPC with the SQL, sets credentials (`supabase-api` httpHeaderAuth, GitHub PAT, Groq), activates all 3 production webhooks, and proves: analyze a real repo → row in supabase `repos` → ingest indexed chunks → chat returns code-grounded answer + `citedFiles`.

## Final reminder (read before returning work)

You MUST have gone through and implemented every item in Parts 1–4 above. Before finishing, re-read this entire file from the top and confirm with a checklist: Supabase schema + README written, all `YOUR-SUPABASE-URL` placeholders replaced, ingest returns `{type:'done',...}`, chat has multi-turn memory + not-indexed fallback, `useIngest` added and wired, `handleSelectHistory` no longer a no-op, dead `ChatChunk`/`AnalysisResponse` types removed, `tsc`/`lint`/`build` pass, and a PROOF.md exists. If anything is unchecked, complete it now.