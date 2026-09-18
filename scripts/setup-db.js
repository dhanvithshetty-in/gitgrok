import fs from 'fs'
import path from 'path'
import pg from 'pg'

let inputUrl = process.argv[2] || process.env.DATABASE_URL || ''

if (!inputUrl) {
  console.error('\x1b[31mError: Missing database connection URL.\x1b[0m')
  console.log('\nUsage:')
  console.log('  \x1b[36mnpm run db:setup "postgresql://postgres.mkepimgmsatrifnxwana:YOUR_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"\x1b[0m\n')
  process.exit(1)
}

// Remove surrounding quotes or brackets if pasted with them
inputUrl = inputUrl.trim().replace(/^["']|["']$/g, '')

async function run() {
  console.log('Connecting to Supabase PostgreSQL database...')
  
  let clientConfig

  try {
    const parsed = new URL(inputUrl)
    clientConfig = {
      host: parsed.hostname,
      port: parsed.port ? parseInt(parsed.port, 10) : 5432,
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database: parsed.pathname ? parsed.pathname.replace(/^\//, '') : 'postgres',
      ssl: { rejectUnauthorized: false }
    }
  } catch {
    clientConfig = {
      connectionString: inputUrl,
      ssl: { rejectUnauthorized: false }
    }
  }

  const client = new pg.Client(clientConfig)

  try {
    await client.connect()
    console.log('Connected! Reading schema.sql...')
    const sqlPath = path.resolve('supabase/schema.sql')
    const sql = fs.readFileSync(sqlPath, 'utf-8')
    console.log('Executing schema provisioning script...')
    await client.query(sql)
    console.log('\n\x1b[32m✓ SUCCESS! Supabase database tables, pgvector extension, HNSW index, and RPC functions provisioned successfully!\x1b[0m\n')
  } catch (err) {
    console.error('\n\x1b[31mError provisioning database:\x1b[0m', err.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

run()
