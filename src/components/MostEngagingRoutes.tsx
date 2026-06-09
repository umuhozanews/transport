import { ArrowRight } from 'lucide-react'
import { useApp } from '../store/AppContext'

const BADGE_COLORS = ['bg-[#0A2558]', 'bg-orange-500', 'bg-emerald-600', 'bg-violet-600']

export default function MostEngagingRoutes() {
  const { transactions, routes } = useApp()

  // rank routes by total passengers
  const counts = transactions.reduce<Record<string, number>>((acc, tx) => {
    acc[tx.route] = (acc[tx.route] || 0) + tx.passengers
    return acc
  }, {})

  const top4 = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([num]) => routes.find(r => r.number === num))
    .filter((r): r is NonNullable<typeof r> => Boolean(r))

  if (top4.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm h-full flex flex-col">
        <h3 className="text-sm font-bold text-gray-700 mb-4">Inzira zikoreshwa cyane</h3>
        <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
          Nta makuru y’ingendo arahari kuri ubu
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm h-full">
      <h3 className="text-sm font-bold text-gray-700 mb-4">Inzira zikoreshwa cyane</h3>
      <div className="space-y-3">
        {top4.map((route, i) => (
          <div key={route.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
            <span className={`${BADGE_COLORS[i]} text-white text-xs font-bold px-2 py-1 rounded-md min-w-[42px] text-center`}>
              {route.number}
            </span>
            <span className="text-sm text-gray-700 font-medium flex-1">{route.from}</span>
            <ArrowRight size={13} className="text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-700 font-medium flex-1 text-right">{route.to}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
