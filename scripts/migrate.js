#!/usr/bin/env node
// Run DB migrations: node scripts/migrate.js
// Requires DATABASE_URL to be set in environment.

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

  console.log('Running migrations...')
  await sql(schema)
  console.log('Migration complete.')
}

main().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
