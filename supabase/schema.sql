-- GitGrok Supabase Database Schema
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Enable pgvector Extension
create extension if not exists vector;

-- 2. Repositories Table
create table if not exists repos (
  id uuid default gen_random_uuid() primary key,
  repo_url text unique not null,
  full_name text not null,
  branch text default 'main',
  analyzed_at timestamptz default now(),
  health_score int,
  health_grade text,
  summary jsonb,
  stats jsonb,
  tech_stack jsonb,
  arch_diagram text,
  file_tree jsonb
);

-- 3. Code Chunks Vector Table
create table if not exists document_chunks (
  id bigserial primary key,
  repo_url text not null,
  full_name text not null,
  file_path text not null,
  chunk_index int not null,
  chunk_text text not null,
  embedding vector(768)
);

-- 4. HNSW Vector Index for High-Speed Cosine Distance Retrieval
create index if not exists idx_document_chunks_embedding_hnsw
on document_chunks using hnsw (embedding vector_cosine_ops);

-- 5. Robust Vector Similarity Search Stored Procedure (RPC)
create or replace function match_documents (
  query_embedding vector(768),
  match_count int default 5,
  filter_repo text default ''
)
returns table (
  id bigint,
  file_path text,
  chunk_text text,
  similarity float
)
language plpgsql
as $$
declare
  clean_filter text;
begin
  clean_filter := regexp_replace(filter_repo, '^https?://(www\.)?github\.com/', '');
  clean_filter := regexp_replace(clean_filter, '/$', '');
  clean_filter := regexp_replace(clean_filter, '\.git$', '');

  return query
  select
    dc.id,
    dc.file_path,
    dc.chunk_text,
    1 - (dc.embedding <=> query_embedding) as similarity
  from document_chunks dc
  where filter_repo = '' 
     or filter_repo is null
     or dc.repo_url = filter_repo 
     or dc.full_name = filter_repo
     or dc.full_name = clean_filter
     or dc.repo_url like '%' || clean_filter || '%'
  order by dc.embedding <=> query_embedding
  limit match_count;
end; $$;
