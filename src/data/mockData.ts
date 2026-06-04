// ── Transactions ──────────────────────────────────────────────────────────────
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

export const transactions: Transaction[] = [
  { id: 'TXN-001', route: 'KL1', from: 'Kigali', to: 'Musanze', captain: 'Jean Paul Habimana', date: '2024-05-12 08:30', amount: 84000, method: 'MoMo', status: 'Success', passengers: 42 },
  { id: 'TXN-002', route: 'KL2', from: 'Kigali', to: 'Huye', captain: 'Marie Claire Uwimana', date: '2024-05-12 09:15', amount: 96000, method: 'Cash', status: 'Success', passengers: 38 },
  { id: 'TXN-003', route: 'KL3', from: 'Kigali', to: 'Rubavu', captain: 'Emmanuel Nsabimana', date: '2024-05-12 10:00', amount: 138000, method: 'Card', status: 'Success', passengers: 46 },
  { id: 'TXN-004', route: 'KL4', from: 'Kigali', to: 'Rusizi', captain: 'Celestin Ndayisaba', date: '2024-05-12 11:30', amount: 115000, method: 'MoMo', status: 'Pending', passengers: 35 },
  { id: 'TXN-005', route: 'KL1', from: 'Kigali', to: 'Musanze', captain: 'Jean Paul Habimana', date: '2024-05-12 12:00', amount: 90000, method: 'Cash', status: 'Success', passengers: 45 },
  { id: 'TXN-006', route: 'KL2', from: 'Kigali', to: 'Huye', captain: 'Marie Claire Uwimana', date: '2024-05-12 13:45', amount: 20000, method: 'Airtel', status: 'Failed', passengers: 8 },
  { id: 'TXN-007', route: 'KL5', from: 'Kigali', to: 'Rwamagana', captain: 'Patrick Niyonzima', date: '2024-05-12 14:20', amount: 48000, method: 'Card', status: 'Success', passengers: 40 },
  { id: 'TXN-008', route: 'KL4', from: 'Kigali', to: 'Rusizi', captain: 'Celestin Ndayisaba', date: '2024-05-12 15:10', amount: 140000, method: 'MoMo', status: 'Success', passengers: 44 },
  { id: 'TXN-009', route: 'KL1', from: 'Kigali', to: 'Musanze', captain: 'Jean Paul Habimana', date: '2024-05-12 16:00', amount: 82000, method: 'Cash', status: 'Success', passengers: 41 },
  { id: 'TXN-010', route: 'KL5', from: 'Kigali', to: 'Rwamagana', captain: 'Patrick Niyonzima', date: '2024-05-12 17:30', amount: 45000, method: 'Airtel', status: 'Pending', passengers: 37 },
  { id: 'TXN-011', route: 'KL3', from: 'Kigali', to: 'Rubavu', captain: 'Emmanuel Nsabimana', date: '2024-05-12 18:00', amount: 132000, method: 'MoMo', status: 'Success', passengers: 44 },
  { id: 'TXN-012', route: 'KL2', from: 'Kigali', to: 'Huye', captain: 'Marie Claire Uwimana', date: '2024-05-12 19:15', amount: 100000, method: 'Cash', status: 'Success', passengers: 40 },
]

// ── Audit Log ─────────────────────────────────────────────────────────────────
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

export const auditLogs: AuditEntry[] = [
  { id: 'A001', timestamp: '2024-05-12 08:01', user: 'Mugisha Eric', action: 'Login', module: 'System', detail: 'Admin logged in — Nyabugogo Office, Kigali' },
  { id: 'A002', timestamp: '2024-05-12 08:15', user: 'Mugisha Eric', action: 'Created', module: 'Route', detail: 'New route KL6 — Kigali to Nyagatare added' },
  { id: 'A003', timestamp: '2024-05-12 08:45', user: 'Mugisha Eric', action: 'Assigned', module: 'Captain', detail: 'Jean Paul Habimana assigned to bus RAA 001 A' },
  { id: 'A004', timestamp: '2024-05-12 09:10', user: 'Jean Paul Habimana', action: 'Login', module: 'System', detail: 'Captain signed in via HORIZON Express mobile app' },
  { id: 'A005', timestamp: '2024-05-12 10:30', user: 'Mugisha Eric', action: 'Updated', module: 'Bus', detail: 'Bus RAB 234 B — capacity updated to 48 seats' },
  { id: 'A006', timestamp: '2024-05-12 11:00', user: 'Mugisha Eric', action: 'Created', module: 'Terminal', detail: 'MoMo terminal HT-04 added at Musanze Bus Park' },
  { id: 'A007', timestamp: '2024-05-12 12:30', user: 'Mugisha Eric', action: 'Updated', module: 'Route', detail: 'Route KL1 fare updated: RWF 1,800 → RWF 2,000' },
  { id: 'A008', timestamp: '2024-05-12 13:45', user: 'Marie Claire Uwimana', action: 'Login', module: 'System', detail: 'Captain signed in via HORIZON Express mobile app' },
  { id: 'A009', timestamp: '2024-05-12 14:20', user: 'Mugisha Eric', action: 'Deleted', module: 'Route', detail: 'Inactive route KL7 (Kigali–Muhanga) removed' },
  { id: 'A010', timestamp: '2024-05-12 15:00', user: 'Mugisha Eric', action: 'Updated', module: 'Payment', detail: 'MTN MoMo merchant code updated — Nyabugogo Main' },
  { id: 'A011', timestamp: '2024-05-12 16:30', user: 'Patrick Niyonzima', action: 'Logout', module: 'System', detail: 'Captain session ended — Rwamagana depot' },
  { id: 'A012', timestamp: '2024-05-12 17:45', user: 'Mugisha Eric', action: 'Assigned', module: 'Bus', detail: 'Bus RAC 456 C assigned to route KL3 (Kigali–Rubavu)' },
]

// ── Routes ────────────────────────────────────────────────────────────────────
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

export const routes: Route[] = [
  { id: 'R1', number: 'KL1', from: 'Kigali', to: 'Musanze', distance: 110, fare: 2000, stops: 5, busesAssigned: 3, status: 'Active' },
  { id: 'R2', number: 'KL2', from: 'Kigali', to: 'Huye', distance: 134, fare: 2500, stops: 6, busesAssigned: 2, status: 'Active' },
  { id: 'R3', number: 'KL3', from: 'Kigali', to: 'Rubavu', distance: 157, fare: 3000, stops: 7, busesAssigned: 2, status: 'Active' },
  { id: 'R4', number: 'KL4', from: 'Kigali', to: 'Rusizi', distance: 225, fare: 4000, stops: 9, busesAssigned: 2, status: 'Active' },
  { id: 'R5', number: 'KL5', from: 'Kigali', to: 'Rwamagana', distance: 58, fare: 1200, stops: 3, busesAssigned: 1, status: 'Active' },
  { id: 'R6', number: 'KL6', from: 'Kigali', to: 'Nyagatare', distance: 108, fare: 2000, stops: 5, busesAssigned: 1, status: 'Active' },
  { id: 'R7', number: 'KL7', from: 'Kigali', to: 'Muhanga', distance: 40, fare: 800, stops: 2, busesAssigned: 1, status: 'Active' },
  { id: 'R8', number: 'KL8', from: 'Musanze', to: 'Rubavu', distance: 75, fare: 1500, stops: 4, busesAssigned: 0, status: 'Inactive' },
  { id: 'R9', number: 'KL9', from: 'Huye', to: 'Rusizi', distance: 93, fare: 1800, stops: 4, busesAssigned: 0, status: 'Inactive' },
]

// ── Payment Terminals ─────────────────────────────────────────────────────────
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

export const terminals: Terminal[] = [
  { id: 'HT-01', name: 'Nyabugogo Main', location: 'Nyabugogo, Kigali', type: 'Fixed POS', status: 'Online', lastTx: '2024-05-12 19:10', totalToday: 480000, accepts: ['MoMo', 'Card', 'Cash'] },
  { id: 'HT-02', name: 'Musanze Bus Park', location: 'Musanze City', type: 'Fixed POS', status: 'Online', lastTx: '2024-05-12 18:55', totalToday: 320000, accepts: ['MoMo', 'Airtel'] },
  { id: 'HT-03', name: 'Rubavu Terminal', location: 'Rubavu (Gisenyi)', type: 'Mobile POS', status: 'Online', lastTx: '2024-05-12 17:30', totalToday: 290000, accepts: ['MoMo', 'Cash'] },
  { id: 'HT-04', name: 'Kigali Remera', location: 'Remera, Kigali', type: 'Fixed POS', status: 'Maintenance', lastTx: '2024-05-11 20:00', totalToday: 0, accepts: ['MoMo', 'Card', 'Cash'] },
  { id: 'HT-05', name: 'Huye Bus Terminal', location: 'Huye (Butare)', type: 'Mobile POS', status: 'Online', lastTx: '2024-05-12 19:05', totalToday: 175000, accepts: ['Airtel', 'MoMo'] },
  { id: 'HT-06', name: 'Rusizi Border', location: 'Rusizi (Cyangugu)', type: 'Fixed POS', status: 'Offline', lastTx: '2024-05-10 09:00', totalToday: 0, accepts: ['Cash'] },
]

// ── Buses ─────────────────────────────────────────────────────────────────────
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

export const buses: Bus[] = [
  { id: 'B1', regNumber: 'RAA 001 A', model: 'Yutong ZK6122', capacity: 46, type: 'AC Coach', route: 'KL1', captain: 'Jean Paul Habimana', status: 'Active', lastService: '2024-04-10', totalKm: 82400 },
  { id: 'B2', regNumber: 'RAB 234 B', model: 'Higer KLQ6119', capacity: 48, type: 'AC Coach', route: 'KL2', captain: 'Marie Claire Uwimana', status: 'Active', lastService: '2024-03-25', totalKm: 61500 },
  { id: 'B3', regNumber: 'RAC 456 C', model: 'Yutong ZK6122', capacity: 46, type: 'AC Coach', route: 'KL3', captain: 'Emmanuel Nsabimana', status: 'Active', lastService: '2024-05-01', totalKm: 47300 },
  { id: 'B4', regNumber: 'RAD 789 D', model: 'Golden Dragon XML6112', capacity: 52, type: 'Standard', route: 'KL4', captain: 'Celestin Ndayisaba', status: 'Active', lastService: '2024-04-20', totalKm: 120000 },
  { id: 'B5', regNumber: 'RAE 012 E', model: 'Higer KLQ6119', capacity: 48, type: 'AC Coach', route: 'KL2', captain: 'Jeannette Mukamana', status: 'Active', lastService: '2024-04-05', totalKm: 75600 },
  { id: 'B6', regNumber: 'RAF 345 F', model: 'Yutong ZK6122', capacity: 46, type: 'AC Coach', route: 'KL5', captain: 'Patrick Niyonzima', status: 'In Service', lastService: '2024-05-10', totalKm: 36800 },
  { id: 'B7', regNumber: 'RAG 678 G', model: 'Golden Dragon XML6112', capacity: 52, type: 'Standard', route: 'KL6', captain: 'Alice Mukandayisenga', status: 'Active', lastService: '2024-03-15', totalKm: 58200 },
  { id: 'B8', regNumber: 'RAH 901 H', model: 'Yutong ZK6122', capacity: 46, type: 'AC Coach', route: '—', captain: '—', status: 'Maintenance', lastService: '2024-02-28', totalKm: 210000 },
  { id: 'B9', regNumber: 'RAI 123 I', model: 'Higer KLQ6119', capacity: 48, type: 'Standard', route: '—', captain: '—', status: 'Retired', lastService: '2023-11-10', totalKm: 420000 },
]

// ── Captains ──────────────────────────────────────────────────────────────────
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

export const captains: Captain[] = [
  { id: 'C1', name: 'Jean Paul Habimana', phone: '+250 788 111 001', license: 'RWA-DR-2015-0001', licenseExpiry: '2028-03-10', busAssigned: 'RAA 001 A', route: 'KL1', rating: 4.8, experience: 12, status: 'On Duty', joinDate: '2018-06-01' },
  { id: 'C2', name: 'Marie Claire Uwimana', phone: '+250 788 222 002', license: 'RWA-DR-2016-0002', licenseExpiry: '2027-08-22', busAssigned: 'RAB 234 B', route: 'KL2', rating: 4.9, experience: 9, status: 'On Duty', joinDate: '2019-01-15' },
  { id: 'C3', name: 'Emmanuel Nsabimana', phone: '+250 788 333 003', license: 'RWA-DR-2017-0003', licenseExpiry: '2026-11-30', busAssigned: 'RAC 456 C', route: 'KL3', rating: 4.7, experience: 7, status: 'On Duty', joinDate: '2020-03-10' },
  { id: 'C4', name: 'Celestin Ndayisaba', phone: '+250 788 444 004', license: 'RWA-DR-2014-0004', licenseExpiry: '2029-02-14', busAssigned: 'RAD 789 D', route: 'KL4', rating: 4.5, experience: 14, status: 'On Duty', joinDate: '2017-09-01' },
  { id: 'C5', name: 'Jeannette Mukamana', phone: '+250 788 555 005', license: 'RWA-DR-2018-0005', licenseExpiry: '2027-06-01', busAssigned: 'RAE 012 E', route: 'KL2', rating: 4.6, experience: 6, status: 'On Duty', joinDate: '2021-02-20' },
  { id: 'C6', name: 'Patrick Niyonzima', phone: '+250 788 666 006', license: 'RWA-DR-2019-0006', licenseExpiry: '2026-09-15', busAssigned: 'RAF 345 F', route: 'KL5', rating: 4.8, experience: 5, status: 'On Duty', joinDate: '2021-07-01' },
  { id: 'C7', name: 'Alice Mukandayisenga', phone: '+250 788 777 007', license: 'RWA-DR-2016-0007', licenseExpiry: '2028-01-20', busAssigned: 'RAG 678 G', route: 'KL6', rating: 4.7, experience: 10, status: 'On Duty', joinDate: '2019-05-15' },
  { id: 'C8', name: 'Claude Bizimana', phone: '+250 788 888 008', license: 'RWA-DR-2015-0008', licenseExpiry: '2025-12-01', busAssigned: '—', route: '—', rating: 4.3, experience: 8, status: 'On Leave', joinDate: '2020-11-01' },
  { id: 'C9', name: 'Francine Uwitonze', phone: '+250 788 999 009', license: 'RWA-DR-2020-0009', licenseExpiry: '2027-04-10', busAssigned: '—', route: '—', rating: 4.6, experience: 4, status: 'Off Duty', joinDate: '2022-01-10' },
]
