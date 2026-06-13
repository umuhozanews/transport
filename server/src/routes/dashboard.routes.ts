import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/stats', requireAuth, async (_req, res) => {
  const [activeRoutes, totalRoutes, activeBuses, totalBuses, onDutyCaptains, totalCaptains] = await Promise.all([
    prisma.route.count({ where: { status: 'Active' } }),
    prisma.route.count(),
    prisma.bus.count({ where: { status: { in: ['Active', 'InService'] } } }),
    prisma.bus.count({ where: { status: { not: 'Retired' } } }),
    prisma.captain.count({ where: { status: 'OnDuty' } }),
    prisma.captain.count(),
  ])

  res.json({
    activeRoutes,
    totalRoutes,
    activeBuses,
    totalBuses,
    onDutyCaptains,
    totalCaptains,
  })
})

router.get('/revenue', requireAuth, async (req, res) => {
  const year = Number(req.query.year ?? new Date().getFullYear())
  const start = new Date(`${year}-01-01T00:00:00+02:00`)
  const end = new Date(`${year + 1}-01-01T00:00:00+02:00`)

  const transactions = await prisma.transaction.findMany({
    where: {
      status: 'Success',
      date: { gte: start, lt: end },
    },
    select: { date: true, amount: true },
  })

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const monthly = months.map((month, index) => ({
    month,
    revenue: transactions
      .filter(tx => tx.date.getMonth() === index)
      .reduce((sum, tx) => sum + tx.amount, 0),
  }))

  res.json({ year, monthly })
})

export default router
