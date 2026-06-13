import type { LiveBus, RouteStopPoint } from '../types'

const LNG_MIN = 28.85
const LNG_MAX = 30.90
const LAT_NORTH = -1.05
const LAT_SOUTH = -2.84

export function toMapCoords(lat: number, lng: number) {
  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * 100
  const y = ((LAT_NORTH - lat) / (LAT_NORTH - LAT_SOUTH)) * 100
  return { x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) }
}

interface RwandaMapProps {
  buses: LiveBus[]
  stops?: RouteStopPoint[]
  selectedBusId?: string | null
  onSelectBus?: (id: string) => void
  height?: number
}

export default function RwandaMap({ buses, stops = [], selectedBusId, onSelectBus, height = 320 }: RwandaMapProps) {
  const plottedBuses = buses.filter(b => b.latitude != null && b.longitude != null)

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-gradient-to-br from-slate-100 to-blue-50" style={{ height }}>
      <div className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="absolute top-3 left-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Rwanda · Live</div>

      {stops.map(stop => {
        const { x, y } = toMapCoords(stop.latitude, stop.longitude)
        return (
          <div
            key={stop.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-slate-400 border border-white shadow-sm"/>
            <div className="text-[9px] text-slate-500 mt-0.5 whitespace-nowrap max-w-[80px] truncate">{stop.name}</div>
          </div>
        )
      })}

      {plottedBuses.map(bus => {
        const { x, y } = toMapCoords(bus.latitude!, bus.longitude!)
        const selected = selectedBusId === bus.id
        return (
          <button
            key={bus.id}
            type="button"
            onClick={() => onSelectBus?.(bus.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div className={`relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 border-white transition-transform ${selected ? 'bg-[#0A2558] scale-110' : 'bg-[#4a6cf7] group-hover:scale-105'}`}>
              <span className="text-white text-[10px] font-bold">🚌</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white animate-pulse"/>
            </div>
            <div className={`mt-1 text-[10px] font-bold whitespace-nowrap ${selected ? 'text-[#0A2558]' : 'text-slate-600'}`}>
              {bus.regNumber}
            </div>
          </button>
        )
      })}

      {plottedBuses.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400">
          No buses broadcasting location yet
        </div>
      )}
    </div>
  )
}
