import { copyFileSync, existsSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'

export function setupServerlessDb() {
  if (!process.env.VERCEL) return

  const tmpDb = '/tmp/horizon/dev.db'
  if (existsSync(tmpDb)) {
    process.env.DATABASE_URL = `file:${tmpDb}`
    return
  }

  mkdirSync(dirname(tmpDb), { recursive: true })

  const candidates = [
    join(process.cwd(), 'server/prisma/dev.db'),
    join(process.cwd(), 'prisma/dev.db'),
  ]

  const source = candidates.find(p => existsSync(p))
  if (source) {
    copyFileSync(source, tmpDb)
    process.env.DATABASE_URL = `file:${tmpDb}`
  }
}
