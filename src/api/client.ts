const API_BASE = '/api'

class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

function getToken(): string | null {
  return localStorage.getItem('hz_token')
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem('hz_token', token)
  else localStorage.removeItem('hz_token')
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(body.error ?? `Request failed (${res.status})`, res.status)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string; user: import('../store/AuthContext').AppUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () => request<{ ok: boolean }>('/auth/logout', { method: 'POST' }),

  me: () => request<{ user: import('../store/AuthContext').AppUser }>('/auth/me'),

  getRoutes: () => request<import('../types').Route[]>('/routes'),
  createRoute: (data: Omit<import('../types').Route, 'id' | 'busesAssigned'>) =>
    request<import('../types').Route>('/routes', { method: 'POST', body: JSON.stringify(data) }),
  updateRoute: (id: string, data: Omit<import('../types').Route, 'id' | 'busesAssigned'>) =>
    request<import('../types').Route>(`/routes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteRoute: (id: string) =>
    request<{ ok: boolean }>(`/routes/${id}`, { method: 'DELETE' }),

  getBuses: () => request<import('../types').Bus[]>('/buses'),
  createBus: (data: Omit<import('../types').Bus, 'id'>) =>
    request<import('../types').Bus>('/buses', { method: 'POST', body: JSON.stringify(data) }),
  updateBus: (id: string, data: Omit<import('../types').Bus, 'id'>) =>
    request<import('../types').Bus>(`/buses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBus: (id: string) =>
    request<{ ok: boolean }>(`/buses/${id}`, { method: 'DELETE' }),

  getCaptains: () => request<import('../types').Captain[]>('/captains'),
  createCaptain: (data: Omit<import('../types').Captain, 'id' | 'busAssigned'>) =>
    request<import('../types').Captain>('/captains', { method: 'POST', body: JSON.stringify(data) }),
  updateCaptain: (id: string, data: Omit<import('../types').Captain, 'id' | 'busAssigned'>) =>
    request<import('../types').Captain>(`/captains/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCaptain: (id: string) =>
    request<{ ok: boolean }>(`/captains/${id}`, { method: 'DELETE' }),

  getTerminals: () => request<import('../types').Terminal[]>('/terminals'),
  createTerminal: (data: Omit<import('../types').Terminal, 'id'>) =>
    request<import('../types').Terminal>('/terminals', { method: 'POST', body: JSON.stringify(data) }),
  updateTerminal: (id: string, data: Omit<import('../types').Terminal, 'id'>) =>
    request<import('../types').Terminal>(`/terminals/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTerminal: (id: string) =>
    request<{ ok: boolean }>(`/terminals/${id}`, { method: 'DELETE' }),

  getTransactions: () => request<import('../types').Transaction[]>('/transactions'),
  createTransaction: (data: Omit<import('../types').Transaction, 'id'>) =>
    request<import('../types').Transaction>('/transactions', { method: 'POST', body: JSON.stringify(data) }),

  getAuditLogs: () => request<import('../types').AuditEntry[]>('/audit-logs'),

  getDashboardStats: () => request<import('../types').DashboardStats>('/dashboard/stats'),
  getRevenue: (year?: number) =>
    request<{ year: number; monthly: import('../types').MonthlyRevenue[] }>(
      `/dashboard/revenue${year ? `?year=${year}` : ''}`,
    ),

  getLiveBuses: () => request<import('../types').LiveBus[]>('/tracking/live'),

  getRouteStops: (routeNumber: string) =>
    request<{
      route: string
      from: string
      to: string
      status: string
      stops: import('../types').RouteStopPoint[]
    }>(`/tracking/routes/${encodeURIComponent(routeNumber)}/stops`),

  getActiveOperations: () => request<import('../types').ActiveOperations>('/operations/active'),
}

export { ApiError }
