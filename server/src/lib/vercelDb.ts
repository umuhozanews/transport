import { copyFileSync, existsSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const moduleDir = dirname(fileURLToPath(import.meta.url))

export function setupServerlessDb() {
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME)
  if (!isServerless) return

  const tmpDb = '/tmp/horizon/dev.db'

  if (!existsSync(tmpDb)) {
    mkdirSync(dirname(tmpDb), { recursive: true })

    const candidates = [
      join(process.cwd(), 'server/prisma/dev.db'),
      join(process.cwd(), 'prisma/dev.db'),
      join(moduleDir, '../../prisma/dev.db'),
      '/var/task/server/prisma/dev.db',
    ]

    const source = candidates.find(p => existsSync(p))
    if (!source) {
      console.error('SQLite database not found. Checked:', candidates)
      return
    }

    copyFileSync(source, tmpDb)
    console.log('Copied SQLite DB from', source, 'to', tmpDb)
  }

  process.env.DATABASE_URL = `file:${tmpDb}`
}
