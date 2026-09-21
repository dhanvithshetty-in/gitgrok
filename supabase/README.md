# Supabase Setup Guide for GitGrok

This directory contains the database schema and vector search configuration required to power GitGrok's analysis, ingestion, and RAG chat.

---

## Step-by-Step Provisioning Guide

### Step 1: Access Supabase SQL Editor
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project (or create a new project).
3. Navigate to **SQL Editor** from the left navigation menu.

### Step 2: Execute Schema & Vector Search Procedure
1. Click **New Query**.
2. Copy the entire contents of [`schema.sql`](./schema.sql).
3. Paste into the SQL query runner and click **Run**.
4. Confirm that all statements execute successfully:
   - `pgvector` extension enabled.
   - `repos` table created.
   - `document_chunks` table created.
   - HNSW vector index `idx_document_chunks_embedding_hnsw` created.
   - `match_documents` RPC procedure created.

### Step 3: Configure n8n Webhook Credentials
In your n8n workflow credentials manager:
1. Create or edit an **HTTP Header Auth** credential named `supabase-api`.
2. Set Header Name: `apikey`.
3. Set Header Value: Your Supabase project's `anon` public key (found under Project Settings $\rightarrow$ API).

---

## Table Structure Overview

| Table | Purpose | Key Columns |
| :--- | :--- | :--- |
| `repos` | Caches high-level repository analysis metadata & diagrams | `repo_url` (unique), `health_score`, `summary` (jsonb), `arch_diagram` |
| `document_chunks` | Stores 768-dim vector embeddings for RAG code retrieval | `repo_url`, `file_path`, `chunk_text`, `embedding` (`vector(768)`) |

---

## RPC Function Reference

```sql
match_documents(
  query_embedding vector(768),
  match_count int,
  filter_repo text
)
```
Executes cosine distance calculation (`1 - (embedding <=> query_embedding)`) against `document_chunks`, filtered by target repository URL or name.
