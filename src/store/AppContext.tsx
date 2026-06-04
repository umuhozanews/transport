import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import {
  transactions as defaultTx,
  routes as defaultRoutes,
  buses as defaultBuses,
  captains as defaultCaptains,
  terminals as defaultTerminals,
  auditLogs as defaultLogs,
  type Transaction, type Route, type Bus, type Captain,
  type Terminal, type AuditEntry,
} from '../data/mockData'

// ── helpers ──────────────────────────────────────────────────────────────────
function currentUserName(): string {
  try {
    const s = localStorage.getItem('hz_auth')
    return s ? JSON.parse(s).name : 'System'
  } catch { return 'System' }
}

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key)
    return v ? (JSON.parse(v) as T) : fallback
  } catch { return fallback }
}

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

function nowKigali() {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Africa/Kigali',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date()).replace('T', ' ')
}

// ── context type ─────────────────────────────────────────────────────────────
interface AppCtx {
  transactions: Transaction[]
  routes: Route[]
  buses: Bus[]
  captains: Captain[]
  terminals: Terminal[]
  auditLogs: AuditEntry[]

  addTransaction: (tx: Omit<Transaction, 'id'>) => void

  addRoute: (r: Omit<Route, 'id'>) => void
  updateRoute: (id: string, r: Omit<Route, 'id'>) => void
  deleteRoute: (id: string) => void

  addBus: (b: Omit<Bus, 'id'>) => void
  updateBus: (id: string, b: Omit<Bus, 'id'>) => void
  deleteBus: (id: string) => void

  addCaptain: (c: Omit<Captain, 'id'>) => void
  updateCaptain: (id: string, c: Omit<Captain, 'id'>) => void
  deleteCaptain: (id: string) => void

  addTerminal: (t: Omit<Terminal, 'id'>) => void
  updateTerminal: (id: string, t: Omit<Terminal, 'id'>) => void
  deleteTerminal: (id: string) => void
}

const Ctx = createContext<AppCtx>(null!)
export const useApp = () => useContext(Ctx)

// ── provider ─────────────────────────────────────────────────────────────────
export function AppProvider({ children }: { children: ReactNode }) {
  const [transactions, setTx]       = useState<Transaction[]>(() => load('hz_tx',        defaultTx))
  const [routes,       setRoutes]   = useState<Route[]>      (() => load('hz_routes',    defaultRoutes))
  const [buses,        setBuses]    = useState<Bus[]>        (() => load('hz_buses',     defaultBuses))
  const [captains,     setCaptains] = useState<Captain[]>    (() => load('hz_captains',  defaultCaptains))
  const [terminals,    setTerminals]= useState<Terminal[]>   (() => load('hz_terminals', defaultTerminals))
  const [auditLogs,    setLogs]     = useState<AuditEntry[]> (() => load('hz_logs',      defaultLogs))

  useEffect(() => { localStorage.setItem('hz_tx',        JSON.stringify(transactions)) }, [transactions])
  useEffect(() => { localStorage.setItem('hz_routes',    JSON.stringify(routes))       }, [routes])
  useEffect(() => { localStorage.setItem('hz_buses',     JSON.stringify(buses))        }, [buses])
  useEffect(() => { localStorage.setItem('hz_captains',  JSON.stringify(captains))     }, [captains])
  useEffect(() => { localStorage.setItem('hz_terminals', JSON.stringify(terminals))    }, [terminals])
  useEffect(() => { localStorage.setItem('hz_logs',      JSON.stringify(auditLogs))    }, [auditLogs])

  function log(action: AuditEntry['action'], module: AuditEntry['module'], detail: string) {
    const entry: AuditEntry = { id: uid('A'), timestamp: nowKigali(), user: currentUserName(), action, module, detail }
    setLogs(prev => [entry, ...prev])
  }

  // ── transactions ──
  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const item: Transaction = { ...tx, id: uid('TXN') }
    setTx(prev => [item, ...prev])
    log('Created', 'Payment', `Urugendo: ${tx.from} → ${tx.to} · ${tx.passengers} abagenzi · RWF ${tx.amount.toLocaleString()}`)
  }

  // ── routes ──
  const addRoute = (r: Omit<Route, 'id'>) => {
    setRoutes(prev => [...prev, { ...r, id: uid('R') }])
    log('Created', 'Route', `Inzira ${r.number} — ${r.from} → ${r.to} yongewe`)
  }
  const updateRoute = (id: string, r: Omit<Route, 'id'>) => {
    setRoutes(prev => prev.map(x => x.id === id ? { ...r, id } : x))
    log('Updated', 'Route', `Inzira ${r.number} (${r.from} → ${r.to}) yahinduwe`)
  }
  const deleteRoute = (id: string) => {
    const r = routes.find(x => x.id === id)
    setRoutes(prev => prev.filter(x => x.id !== id))
    if (r) log('Deleted', 'Route', `Inzira ${r.number} (${r.from} → ${r.to}) yasibwe`)
  }

  // ── buses ──
  const addBus = (b: Omit<Bus, 'id'>) => {
    setBuses(prev => [...prev, { ...b, id: uid('B') }])
    log('Created', 'Bus', `Bisi ${b.regNumber} — ${b.model} yongewe mu nganda`)
  }
  const updateBus = (id: string, b: Omit<Bus, 'id'>) => {
    setBuses(prev => prev.map(x => x.id === id ? { ...b, id } : x))
    log('Updated', 'Bus', `Bisi ${b.regNumber} yahinduwe`)
  }
  const deleteBus = (id: string) => {
    const b = buses.find(x => x.id === id)
    setBuses(prev => prev.filter(x => x.id !== id))
    if (b) log('Deleted', 'Bus', `Bisi ${b.regNumber} yasibwe`)
  }

  // ── captains ──
  const addCaptain = (c: Omit<Captain, 'id'>) => {
    setCaptains(prev => [...prev, { ...c, id: uid('C') }])
    log('Created', 'Captain', `Umushoferi ${c.name} yongewe`)
  }
  const updateCaptain = (id: string, c: Omit<Captain, 'id'>) => {
    setCaptains(prev => prev.map(x => x.id === id ? { ...c, id } : x))
    log('Updated', 'Captain', `Umushoferi ${c.name} yavuguruwe`)
  }
  const deleteCaptain = (id: string) => {
    const c = captains.find(x => x.id === id)
    setCaptains(prev => prev.filter(x => x.id !== id))
    if (c) log('Deleted', 'Captain', `Umushoferi ${c.name} yasibwe`)
  }

  // ── terminals ──
  const addTerminal = (t: Omit<Terminal, 'id'>) => {
    const next = `HT-${String(terminals.length + 1).padStart(2, '0')}`
    setTerminals(prev => [...prev, { ...t, id: next }])
    log('Created', 'Terminal', `Terminal ${t.name} i ${t.location} yongewe`)
  }
  const updateTerminal = (id: string, t: Omit<Terminal, 'id'>) => {
    setTerminals(prev => prev.map(x => x.id === id ? { ...t, id } : x))
    log('Updated', 'Terminal', `Terminal ${t.name} yahinduwe`)
  }
  const deleteTerminal = (id: string) => {
    const t = terminals.find(x => x.id === id)
    setTerminals(prev => prev.filter(x => x.id !== id))
    if (t) log('Deleted', 'Terminal', `Terminal ${t.name} yasibwe`)
  }

  return (
    <Ctx.Provider value={{
      transactions, routes, buses, captains, terminals, auditLogs,
      addTransaction,
      addRoute, updateRoute, deleteRoute,
      addBus, updateBus, deleteBus,
      addCaptain, updateCaptain, deleteCaptain,
      addTerminal, updateTerminal, deleteTerminal,
    }}>
      {children}
    </Ctx.Provider>
  )
}
