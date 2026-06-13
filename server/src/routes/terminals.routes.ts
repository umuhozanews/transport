import { Router } from 'express'
import type { PaymentMethod } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { formatKigaliDateTime, writeAudit } from '../lib/helpers.js'
import { requireAuth, requireRoles, routeId, type AuthRequest } from '../middleware/auth.js'

const router = Router()

function parseAccepts(value: unknown): PaymentMethod[] {
  if (Array.isArray(value)) return value as PaymentMethod[]
  return []
}

function terminalToDto(terminal: {
  id: string
  name: string
  location: string
  type: string
  status: string
  lastTx: Date | null
  totalToday: number
  accepts: unknown
}) {
  return {
    id: terminal.id,
    name: terminal.name,
    location: terminal.location,
    type: terminal.type,
    status: terminal.status,
    lastTx: terminal.lastTx ? formatKigaliDateTime(terminal.lastTx) : '—',
    totalToday: terminal.totalToday,
    accepts: parseAccepts(terminal.accepts),
  }
}

router.get('/', requireAuth, requireRoles('admin'), async (_req, res) => {
  const terminals = await prisma.terminal.findMany({ orderBy: { id: 'asc' } })
  res.json(terminals.map(terminalToDto))
})

router.post('/', requireAuth, requireRoles('admin'), async (req: AuthRequest, res) => {
  const { name, location, type, status, lastTx, totalToday, accepts } = req.body
  const count = await prisma.terminal.count()
  const id = `HT-${String(count + 1).padStart(2, '0')}`

  const terminal = await prisma.terminal.create({
    data: {
      id,
      name,
      location,
      type,
      status: status ?? 'Offline',
      lastTx: lastTx && lastTx !== '—' ? new Date(lastTx) : null,
      totalToday: totalToday ?? 0,
      accepts: accepts ?? [],
    },
  })

  await writeAudit(req.user!.name, 'Created', 'Terminal', `Terminal ${name} i ${location} yongewe`)
  res.status(201).json(terminalToDto(terminal))
})

router.put('/:id', requireAuth, requireRoles('admin'), async (req: AuthRequest, res) => {
  const { name, location, type, status, lastTx, totalToday, accepts } = req.body

  const terminal = await prisma.terminal.update({
    where: { id: routeId(req) },
    data: {
      name,
      location,
      type,
      status,
      lastTx: lastTx && lastTx !== '—' ? new Date(lastTx) : null,
      totalToday,
      accepts,
    },
  })

  await writeAudit(req.user!.name, 'Updated', 'Terminal', `Terminal ${name} yahinduwe`)
  res.json(terminalToDto(terminal))
})

router.delete('/:id', requireAuth, requireRoles('admin'), async (req: AuthRequest, res) => {
  const existing = await prisma.terminal.findUnique({ where: { id: routeId(req) } })
  if (!existing) return res.status(404).json({ error: 'Terminal not found.' })

  await prisma.terminal.delete({ where: { id: routeId(req) } })
  await writeAudit(req.user!.name, 'Deleted', 'Terminal', `Terminal ${existing.name} yasibwe`)
  res.json({ ok: true })
})

export default router
