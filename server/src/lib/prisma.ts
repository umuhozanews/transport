import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { horizonPrisma?: PrismaClient }

function createClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

export function getPrisma(): PrismaClient {
  if (!globalForPrisma.horizonPrisma) {
    globalForPrisma.horizonPrisma = createClient()
  }
  return globalForPrisma.horizonPrisma
}

/** Lazy proxy so Prisma connects only after DATABASE_URL is configured on Vercel. */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrisma() as unknown as Record<string | symbol, unknown>
    const value = client[prop]
    return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(client) : value
  },
})
