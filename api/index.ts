import type { VercelRequest, VercelResponse } from '@vercel/node'
import serverless from 'serverless-http'
import { setupServerlessDb } from '../server/dist/lib/vercelDb.js'
import { createApp } from '../server/dist/app.js'

setupServerlessDb()

const app = createApp()
const handler = serverless(app)

export default async function (req: VercelRequest, res: VercelResponse) {
  return handler(req, res)
}
