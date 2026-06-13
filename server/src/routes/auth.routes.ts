import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma.js'
import { signToken } from '../lib/auth.js'
import { writeAudit } from '../lib/helpers.js'
import { requireAuth, type AuthRequest } from '../middleware/auth.js'

const router = Router()

router.post('/login', async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string }
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' })
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: { captain: true },
  })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Imeli cyangwa ijambo ry'ibanga si ryo." })
  }

  const token = signToken({ userId: user.id, role: user.role })

  await writeAudit(
    user.name,
    'Login',
    'System',
    `${user.name} (${user.role}) yinjiye mu sisiteme — ${user.title}`,
  )

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      title: user.title,
      captainName: user.captain?.name,
    },
  })
})

router.get('/me', requireAuth, (req: AuthRequest, res) => {
  res.json({
    user: {
      id: req.user!.id,
      name: req.user!.name,
      email: req.user!.email,
      role: req.user!.role,
      title: req.user!.title,
      captainName: req.user!.captainName,
    },
  })
})

router.post('/logout', requireAuth, async (req: AuthRequest, res) => {
  if (req.user) {
    await writeAudit(
      req.user.name,
      'Logout',
      'System',
      `${req.user.name} (${req.user.role}) yasohutse mu sisiteme`,
    )
  }
  res.json({ ok: true })
})

export default router
