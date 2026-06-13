import { useEffect, useState } from 'react'
import { RefreshCw, BusFront, MapPin } from 'lucide-react'
import { api } from '../api/client'
import type { LiveBus, RouteStopPoint } from '../types'
import RwandaMap from '../components/RwandaMap'
import Badge from '../components/shared/Badge'

interface LiveTrackingProps {
  publicView?: boolean
}

export default function LiveTracking({ publicView = false }: LiveTrackingProps) {
  const [buses, setBuses] = useState<LiveBus[]>([])
  const [stops, setStops] = useState<RouteStopPoint[]>([])
  const [selectedRoute, setSelectedRoute] = useState<string>('all')
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const loadBuses = () => {
    api.getLiveBuses()
      .then(setBuses)
      .catch(() => setBuses([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadBuses()
    const t = setInterval(loadBuses, 10000)
    return () => clearInterval(t)
  }, [])

  const routes = [...new Set(buses.map(b => b.route).filter(r => r !== '—'))]

  useEffect(() => {
    if (selectedRoute === 'all') {
      setStops([])
      return
    }
    api.getRouteStops(selectedRoute)
      .then(r => setStops(r.stops))
      .catch(() => setStops([]))
  }, [selectedRoute])

  const filtered = selectedRoute === 'all'
    ? buses
    : buses.filter(b => b.route === selectedRoute)

  const selectedBus = filtered.find(b => b.id === selectedBusId) ?? filtered[0]

  const statusVariant = (s: string): 'success' | 'warning' | 'neutral' => {
    if (s === 'OnRoute') return 'success'
    if (s === 'AtStop') return 'warning'
    return 'neutral'
  }

  return (
    <div className="space-y-5">
      {publicView && (
        <div className="bg-[#0A2558] rounded-2xl p-6 text-white">
          <h2 className="text-xl font-bold">Track Your Bus</h2>
          <p className="text-blue-200/80 text-sm mt-1">
            See where HORIZON Express buses are right now and plan your trip across Rwanda.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={selectedRoute}
          onChange={e => setSelectedRoute(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 bg-white"
        >
          <option value="all">All routes</option>
          {routes.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <button
          onClick={loadBuses}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          <RefreshCw size={14}/> Refresh
        </button>
        <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
          {filtered.length} bus(es) on map
        </span>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-5">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          {loading ? (
            <div className="h-80 flex items-center justify-center text-gray-400 text-sm">Loading map...</div>
          ) : (
            <RwandaMap
              buses={filtered}
              stops={stops}
              selectedBusId={selectedBus?.id}
              onSelectBus={setSelectedBusId}
              height={380}
            />
          )}
        </div>

        <div className="space-y-3">
          {selectedBus && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border-2 border-[#4a6cf7]/20">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-lg font-bold text-gray-800">{selectedBus.regNumber}</div>
                  <div className="text-sm text-gray-500">{selectedBus.route}: {selectedBus.from} → {selectedBus.to}</div>
                </div>
                <Badge
                  label={selectedBus.trackingStatus === 'OnRoute' ? 'On Route' : selectedBus.trackingStatus === 'AtStop' ? 'At Stop' : 'Idle'}
                  variant={statusVariant(selectedBus.trackingStatus)}
                />
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={15} className="text-[#4a6cf7]"/>
                  <span><strong>Current location:</strong> {selectedBus.currentStop}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <BusFront size={15} className="text-amber-600"/>
                  <span><strong>Driver:</strong> {selectedBus.driver}</span>
                </div>
                <div className="text-xs text-gray-400">Last update: {selectedBus.lastUpdate} EAT</div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 font-bold text-sm text-gray-800">
              All active buses
            </div>
            <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
              {filtered.map(bus => (
                <button
                  key={bus.id}
                  type="button"
                  onClick={() => setSelectedBusId(bus.id)}
                  className={`w-full text-left px-4 py-3 hover:bg-blue-50/50 transition-colors ${selectedBus?.id === bus.id ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-gray-800">{bus.regNumber}</span>
                    <span className="text-xs text-[#4a6cf7] font-semibold">{bus.route}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">📍 {bus.currentStop}</div>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-gray-400">No buses on this route right now</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
