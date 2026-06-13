import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { formatDateOnly, writeAudit } from '../lib/helpers.js'
import { requireAuth, requireRoles, routeId, type AuthRequest } from '../middleware/auth.js'

const router = Router()

function busToDto(bus: {
  id: string
  regNumber: string
  model: string
  capacity: number
  type: string
  status: string
  lastService: Date
  totalKm: number
  route?: { number: string } | null
  captain?: { name: string } | null
}) {
  return {
    id: bus.id,
    regNumber: bus.regNumber,
    model: bus.model,
    capacity: bus.capacity,
    type: bus.type,
    route: bus.route?.number ?? '—',
    captain: bus.captain?.name ?? '—',
    status: bus.status === 'InService' ? 'In Service' : bus.status,
    lastService: formatDateOnly(bus.lastService),
    totalKm: bus.totalKm,
  }
}

router.get('/', requireAuth, async (_req, res) => {
  const buses = await prisma.bus.findMany({
    orderBy: { regNumber: 'asc' },
    include: { route: true, captain: true },
  })
  res.json(buses.map(busToDto))
})

router.post('/', requireAuth, requireRoles('admin'), async (req: AuthRequest, res) => {
  const { regNumber, model, capacity, type, route, captain, status, lastService, totalKm } = req.body

  const routeRec = route && route !== '—'
    ? await prisma.route.findUnique({ where: { number: route } })
    : null
  const captainRec = captain && captain !== '—'
    ? await prisma.captain.findFirst({ where: { name: captain } })
    : null

  const bus = await prisma.bus.create({
    data: {
      regNumber,
      model,
      capacity,
      type,
      routeId: routeRec?.id,
      captainId: captainRec?.id,
      status: status === 'In Service' ? 'InService' : status,
      lastService: new Date(lastService),
      totalKm,
    },
    include: { route: true, captain: true },
  })

  await writeAudit(req.user!.name, 'Created', 'Bus', `Bisi ${regNumber} — ${model} yongewe mu nganda`)
  res.status(201).json(busToDto(bus))
})

router.put('/:id', requireAuth, requireRoles('admin'), async (req: AuthRequest, res) => {
  const { regNumber, model, capacity, type, route, captain, status, lastService, totalKm } = req.body

  const routeRec = route && route !== '—'
    ? await prisma.route.findUnique({ where: { number: route } })
    : null
  const captainRec = captain && captain !== '—'
    ? await prisma.captain.findFirst({ where: { name: captain } })
    : null

  const bus = await prisma.bus.update({
    where: { id: routeId(req) },
    data: {
      regNumber,
      model,
      capacity,
      type,
      routeId: routeRec?.id ?? null,
      captainId: captainRec?.id ?? null,
      status: status === 'In Service' ? 'InService' : status,
      lastService: new Date(lastService),
      totalKm,
    },
    include: { route: true, captain: true },
  })

  await writeAudit(req.user!.name, 'Updated', 'Bus', `Bisi ${regNumber} yahinduwe`)
  res.json(busToDto(bus))
})

router.delete('/:id', requireAuth, requireRoles('admin'), async (req: AuthRequest, res) => {
  const existing = await prisma.bus.findUnique({ where: { id: routeId(req) } })
  if (!existing) return res.status(404).json({ error: 'Bus not found.' })

  await prisma.bus.delete({ where: { id: routeId(req) } })
  await writeAudit(req.user!.name, 'Deleted', 'Bus', `Bisi ${existing.regNumber} yasibwe`)
  res.json({ ok: true })
})

export default router
