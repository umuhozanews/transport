import type { Role } from '../store/AuthContext'

export const ROLE_LABEL: Record<Role, string> = {
  admin: 'Manager',
  agent: 'Station Worker',
  captain: 'Driver',
}

export const ROLE_BADGE_CLASS: Record<Role, string> = {
  admin: 'bg-[#0A2558] text-white',
  agent: 'bg-emerald-700 text-white',
  captain: 'bg-amber-600 text-white',
}
