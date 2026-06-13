import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

const ROLE_LABEL: Record<string, string> = {
  admin: 'Manager',
  agent: 'Station Worker',
  captain: 'Driver',
}

router.get('/active', requireAuth, async (_req, res) => {
  const [buses, routes, users, drivers] = await Promise.all([
    prisma.bus.findMany({
      where: { status: { in: ['Active', 'InService'] } },
      include: { route: true, captain: true },
      orderBy: { regNumber: 'asc' },
    }),
    prisma.route.findMany({
      where: { status: 'Active' },
      include: {
        _count: { select: { buses: true } },
        captains: { where: { status: 'OnDuty' } },
      },
      orderBy: { number: 'asc' },
    }),
    prisma.user.findMany({
      where: { role: { in: ['admin', 'agent'] }, dutyStatus: 'OnDuty' },
      orderBy: { name: 'asc' },
    }),
    prisma.captain.findMany({
      where: { status: 'OnDuty' },
      include: { route: true, buses: { take: 1 } },
      orderBy: { name: 'asc' },
    }),
  ])

  res.json({
    buses: buses.map(b => ({
      id: b.id,
      regNumber: b.regNumber,
      route: b.route?.number ?? '—',
      from: b.route?.from ?? '—',
      to: b.route?.to ?? '—',
      driver: b.captain?.name ?? '—',
      status: b.status === 'InService' ? 'In Service' : b.status,
      currentStop: b.currentStop ?? '—',
      trackingStatus: b.trackingStatus,
      latitude: b.latitude,
      longitude: b.longitude,
    })),
    stationWorkers: users.map(u => ({
      id: u.id,
      name: u.name,
      role: ROLE_LABEL[u.role] ?? u.role,
      station: u.station ?? '—',
      title: u.title,
      dutyStatus: u.dutyStatus === 'OnDuty' ? 'On Duty' : 'Off Duty',
    })),
    drivers: drivers.map(d => ({
      id: d.id,
      name: d.name,
      route: d.route?.number ?? '—',
      bus: d.buses[0]?.regNumber ?? '—',
      phone: d.phone,
      status: 'On Duty',
    })),
    routes: routes.map(r => ({
      id: r.id,
      number: r.number,
      from: r.from,
      to: r.to,
      fare: r.fare,
      status: r.status,
      busesActive: r._count.buses,
      driversOnDuty: r.captains.length,
    })),
  })
})

export default router
