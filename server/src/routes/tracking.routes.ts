import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { formatKigaliDateTime } from '../lib/helpers.js'
import { requireAuth, requireRoles, type AuthRequest } from '../middleware/auth.js'

const router = Router()

function busTrackingDto(bus: {
  id: string
  regNumber: string
  status: string
  latitude: number | null
  longitude: number | null
  currentStop: string | null
  lastLocationAt: Date | null
  trackingStatus: string
  route?: { number: string; from: string; to: string } | null
  captain?: { name: string } | null
}) {
  return {
    id: bus.id,
    regNumber: bus.regNumber,
    status: bus.status === 'InService' ? 'In Service' : bus.status,
    route: bus.route?.number ?? '—',
    from: bus.route?.from ?? '—',
    to: bus.route?.to ?? '—',
    driver: bus.captain?.name ?? '—',
    latitude: bus.latitude,
    longitude: bus.longitude,
    currentStop: bus.currentStop ?? 'Unknown',
    trackingStatus: bus.trackingStatus,
    lastUpdate: bus.lastLocationAt ? formatKigaliDateTime(bus.lastLocationAt) : '—',
  }
}

// Public — customers can track buses without logging in
router.get('/live', async (_req, res) => {
  const buses = await prisma.bus.findMany({
    where: {
      status: { in: ['Active', 'InService'] },
      latitude: { not: null },
      longitude: { not: null },
    },
    include: { route: true, captain: true },
    orderBy: { regNumber: 'asc' },
  })
  res.json(buses.map(busTrackingDto))
})

router.get('/routes/:number/stops', async (req, res) => {
  const number = String(req.params.number)
  const route = await prisma.route.findUnique({
    where: { number },
    include: { routeStops: { orderBy: { order: 'asc' } } },
  })
  if (!route) return res.status(404).json({ error: 'Route not found.' })

  res.json({
    route: route.number,
    from: route.from,
    to: route.to,
    status: route.status,
    stops: route.routeStops.map(s => ({
      id: s.id,
      name: s.name,
      latitude: s.latitude,
      longitude: s.longitude,
      order: s.order,
    })),
  })
})

// Drivers update their bus location (manual GPS from mobile later)
router.post('/update', requireAuth, requireRoles('captain'), async (req: AuthRequest, res) => {
  const { latitude, longitude, currentStop } = req.body as {
    latitude?: number
    longitude?: number
    currentStop?: string
  }

  if (!req.user?.captainId) {
    return res.status(400).json({ error: 'No driver profile linked to this account.' })
  }

  const bus = await prisma.bus.findFirst({ where: { captainId: req.user.captainId } })
  if (!bus) return res.status(404).json({ error: 'No bus assigned to you.' })

  const updated = await prisma.bus.update({
    where: { id: bus.id },
    data: {
      latitude,
      longitude,
      currentStop,
      lastLocationAt: new Date(),
      trackingStatus: 'OnRoute',
    },
    include: { route: true, captain: true },
  })

  res.json(busTrackingDto(updated))
})

export default router
