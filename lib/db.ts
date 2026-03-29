/**
 * Welko — Prisma client (Prisma 7 + pg driver adapter)
 *
 * Uses a Proxy for lazy initialization so `next build` does not fail
 * when DATABASE_URL is absent — the real PrismaClient is created only
 * on the first actual method call at request time.
 */

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

function makeClient(): PrismaClient {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('[Welko] DATABASE_URL is not set. Add it to .env.local')
  const adapter = new PrismaPg({ connectionString: url })
  return new PrismaClient({ adapter, log: ['error'] })
}

/** Returns the singleton PrismaClient, creating it on first call. */
function getInstance(): PrismaClient {
  if (globalThis.__prisma) return globalThis.__prisma
  const client = makeClient()
  if (process.env.NODE_ENV !== 'production') globalThis.__prisma = client
  return client
}

/**
 * Lazy Proxy — looks and feels like a PrismaClient to TypeScript and callers,
 * but defers `getInstance()` until the first property is accessed.
 * This lets Next.js import the module at build time without a DATABASE_URL.
 */
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return getInstance()[prop as keyof PrismaClient]
  },
})
