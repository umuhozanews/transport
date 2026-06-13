import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import routesRoutes from './routes/routes.routes.js'
import busesRoutes from './routes/buses.routes.js'
import captainsRoutes from './routes/captains.routes.js'
import terminalsRoutes from './routes/terminals.routes.js'
import transactionsRoutes from './routes/transactions.routes.js'
import auditRoutes from './routes/audit.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'
import trackingRoutes from './routes/tracking.routes.js'
import operationsRoutes from './routes/operations.routes.js'

export function createApp() {
  const app = express()
  const corsOrigin = process.env.CORS_ORIGIN ?? '*'

  app.use(cors({
    origin: corsOrigin === '*' ? true : corsOrigin,
    credentials: true,
  }))
  app.use(express.json())

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'horizon-api' })
  })

  app.use('/api/auth', authRoutes)
  app.use('/api/routes', routesRoutes)
  app.use('/api/buses', busesRoutes)
  app.use('/api/captains', captainsRoutes)
  app.use('/api/terminals', terminalsRoutes)
  app.use('/api/transactions', transactionsRoutes)
  app.use('/api/audit-logs', auditRoutes)
  app.use('/api/dashboard', dashboardRoutes)
  app.use('/api/tracking', trackingRoutes)
  app.use('/api/operations', operationsRoutes)

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found.' })
  })

  return app
}
