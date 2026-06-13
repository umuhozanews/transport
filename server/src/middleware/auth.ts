import type { Request, Response, NextFunction } from 'express'
import type { Role } from '@prisma/client'
import { verifyToken } from '../lib/auth.js'
import { prisma } from '../lib/prisma.js'

export interface AuthRequest extends Request {
  user?: {
    id: string
    name: string
    email: string
    role: Role
    title: string
    captainId: string | null
    captainName?: string
  }
}

export function routeId(req: Request): string {
  const id = req.params.id
  return Array.isArray(id) ? id[0] : String(id)
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required.' })
  }

  try {
    const payload = verifyToken(header.slice(7))
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { captain: true },
    })

    if (!user) {
      return res.status(401).json({ error: 'User not found.' })
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      title: user.title,
      captainId: user.captainId,
      captainName: user.captain?.name,
    }
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token.' })
  }
}

export function requireRoles(...roles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied.' })
    }
    next()
  }
}
