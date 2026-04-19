#!/usr/bin/env node
// Run DB migrations: node scripts/migrate.js
// Requires DATABASE_URL to be set in environment.
// Uses the Neon HTTP driver with individual statement execution.

const { neon } = require('@neondatabase/serverless')
const { readFileSync } = require('fs')
const { join } = require('path')

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error('ERROR: DATABASE_URL is not set')
    process.exit(1)
  }

  const sql = neon(url)
  const schema = readFileSync(join(__dirname, '../lib/db/schema.sql'), 'utf8')

  // Split into individual statements (Neon HTTP driver requires one statement per call).
  // Strip comment lines from each chunk before filtering blanks.
  const statements = schema
    .split(';')
    .map(s =>
      s
        .split('\n')
        .filter(line => !line.trimStart().startsWith('--'))
        .join('\n')
        .trim()
    )
    .filter(s => s.length > 0)

  console.log(`Running migrations... (${statements.length} statements)`)
  for (const stmt of statements) {
    await sql.query(stmt)
  }
  console.log('Migration complete.')
}

main().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
