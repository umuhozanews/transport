import bcrypt from 'bcryptjs'
import {
  PrismaClient,
  type PaymentMethod,
  type BusStatus,
  type CaptainStatus,
  type TerminalStatus,
  type TxStatus,
} from '@prisma/client'

const prisma = new PrismaClient()

const routes = [
  { number: 'KL1', from: 'Kigali', to: 'Musanze', distance: 110, fare: 2000, stops: 5, status: 'Active' as const },
  { number: 'KL2', from: 'Kigali', to: 'Huye', distance: 134, fare: 2500, stops: 6, status: 'Active' as const },
  { number: 'KL3', from: 'Kigali', to: 'Rubavu', distance: 157, fare: 3000, stops: 7, status: 'Active' as const },
  { number: 'KL4', from: 'Kigali', to: 'Rusizi', distance: 225, fare: 4000, stops: 9, status: 'Active' as const },
  { number: 'KL5', from: 'Kigali', to: 'Rwamagana', distance: 58, fare: 1200, stops: 3, status: 'Active' as const },
  { number: 'KL6', from: 'Kigali', to: 'Nyagatare', distance: 108, fare: 2000, stops: 5, status: 'Active' as const },
  { number: 'KL7', from: 'Kigali', to: 'Muhanga', distance: 40, fare: 800, stops: 2, status: 'Active' as const },
  { number: 'KL8', from: 'Musanze', to: 'Rubavu', distance: 75, fare: 1500, stops: 4, status: 'Inactive' as const },
  { number: 'KL9', from: 'Huye', to: 'Rusizi', distance: 93, fare: 1800, stops: 4, status: 'Inactive' as const },
]

const captains = [
  { name: 'Jean Paul Habimana', phone: '+250 788 111 001', license: 'RWA-DR-2015-0001', licenseExpiry: '2028-03-10', route: 'KL1', rating: 4.8, experience: 12, status: 'OnDuty' as CaptainStatus, joinDate: '2018-06-01' },
  { name: 'Marie Claire Uwimana', phone: '+250 788 222 002', license: 'RWA-DR-2016-0002', licenseExpiry: '2027-08-22', route: 'KL2', rating: 4.9, experience: 9, status: 'OnDuty' as CaptainStatus, joinDate: '2019-01-15' },
  { name: 'Emmanuel Nsabimana', phone: '+250 788 333 003', license: 'RWA-DR-2017-0003', licenseExpiry: '2026-11-30', route: 'KL3', rating: 4.7, experience: 7, status: 'OnDuty' as CaptainStatus, joinDate: '2020-03-10' },
  { name: 'Celestin Ndayisaba', phone: '+250 788 444 004', license: 'RWA-DR-2014-0004', licenseExpiry: '2029-02-14', route: 'KL4', rating: 4.5, experience: 14, status: 'OnDuty' as CaptainStatus, joinDate: '2017-09-01' },
  { name: 'Jeannette Mukamana', phone: '+250 788 555 005', license: 'RWA-DR-2018-0005', licenseExpiry: '2027-06-01', route: 'KL2', rating: 4.6, experience: 6, status: 'OnDuty' as CaptainStatus, joinDate: '2021-02-20' },
  { name: 'Patrick Niyonzima', phone: '+250 788 666 006', license: 'RWA-DR-2019-0006', licenseExpiry: '2026-09-15', route: 'KL5', rating: 4.8, experience: 5, status: 'OnDuty' as CaptainStatus, joinDate: '2021-07-01' },
  { name: 'Alice Mukandayisenga', phone: '+250 788 777 007', license: 'RWA-DR-2016-0007', licenseExpiry: '2028-01-20', route: 'KL6', rating: 4.7, experience: 10, status: 'OnDuty' as CaptainStatus, joinDate: '2019-05-15' },
  { name: 'Claude Bizimana', phone: '+250 788 888 008', license: 'RWA-DR-2015-0008', licenseExpiry: '2025-12-01', route: null, rating: 4.3, experience: 8, status: 'OnLeave' as CaptainStatus, joinDate: '2020-11-01' },
  { name: 'Francine Uwitonze', phone: '+250 788 999 009', license: 'RWA-DR-2020-0009', licenseExpiry: '2027-04-10', route: null, rating: 4.6, experience: 4, status: 'OffDuty' as CaptainStatus, joinDate: '2022-01-10' },
]

const buses = [
  { regNumber: 'RAA 001 A', model: 'Yutong ZK6122', capacity: 46, type: 'AC Coach', route: 'KL1', captain: 'Jean Paul Habimana', status: 'Active' as BusStatus, lastService: '2024-04-10', totalKm: 82400 },
  { regNumber: 'RAB 234 B', model: 'Higer KLQ6119', capacity: 48, type: 'AC Coach', route: 'KL2', captain: 'Marie Claire Uwimana', status: 'Active' as BusStatus, lastService: '2024-03-25', totalKm: 61500 },
  { regNumber: 'RAC 456 C', model: 'Yutong ZK6122', capacity: 46, type: 'AC Coach', route: 'KL3', captain: 'Emmanuel Nsabimana', status: 'Active' as BusStatus, lastService: '2024-05-01', totalKm: 47300 },
  { regNumber: 'RAD 789 D', model: 'Golden Dragon XML6112', capacity: 52, type: 'Standard', route: 'KL4', captain: 'Celestin Ndayisaba', status: 'Active' as BusStatus, lastService: '2024-04-20', totalKm: 120000 },
  { regNumber: 'RAE 012 E', model: 'Higer KLQ6119', capacity: 48, type: 'AC Coach', route: 'KL2', captain: 'Jeannette Mukamana', status: 'Active' as BusStatus, lastService: '2024-04-05', totalKm: 75600 },
  { regNumber: 'RAF 345 F', model: 'Yutong ZK6122', capacity: 46, type: 'AC Coach', route: 'KL5', captain: 'Patrick Niyonzima', status: 'InService' as BusStatus, lastService: '2024-05-10', totalKm: 36800 },
  { regNumber: 'RAG 678 G', model: 'Golden Dragon XML6112', capacity: 52, type: 'Standard', route: 'KL6', captain: 'Alice Mukandayisenga', status: 'Active' as BusStatus, lastService: '2024-03-15', totalKm: 58200 },
  { regNumber: 'RAH 901 H', model: 'Yutong ZK6122', capacity: 46, type: 'AC Coach', route: null, captain: null, status: 'Maintenance' as BusStatus, lastService: '2024-02-28', totalKm: 210000 },
  { regNumber: 'RAI 123 I', model: 'Higer KLQ6119', capacity: 48, type: 'Standard', route: null, captain: null, status: 'Retired' as BusStatus, lastService: '2023-11-10', totalKm: 420000 },
]

const terminals = [
  { id: 'HT-01', name: 'Nyabugogo Main', location: 'Nyabugogo, Kigali', type: 'Fixed POS', status: 'Online' as TerminalStatus, lastTx: '2024-05-12 19:10', totalToday: 480000, accepts: ['MoMo', 'Card', 'Cash'] as PaymentMethod[] },
  { id: 'HT-02', name: 'Musanze Bus Park', location: 'Musanze City', type: 'Fixed POS', status: 'Online' as TerminalStatus, lastTx: '2024-05-12 18:55', totalToday: 320000, accepts: ['MoMo', 'Airtel'] as PaymentMethod[] },
  { id: 'HT-03', name: 'Rubavu Terminal', location: 'Rubavu (Gisenyi)', type: 'Mobile POS', status: 'Online' as TerminalStatus, lastTx: '2024-05-12 17:30', totalToday: 290000, accepts: ['MoMo', 'Cash'] as PaymentMethod[] },
  { id: 'HT-04', name: 'Kigali Remera', location: 'Remera, Kigali', type: 'Fixed POS', status: 'Maintenance' as TerminalStatus, lastTx: '2024-05-11 20:00', totalToday: 0, accepts: ['MoMo', 'Card', 'Cash'] as PaymentMethod[] },
  { id: 'HT-05', name: 'Huye Bus Terminal', location: 'Huye (Butare)', type: 'Mobile POS', status: 'Online' as TerminalStatus, lastTx: '2024-05-12 19:05', totalToday: 175000, accepts: ['Airtel', 'MoMo'] as PaymentMethod[] },
  { id: 'HT-06', name: 'Rusizi Border', location: 'Rusizi (Cyangugu)', type: 'Fixed POS', status: 'Offline' as TerminalStatus, lastTx: '2024-05-10 09:00', totalToday: 0, accepts: ['Cash'] as PaymentMethod[] },
]

const transactions = [
  { route: 'KL1', from: 'Kigali', to: 'Musanze', captain: 'Jean Paul Habimana', date: '2024-05-12 08:30', amount: 84000, method: 'MoMo' as PaymentMethod, status: 'Success' as TxStatus, passengers: 42 },
  { route: 'KL2', from: 'Kigali', to: 'Huye', captain: 'Marie Claire Uwimana', date: '2024-05-12 09:15', amount: 96000, method: 'Cash' as PaymentMethod, status: 'Success' as TxStatus, passengers: 38 },
  { route: 'KL3', from: 'Kigali', to: 'Rubavu', captain: 'Emmanuel Nsabimana', date: '2024-05-12 10:00', amount: 138000, method: 'Card' as PaymentMethod, status: 'Success' as TxStatus, passengers: 46 },
  { route: 'KL4', from: 'Kigali', to: 'Rusizi', captain: 'Celestin Ndayisaba', date: '2024-05-12 11:30', amount: 115000, method: 'MoMo' as PaymentMethod, status: 'Pending' as TxStatus, passengers: 35 },
  { route: 'KL1', from: 'Kigali', to: 'Musanze', captain: 'Jean Paul Habimana', date: '2024-05-12 12:00', amount: 90000, method: 'Cash' as PaymentMethod, status: 'Success' as TxStatus, passengers: 45 },
  { route: 'KL2', from: 'Kigali', to: 'Huye', captain: 'Marie Claire Uwimana', date: '2024-05-12 13:45', amount: 20000, method: 'Airtel' as PaymentMethod, status: 'Failed' as TxStatus, passengers: 8 },
  { route: 'KL5', from: 'Kigali', to: 'Rwamagana', captain: 'Patrick Niyonzima', date: '2024-05-12 14:20', amount: 48000, method: 'Card' as PaymentMethod, status: 'Success' as TxStatus, passengers: 40 },
  { route: 'KL4', from: 'Kigali', to: 'Rusizi', captain: 'Celestin Ndayisaba', date: '2024-05-12 15:10', amount: 140000, method: 'MoMo' as PaymentMethod, status: 'Success' as TxStatus, passengers: 44 },
  { route: 'KL1', from: 'Kigali', to: 'Musanze', captain: 'Jean Paul Habimana', date: '2024-05-12 16:00', amount: 82000, method: 'Cash' as PaymentMethod, status: 'Success' as TxStatus, passengers: 41 },
  { route: 'KL5', from: 'Kigali', to: 'Rwamagana', captain: 'Patrick Niyonzima', date: '2024-05-12 17:30', amount: 45000, method: 'Airtel' as PaymentMethod, status: 'Pending' as TxStatus, passengers: 37 },
  { route: 'KL3', from: 'Kigali', to: 'Rubavu', captain: 'Emmanuel Nsabimana', date: '2024-05-12 18:00', amount: 132000, method: 'MoMo' as PaymentMethod, status: 'Success' as TxStatus, passengers: 44 },
  { route: 'KL2', from: 'Kigali', to: 'Huye', captain: 'Marie Claire Uwimana', date: '2024-05-12 19:15', amount: 100000, method: 'Cash' as PaymentMethod, status: 'Success' as TxStatus, passengers: 40 },
]

const users = [
  { name: 'Mugisha Eric', email: 'admin@horizon.rw', password: 'Admin@2024', role: 'admin' as const, title: 'Operations Manager — Head Office', station: 'Nyabugogo, Kigali', captainName: null },
  { name: 'Keza Aline', email: 'keza@horizon.rw', password: 'Keza@2024', role: 'agent' as const, title: 'Station Worker — Ticketing', station: 'Nyabugogo, Kigali', captainName: null },
  { name: 'Irakoze John', email: 'irakoze@horizon.rw', password: 'John@2024', role: 'agent' as const, title: 'Station Worker — Ticketing', station: 'Musanze Bus Park', captainName: null },
  { name: 'Jean Paul Habimana', email: 'jp@horizon.rw', password: 'JP@2024', role: 'captain' as const, title: 'Driver — KL1 (Kigali→Musanze)', station: null, captainName: 'Jean Paul Habimana' },
  { name: 'Marie Claire Uwimana', email: 'mc@horizon.rw', password: 'MC@2024', role: 'captain' as const, title: 'Driver — KL2 (Kigali→Huye)', station: null, captainName: 'Marie Claire Uwimana' },
  { name: 'Patrick Niyonzima', email: 'patrick@horizon.rw', password: 'Pat@2024', role: 'captain' as const, title: 'Driver — KL5 (Kigali→Rwamagana)', station: null, captainName: 'Patrick Niyonzima' },
]

// Stops along active routes (lat/lng for Rwanda)
const routeStopsData: Record<string, { name: string; latitude: number; longitude: number; order: number }[]> = {
  KL1: [
    { name: 'Nyabugogo, Kigali', latitude: -1.9441, longitude: 30.0619, order: 0 },
    { name: 'Kabuye', latitude: -1.8500, longitude: 30.0500, order: 1 },
    { name: 'Rulindo', latitude: -1.7500, longitude: 29.9500, order: 2 },
    { name: 'Gicumbi', latitude: -1.5800, longitude: 30.0700, order: 3 },
    { name: 'Musanze', latitude: -1.4992, longitude: 29.6344, order: 4 },
  ],
  KL2: [
    { name: 'Nyabugogo, Kigali', latitude: -1.9441, longitude: 30.0619, order: 0 },
    { name: 'Muhanga', latitude: -2.0764, longitude: 29.7556, order: 1 },
    { name: 'Ruhango', latitude: -2.2300, longitude: 29.7500, order: 2 },
    { name: 'Huye', latitude: -2.5967, longitude: 29.7378, order: 3 },
  ],
  KL3: [
    { name: 'Nyabugogo, Kigali', latitude: -1.9441, longitude: 30.0619, order: 0 },
    { name: 'Muhanga', latitude: -2.0764, longitude: 29.7556, order: 1 },
    { name: 'Rubavu', latitude: -1.6936, longitude: 29.2564, order: 2 },
  ],
  KL4: [
    { name: 'Nyabugogo, Kigali', latitude: -1.9441, longitude: 30.0619, order: 0 },
    { name: 'Muhanga', latitude: -2.0764, longitude: 29.7556, order: 1 },
    { name: 'Huye', latitude: -2.5967, longitude: 29.7378, order: 2 },
    { name: 'Rusizi', latitude: -2.4844, longitude: 28.9065, order: 3 },
  ],
  KL5: [
    { name: 'Nyabugogo, Kigali', latitude: -1.9441, longitude: 30.0619, order: 0 },
    { name: 'Rwamagana', latitude: -1.9497, longitude: 30.4346, order: 1 },
  ],
  KL6: [
    { name: 'Nyabugogo, Kigali', latitude: -1.9441, longitude: 30.0619, order: 0 },
    { name: 'Nyagatare', latitude: -1.2974, longitude: 30.3265, order: 1 },
  ],
}

function parseKigaliDate(dateStr: string): Date {
  return new Date(dateStr.replace(' ', 'T') + ':00+02:00')
}

async function main() {
  console.log('Clearing existing data...')
  await prisma.auditLog.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.user.deleteMany()
  await prisma.bus.deleteMany()
  await prisma.captain.deleteMany()
  await prisma.terminal.deleteMany()
  await prisma.route.deleteMany()

  console.log('Seeding routes...')
  const routeMap = new Map<string, string>()
  for (const route of routes) {
    const created = await prisma.route.create({ data: route })
    routeMap.set(route.number, created.id)
  }

  console.log('Seeding route stops...')
  for (const [routeNum, stops] of Object.entries(routeStopsData)) {
    const routeId = routeMap.get(routeNum)
    if (!routeId) continue
    for (const stop of stops) {
      await prisma.routeStop.create({
        data: {
          routeId,
          name: stop.name,
          latitude: stop.latitude,
          longitude: stop.longitude,
          order: stop.order,
        },
      })
    }
  }

  console.log('Seeding captains...')
  const captainMap = new Map<string, string>()
  for (const captain of captains) {
    const created = await prisma.captain.create({
      data: {
        name: captain.name,
        phone: captain.phone,
        license: captain.license,
        licenseExpiry: new Date(captain.licenseExpiry),
        routeId: captain.route ? routeMap.get(captain.route) : null,
        rating: captain.rating,
        experience: captain.experience,
        status: captain.status,
        joinDate: new Date(captain.joinDate),
      },
    })
    captainMap.set(captain.name, created.id)
  }

  console.log('Seeding buses...')
  for (const bus of buses) {
    const routeId = bus.route ? routeMap.get(bus.route) : null
    let trackingData: Record<string, unknown> = {}
    if (routeId && bus.route && routeStopsData[bus.route]?.[0]) {
      const first = routeStopsData[bus.route][0]
      const isRunning = bus.status === 'Active' || bus.status === 'InService'
      trackingData = isRunning ? {
        latitude: first.latitude,
        longitude: first.longitude,
        currentStop: first.name,
        lastLocationAt: new Date(),
        trackingStatus: 'AtStop',
        stopProgress: 0,
      } : {}
    }

    await prisma.bus.create({
      data: {
        regNumber: bus.regNumber,
        model: bus.model,
        capacity: bus.capacity,
        type: bus.type,
        routeId,
        captainId: bus.captain ? captainMap.get(bus.captain) : null,
        status: bus.status,
        lastService: new Date(bus.lastService),
        totalKm: bus.totalKm,
        ...trackingData,
      },
    })
  }

  console.log('Seeding terminals...')
  for (const terminal of terminals) {
    await prisma.terminal.create({
      data: {
        id: terminal.id,
        name: terminal.name,
        location: terminal.location,
        type: terminal.type,
        status: terminal.status,
        lastTx: parseKigaliDate(terminal.lastTx),
        totalToday: terminal.totalToday,
        accepts: terminal.accepts,
      },
    })
  }

  console.log('Seeding transactions...')
  for (const tx of transactions) {
    await prisma.transaction.create({
      data: {
        routeNumber: tx.route,
        from: tx.from,
        to: tx.to,
        captainName: tx.captain,
        routeId: routeMap.get(tx.route),
        captainId: captainMap.get(tx.captain),
        date: parseKigaliDate(tx.date),
        amount: tx.amount,
        method: tx.method,
        status: tx.status,
        passengers: tx.passengers,
      },
    })
  }

  console.log('Seeding users...')
  for (const user of users) {
    const hash = await bcrypt.hash(user.password, 10)
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hash,
        role: user.role,
        title: user.title,
        station: user.station,
        dutyStatus: 'OnDuty',
        captainId: user.captainName ? captainMap.get(user.captainName) : null,
      },
    })
  }

  console.log('Seed complete.')
}

main()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
