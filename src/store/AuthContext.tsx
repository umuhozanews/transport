import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api, setToken } from '../api/client'

export type Role = 'admin' | 'agent' | 'captain'

export interface AppUser {
  id: string
  name: string
  email: string
  role: Role
  title: string
  captainName?: string
}

// Demo account list for login page (credentials only — auth goes through API)
export const DEMO_ACCOUNTS = [
  { email: 'admin@horizon.rw', password: 'Admin@2024', role: 'admin' as Role, name: 'Mugisha Eric' },
  { email: 'keza@horizon.rw', password: 'Keza@2024', role: 'agent' as Role, name: 'Keza Aline' },
  { email: 'jp@horizon.rw', password: 'JP@2024', role: 'captain' as Role, name: 'Jean Paul Habimana' },
  { email: 'mc@horizon.rw', password: 'MC@2024', role: 'captain' as Role, name: 'Marie Claire Uwimana' },
  { email: 'patrick@horizon.rw', password: 'Pat@2024', role: 'captain' as Role, name: 'Patrick Niyonzima' },
]

export const can = {
  seeReports:    (r: Role) => r === 'admin',
  seeAuditLog:   (r: Role) => r === 'admin',
  seeSetup:      (r: Role) => r === 'admin',
  manageUsers:   (r: Role) => r === 'admin',
}

interface AuthCtx {
  user: AppUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => Promise<void>
}

const Ctx = createContext<AuthCtx>(null!)
export const useAuth = () => useContext(Ctx)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.me()
      .then(({ user: u }) => setUser(u))
      .catch(() => {
        setToken(null)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { token, user: u } = await api.login(email, password)
      setToken(token)
      setUser(u)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : 'Unknown error.' }
    }
  }

  const logout = async () => {
    try { await api.logout() } catch { /* ignore */ }
    setToken(null)
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A2558] flex items-center justify-center">
        <div className="text-white text-sm font-medium animate-pulse">Loading HORIZON Express...</div>
      </div>
    )
  }

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>
}
