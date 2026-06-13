import { prisma } from './prisma.js'

export async function advanceBusPositions() {
  const buses = await prisma.bus.findMany({
    where: { status: { in: ['Active', 'InService'] }, routeId: { not: null } },
    include: { route: { include: { routeStops: { orderBy: { order: 'asc' } } } } },
  })

  for (const bus of buses) {
    if (!bus.route?.routeStops.length) continue

    const stops = bus.route.routeStops
    const nextProgress = (bus.stopProgress + 1) % stops.length
    const stop = stops[nextProgress]

    await prisma.bus.update({
      where: { id: bus.id },
      data: {
        latitude: stop.latitude,
        longitude: stop.longitude,
        currentStop: stop.name,
        stopProgress: nextProgress,
        lastLocationAt: new Date(),
        trackingStatus: nextProgress === 0 || nextProgress === stops.length - 1 ? 'AtStop' : 'OnRoute',
      },
    })
  }
}

export function startTrackingSimulation(intervalMs = 20000) {
  setInterval(() => {
    advanceBusPositions().catch(err => console.error('Tracking simulation error:', err))
  }, intervalMs)
}
