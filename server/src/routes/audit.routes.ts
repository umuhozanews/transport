import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { formatKigaliDateTime } from '../lib/helpers.js'
import { requireAuth, requireRoles } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, requireRoles('admin'), async (_req, res) => {
  const logs = await prisma.auditLog.findMany({ orderBy: { timestamp: 'desc' } })
  res.json(logs.map(log => ({
    id: log.id,
    timestamp: formatKigaliDateTime(log.timestamp),
    user: log.user,
    action: log.action,
    module: log.module,
    detail: log.detail,
  })))
})

export default router
