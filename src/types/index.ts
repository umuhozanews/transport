export type PaymentMethod = 'MoMo' | 'Airtel' | 'Cash' | 'Card'
export type TxStatus = 'Success' | 'Pending' | 'Failed'

export interface Transaction {
  id: string
  route: string
  from: string
  to: string
  captain: string
  date: string
  amount: number
  method: PaymentMethod
  status: TxStatus
  passengers: number
}

export type AuditAction = 'Created' | 'Updated' | 'Deleted' | 'Login' | 'Logout' | 'Assigned'
export type AuditModule = 'Route' | 'Bus' | 'Captain' | 'Payment' | 'System' | 'Terminal'

export interface AuditEntry {
  id: string
  timestamp: string
  user: string
  action: AuditAction
  module: AuditModule
  detail: string
}

export type RouteStatus = 'Active' | 'Inactive'

export interface Route {
  id: string
  number: string
  from: string
  to: string
  distance: number
  fare: number
  stops: number
  busesAssigned: number
  status: RouteStatus
}

export type TerminalStatus = 'Online' | 'Offline' | 'Maintenance'

export interface Terminal {
  id: string
  name: string
  location: string
  type: string
  status: TerminalStatus
  lastTx: string
  totalToday: number
  accepts: PaymentMethod[]
}

export type BusStatus = 'Active' | 'In Service' | 'Maintenance' | 'Retired'

export interface Bus {
  id: string
  regNumber: string
  model: string
  capacity: number
  type: string
  route: string
  captain: string
  status: BusStatus
  lastService: string
  totalKm: number
}

export type CaptainStatus = 'On Duty' | 'Off Duty' | 'On Leave'

export interface Captain {
  id: string
  name: string
  phone: string
  license: string
  licenseExpiry: string
  busAssigned: string
  route: string
  rating: number
  experience: number
  status: CaptainStatus
  joinDate: string
}

export interface DashboardStats {
  activeRoutes: number
  totalRoutes: number
  activeBuses: number
  totalBuses: number
  onDutyCaptains: number
  totalCaptains: number
}

export interface MonthlyRevenue {
  month: string
  revenue: number
}

export interface LiveBus {
  id: string
  regNumber: string
  status: string
  route: string
  from: string
  to: string
  driver: string
  latitude: number | null
  longitude: number | null
  currentStop: string
  trackingStatus: string
  lastUpdate: string
}

export interface RouteStopPoint {
  id: string
  name: string
  latitude: number
  longitude: number
  order: number
}

export interface ActiveOperations {
  buses: Array<{
    id: string
    regNumber: string
    route: string
    from: string
    to: string
    driver: string
    status: string
    currentStop: string
    trackingStatus: string
    latitude: number | null
    longitude: number | null
  }>
  stationWorkers: Array<{
    id: string
    name: string
    role: string
    station: string
    title: string
    dutyStatus: string
  }>
  drivers: Array<{
    id: string
    name: string
    route: string
    bus: string
    phone: string
    status: string
  }>
  routes: Array<{
    id: string
    number: string
    from: string
    to: string
    fare: number
    status: string
    busesActive: number
    driversOnDuty: number
  }>
}
