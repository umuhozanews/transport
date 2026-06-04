import { createContext, useContext, useState, type ReactNode } from 'react'

export type Role = 'admin' | 'agent' | 'captain'

export interface AppUser {
  id: string
  name: string
  email: string
  role: Role
  title: string
  captainName?: string  // for captains — their name in the drivers list
}

interface StoredUser extends AppUser {
  password: string
}

// ── All system users ──────────────────────────────────────────────────────────
export const SYSTEM_USERS: StoredUser[] = [
  {
    id: 'U1', name: 'Mugisha Eric', email: 'admin@horizon.rw',
    password: 'Admin@2024', role: 'admin', title: 'Umuyobozi Mukuru (Super Admin)',
  },
  {
    id: 'U2', name: 'Keza Aline', email: 'keza@horizon.rw',
    password: 'Keza@2024', role: 'agent', title: 'Ukoresha Tiketi — Nyabugogo',
  },
  {
    id: 'U3', name: 'Irakoze John', email: 'irakoze@horizon.rw',
    password: 'John@2024', role: 'agent', title: 'Ukoresha Tiketi — Musanze',
  },
  {
    id: 'U4', name: 'Jean Paul Habimana', email: 'jp@horizon.rw',
    password: 'JP@2024', role: 'captain', title: 'Umushoferi — KL1 (Kigali→Musanze)',
    captainName: 'Jean Paul Habimana',
  },
  {
    id: 'U5', name: 'Marie Claire Uwimana', email: 'mc@horizon.rw',
    password: 'MC@2024', role: 'captain', title: 'Umushoferi — KL2 (Kigali→Huye)',
    captainName: 'Marie Claire Uwimana',
  },
  {
    id: 'U6', name: 'Patrick Niyonzima', email: 'patrick@horizon.rw',
    password: 'Pat@2024', role: 'captain', title: 'Umushoferi — KL5 (Kigali→Rwamagana)',
    captainName: 'Patrick Niyonzima',
  },
]

// ── Permission helpers ────────────────────────────────────────────────────────
export const can = {
  seeReports:    (r: Role) => r === 'admin',
  seeAuditLog:   (r: Role) => r === 'admin',
  seeSetup:      (r: Role) => r === 'admin',
  manageUsers:   (r: Role) => r === 'admin',
  recordTrips:   (r: Role) => r === 'admin' || r === 'agent' || r === 'captain',
  seeAllTrips:   (r: Role) => r === 'admin' || r === 'agent',
}

// ── Context ───────────────────────────────────────────────────────────────────
interface AuthCtx {
  user: AppUser | null
  login: (email: string, password: string) => { ok: boolean; error?: string }
  logout: () => void
}

const Ctx = createContext<AuthCtx>(null!)
export const useAuth = () => useContext(Ctx)

// ── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(() => {
    try {
      const s = localStorage.getItem('hz_auth')
      return s ? JSON.parse(s) : null
    } catch { return null }
  })

  const login = (email: string, password: string): { ok: boolean; error?: string } => {
    const found = SYSTEM_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!found) return { ok: false, error: 'Imeli cyangwa ijambo ry\'ibanga si ryo.' }

    const { password: _, ...safe } = found
    setUser(safe)
    localStorage.setItem('hz_auth', JSON.stringify(safe))

    // Write login event to audit log
    const logs = (() => {
      try { return JSON.parse(localStorage.getItem('hz_logs') || '[]') } catch { return [] }
    })()
    const entry = {
      id: `A-${Date.now()}`,
      timestamp: new Intl.DateTimeFormat('sv-SE', {
        timeZone: 'Africa/Kigali', year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
      }).format(new Date()).replace('T', ' '),
      user: safe.name,
      action: 'Login',
      module: 'System',
      detail: `${safe.name} (${safe.role}) yinjiye mu sisiteme — ${safe.title}`,
    }
    localStorage.setItem('hz_logs', JSON.stringify([entry, ...logs]))

    return { ok: true }
  }

  const logout = () => {
    if (user) {
      const logs = (() => {
        try { return JSON.parse(localStorage.getItem('hz_logs') || '[]') } catch { return [] }
      })()
      const entry = {
        id: `A-${Date.now()}`,
        timestamp: new Intl.DateTimeFormat('sv-SE', {
          timeZone: 'Africa/Kigali', year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit',
        }).format(new Date()).replace('T', ' '),
        user: user.name,
        action: 'Logout',
        module: 'System',
        detail: `${user.name} (${user.role}) yasohutse mu sisiteme`,
      }
      localStorage.setItem('hz_logs', JSON.stringify([entry, ...logs]))
    }
    setUser(null)
    localStorage.removeItem('hz_auth')
  }

  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>
}
