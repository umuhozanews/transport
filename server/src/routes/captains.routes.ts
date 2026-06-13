import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { formatDateOnly, writeAudit } from '../lib/helpers.js'
import { requireAuth, requireRoles, routeId, type AuthRequest } from '../middleware/auth.js'

const router = Router()

function captainToDto(captain: {
  id: string
  name: string
  phone: string
  license: string
  licenseExpiry: Date
  rating: number
  experience: number
  status: string
  joinDate: Date
  route?: { number: string } | null
  buses: { regNumber: string }[]
}) {
  const statusMap: Record<string, string> = {
    OnDuty: 'On Duty',
    OffDuty: 'Off Duty',
    OnLeave: 'On Leave',
  }

  return {
    id: captain.id,
    name: captain.name,
    phone: captain.phone,
    license: captain.license,
    licenseExpiry: formatDateOnly(captain.licenseExpiry),
    busAssigned: captain.buses[0]?.regNumber ?? '—',
    route: captain.route?.number ?? '—',
    rating: captain.rating,
    experience: captain.experience,
    status: statusMap[captain.status] ?? captain.status,
    joinDate: formatDateOnly(captain.joinDate),
  }
}

router.get('/', requireAuth, async (_req, res) => {
  const captains = await prisma.captain.findMany({
    orderBy: { name: 'asc' },
    include: { route: true, buses: { take: 1 } },
  })
  res.json(captains.map(captainToDto))
})

router.post('/', requireAuth, requireRoles('admin'), async (req: AuthRequest, res) => {
  const { name, phone, license, licenseExpiry, route, rating, experience, status, joinDate } = req.body

  const routeRec = route && route !== '—'
    ? await prisma.route.findUnique({ where: { number: route } })
    : null

  const statusMap: Record<string, 'OnDuty' | 'OffDuty' | 'OnLeave'> = {
    'On Duty': 'OnDuty',
    'Off Duty': 'OffDuty',
    'On Leave': 'OnLeave',
  }

  const captain = await prisma.captain.create({
    data: {
      name,
      phone,
      license,
      licenseExpiry: new Date(licenseExpiry),
      routeId: routeRec?.id,
      rating,
      experience,
      status: statusMap[status] ?? 'OffDuty',
      joinDate: new Date(joinDate),
    },
    include: { route: true, buses: { take: 1 } },
  })

  await writeAudit(req.user!.name, 'Created', 'Captain', `Umushoferi ${name} yongewe`)
  res.status(201).json(captainToDto(captain))
})

router.put('/:id', requireAuth, requireRoles('admin'), async (req: AuthRequest, res) => {
  const { name, phone, license, licenseExpiry, route, rating, experience, status, joinDate } = req.body

  const routeRec = route && route !== '—'
    ? await prisma.route.findUnique({ where: { number: route } })
    : null

  const statusMap: Record<string, 'OnDuty' | 'OffDuty' | 'OnLeave'> = {
    'On Duty': 'OnDuty',
    'Off Duty': 'OffDuty',
    'On Leave': 'OnLeave',
  }

  const captain = await prisma.captain.update({
    where: { id: routeId(req) },
    data: {
      name,
      phone,
      license,
      licenseExpiry: new Date(licenseExpiry),
      routeId: routeRec?.id ?? null,
      rating,
      experience,
      status: statusMap[status] ?? 'OffDuty',
      joinDate: new Date(joinDate),
    },
    include: { route: true, buses: { take: 1 } },
  })

  await writeAudit(req.user!.name, 'Updated', 'Captain', `Umushoferi ${name} yavuguruwe`)
  res.json(captainToDto(captain))
})

router.delete('/:id', requireAuth, requireRoles('admin'), async (req: AuthRequest, res) => {
  const existing = await prisma.captain.findUnique({ where: { id: routeId(req) } })
  if (!existing) return res.status(404).json({ error: 'Captain not found.' })

  await prisma.captain.delete({ where: { id: routeId(req) } })
  await writeAudit(req.user!.name, 'Deleted', 'Captain', `Umushoferi ${existing.name} yasibwe`)
  res.json({ ok: true })
})

export default router
