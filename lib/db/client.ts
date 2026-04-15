import { neon } from '@neondatabase/serverless'

let _db: ReturnType<typeof neon> | null = null

function getDb() {
  if (!_db) {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error('DATABASE_URL is not set')
    _db = neon(url)
  }
  return _db
}

// Lazily-initialized tagged template proxy — safe to import at module level.
// Return type is Record<string, unknown>[] which all callers cast anyway.
export const sql = (
  strings: TemplateStringsArray,
  ...values: unknown[]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any[]> =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (getDb() as any)(strings, ...values) as Promise<any[]>
