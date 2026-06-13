import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { api } from '../api/client'
import { useAuth } from './AuthContext'
import type { Route, Bus, Captain, AuditEntry } from '../types'

interface AppCtx {
  loading: boolean
  error: string | null
  routes: Route[]
  buses: Bus[]
  captains: Captain[]
  auditLogs: AuditEntry[]
  refresh: () => Promise<void>

  addRoute: (r: Omit<Route, 'id' | 'busesAssigned'>) => Promise<void>
  updateRoute: (id: string, r: Omit<Route, 'id' | 'busesAssigned'>) => Promise<void>
  deleteRoute: (id: string) => Promise<void>

  addBus: (b: Omit<Bus, 'id'>) => Promise<void>
  updateBus: (id: string, b: Omit<Bus, 'id'>) => Promise<void>
  deleteBus: (id: string) => Promise<void>

  addCaptain: (c: Omit<Captain, 'id' | 'busAssigned'>) => Promise<void>
  updateCaptain: (id: string, c: Omit<Captain, 'id' | 'busAssigned'>) => Promise<void>
  deleteCaptain: (id: string) => Promise<void>
}

const Ctx = createContext<AppCtx>(null!)
export const useApp = () => useContext(Ctx)

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [routes, setRoutes] = useState<Route[]>([])
  const [buses, setBuses] = useState<Bus[]>([])
  const [captains, setCaptains] = useState<Captain[]>([])
  const [auditLogs, setLogs] = useState<AuditEntry[]>([])

  const refresh = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const fetches: Promise<unknown>[] = [
        api.getRoutes(),
        api.getBuses(),
        api.getCaptains(),
      ]
      if (user.role === 'admin') {
        fetches.push(api.getAuditLogs())
      }

      const results = await Promise.all(fetches)
      setRoutes(results[0] as Route[])
      setBuses(results[1] as Bus[])
      setCaptains(results[2] as Captain[])
      if (user.role === 'admin') {
        setLogs(results[3] as AuditEntry[])
      } else {
        setLogs([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data.')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) refresh()
    else {
      setRoutes([]); setBuses([]); setCaptains([])
      setLogs([])
      setLoading(false)
    }
  }, [user, refresh])

  const addRoute = async (r: Omit<Route, 'id' | 'busesAssigned'>) => {
    const item = await api.createRoute(r)
    setRoutes(prev => [...prev, item])
    const logs = await api.getAuditLogs()
    setLogs(logs)
  }
  const updateRoute = async (id: string, r: Omit<Route, 'id' | 'busesAssigned'>) => {
    const item = await api.updateRoute(id, r)
    setRoutes(prev => prev.map(x => x.id === id ? item : x))
    const logs = await api.getAuditLogs()
    setLogs(logs)
  }
  const deleteRoute = async (id: string) => {
    await api.deleteRoute(id)
    setRoutes(prev => prev.filter(x => x.id !== id))
    const logs = await api.getAuditLogs()
    setLogs(logs)
  }

  const addBus = async (b: Omit<Bus, 'id'>) => {
    const item = await api.createBus(b)
    setBuses(prev => [...prev, item])
    const logs = await api.getAuditLogs()
    setLogs(logs)
  }
  const updateBus = async (id: string, b: Omit<Bus, 'id'>) => {
    const item = await api.updateBus(id, b)
    setBuses(prev => prev.map(x => x.id === id ? item : x))
    const logs = await api.getAuditLogs()
    setLogs(logs)
  }
  const deleteBus = async (id: string) => {
    await api.deleteBus(id)
    setBuses(prev => prev.filter(x => x.id !== id))
    const logs = await api.getAuditLogs()
    setLogs(logs)
  }

  const addCaptain = async (c: Omit<Captain, 'id' | 'busAssigned'>) => {
    const item = await api.createCaptain(c)
    setCaptains(prev => [...prev, item])
    const logs = await api.getAuditLogs()
    setLogs(logs)
  }
  const updateCaptain = async (id: string, c: Omit<Captain, 'id' | 'busAssigned'>) => {
    const item = await api.updateCaptain(id, c)
    setCaptains(prev => prev.map(x => x.id === id ? item : x))
    const logs = await api.getAuditLogs()
    setLogs(logs)
  }
  const deleteCaptain = async (id: string) => {
    await api.deleteCaptain(id)
    setCaptains(prev => prev.filter(x => x.id !== id))
    const logs = await api.getAuditLogs()
    setLogs(logs)
  }

  return (
    <Ctx.Provider value={{
      loading, error, routes, buses, captains, auditLogs, refresh,
      addRoute, updateRoute, deleteRoute,
      addBus, updateBus, deleteBus,
      addCaptain, updateCaptain, deleteCaptain,
    }}>
      {children}
    </Ctx.Provider>
  )
}
