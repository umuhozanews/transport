import type { VercelRequest, VercelResponse } from '@vercel/node'

type ExpressApp = (req: VercelRequest, res: VercelResponse) => void

let app: ExpressApp | undefined

async function getApp(): Promise<ExpressApp> {
  if (app) return app

  const { setupServerlessDb } = await import('../server/dist/lib/vercelDb.js')
  setupServerlessDb()

  const { createApp } = await import('../server/dist/app.js')
  app = createApp() as ExpressApp
  return app
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const expressApp = await getApp()
  return expressApp(req, res)
}
