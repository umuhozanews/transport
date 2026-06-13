import type { AuditAction, AuditModule } from '@prisma/client'
import { prisma } from './prisma.js'

export async function writeAudit(
  user: string,
  action: AuditAction,
  module: AuditModule,
  detail: string,
) {
  await prisma.auditLog.create({
    data: { user, action, module, detail },
  })
}

export function kigaliNow(): Date {
  return new Date()
}

export function formatKigaliDateTime(date: Date): string {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Africa/Kigali',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date).replace('T', ' ')
}

export function formatDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10)
}
