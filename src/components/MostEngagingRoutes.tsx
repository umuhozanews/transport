import { ArrowRight } from 'lucide-react'
import { useApp } from '../store/AppContext'

const BADGE_COLORS = ['bg-[#0A2558]', 'bg-orange-500', 'bg-emerald-600', 'bg-violet-600']

export default function MostEngagingRoutes() {
  const { routes } = useApp()

  const top4 = [...routes]
    .filter(r => r.status === 'Active')
    .sort((a, b) => b.busesAssigned - a.busesAssigned)
    .slice(0, 4)

  if (top4.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm h-full flex flex-col">
        <h3 className="text-sm font-bold text-gray-700 mb-4">Busiest Routes</h3>
        <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
          No active routes
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm h-full">
      <h3 className="text-sm font-bold text-gray-700 mb-4">Busiest Routes</h3>
      <div className="space-y-3">
        {top4.map((route, i) => (
          <div key={route.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
            <span className={`${BADGE_COLORS[i]} text-white text-xs font-bold px-2 py-1 rounded-md min-w-[42px] text-center`}>
              {route.number}
            </span>
            <span className="text-sm text-gray-700 font-medium flex-1">{route.from}</span>
            <ArrowRight size={13} className="text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-700 font-medium flex-1 text-right">{route.to}</span>
            <span className="text-[10px] font-bold text-gray-400">{route.busesAssigned} bus</span>
          </div>
        ))}
      </div>
    </div>
  )
}
