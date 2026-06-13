import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { formatKigaliDateTime, writeAudit } from '../lib/helpers.js'
import { requireAuth, type AuthRequest } from '../middleware/auth.js'

const router = Router()

function txToDto(tx: {
  id: string
  routeNumber: string
  from: string
  to: string
  captainName: string
  date: Date
  amount: number
  method: string
  status: string
  passengers: number
}) {
  return {
    id: tx.id,
    route: tx.routeNumber,
    from: tx.from,
    to: tx.to,
    captain: tx.captainName,
    date: formatKigaliDateTime(tx.date),
    amount: tx.amount,
    method: tx.method,
    status: tx.status,
    passengers: tx.passengers,
  }
}

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const where = req.user!.role === 'captain' && req.user!.captainName
    ? { captainName: req.user!.captainName }
    : {}

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: { date: 'desc' },
  })
  res.json(transactions.map(txToDto))
})

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const { route, from, to, captain, date, amount, method, status, passengers } = req.body

  const routeRec = route
    ? await prisma.route.findUnique({ where: { number: route } })
    : null
  const captainRec = captain
    ? await prisma.captain.findFirst({ where: { name: captain } })
    : null

  if (req.user!.role === 'captain' && req.user!.captainName !== captain) {
    return res.status(403).json({ error: 'Captains can only record their own trips.' })
  }

  const tx = await prisma.transaction.create({
    data: {
      routeNumber: route,
      from,
      to,
      captainName: captain,
      routeId: routeRec?.id,
      captainId: captainRec?.id,
      date: date ? new Date(date.replace(' ', 'T') + ':00+02:00') : new Date(),
      amount,
      method,
      status: status ?? 'Success',
      passengers,
    },
  })

  await writeAudit(
    req.user!.name,
    'Created',
    'Payment',
    `Urugendo: ${from} → ${to} · ${passengers} abagenzi · RWF ${amount.toLocaleString()}`,
  )

  res.status(201).json(txToDto(tx))
})

export default router
