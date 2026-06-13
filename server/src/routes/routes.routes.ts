import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { writeAudit } from '../lib/helpers.js'
import { requireAuth, requireRoles, routeId, type AuthRequest } from '../middleware/auth.js'

const router = Router()

async function routeToDto(route: {
  id: string
  number: string
  from: string
  to: string
  distance: number
  fare: number
  stops: number
  status: string
  _count?: { buses: number }
}) {
  const busesAssigned = route._count?.buses ?? await prisma.bus.count({ where: { routeId: route.id } })
  return {
    id: route.id,
    number: route.number,
    from: route.from,
    to: route.to,
    distance: route.distance,
    fare: route.fare,
    stops: route.stops,
    busesAssigned,
    status: route.status,
  }
}

router.get('/', requireAuth, async (_req, res) => {
  const routes = await prisma.route.findMany({
    orderBy: { number: 'asc' },
    include: { _count: { select: { buses: true } } },
  })
  res.json(await Promise.all(routes.map(routeToDto)))
})

router.post('/', requireAuth, requireRoles('admin'), async (req: AuthRequest, res) => {
  const { number, from, to, distance, fare, stops, status } = req.body
  const route = await prisma.route.create({
    data: { number, from, to, distance, fare, stops, status: status ?? 'Active' },
    include: { _count: { select: { buses: true } } },
  })
  await writeAudit(req.user!.name, 'Created', 'Route', `Inzira ${number} — ${from} → ${to} yongewe`)
  res.status(201).json(await routeToDto(route))
})

router.put('/:id', requireAuth, requireRoles('admin'), async (req: AuthRequest, res) => {
  const { number, from, to, distance, fare, stops, status } = req.body
  const route = await prisma.route.update({
    where: { id: routeId(req) },
    data: { number, from, to, distance, fare, stops, status },
    include: { _count: { select: { buses: true } } },
  })
  await writeAudit(req.user!.name, 'Updated', 'Route', `Inzira ${number} (${from} → ${to}) yahinduwe`)
  res.json(await routeToDto(route))
})

router.delete('/:id', requireAuth, requireRoles('admin'), async (req: AuthRequest, res) => {
  const existing = await prisma.route.findUnique({ where: { id: routeId(req) } })
  if (!existing) return res.status(404).json({ error: 'Route not found.' })

  await prisma.route.delete({ where: { id: routeId(req) } })
  await writeAudit(
    req.user!.name,
    'Deleted',
    'Route',
    `Inzira ${existing.number} (${existing.from} → ${existing.to}) yasibwe`,
  )
  res.json({ ok: true })
})

export default router
