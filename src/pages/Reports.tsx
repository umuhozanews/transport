import { useMemo } from 'react'
import { Users, BusFront, MapPin } from 'lucide-react'
import { useApp } from '../store/AppContext'

export default function Reports() {
  const { routes, buses, captains } = useApp()

  const activeRoutes = routes.filter(r => r.status === 'Active')
  const activeBuses = buses.filter(b => b.status === 'Active' || b.status === 'In Service')
  const onDutyDrivers = captains.filter(c => c.status === 'On Duty')
  const totalCapacity = activeBuses.reduce((s, b) => s + b.capacity, 0)

  const routeBreakdown = useMemo(() =>
    activeRoutes.map(r => ({
      number: r.number,
      from: r.from,
      to: r.to,
      buses: buses.filter(b => b.route === r.number && (b.status === 'Active' || b.status === 'In Service')).length,
      drivers: captains.filter(c => c.route === r.number && c.status === 'On Duty').length,
      fare: r.fare,
    })).sort((a, b) => b.buses - a.buses),
  [routes, buses, captains, activeRoutes])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <BusFront size={15} className="text-[#4a6cf7]"/>
            <p className="text-xs text-gray-500 font-medium">Active Buses</p>
          </div>
          <p className="text-2xl font-bold text-[#4a6cf7]">{activeBuses.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">{totalCapacity.toLocaleString()} seats total</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={15} className="text-emerald-500"/>
            <p className="text-xs text-gray-500 font-medium">Active Routes</p>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{activeRoutes.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">Across Rwanda</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Users size={15} className="text-amber-500"/>
            <p className="text-xs text-gray-500 font-medium">Drivers On Duty</p>
          </div>
          <p className="text-2xl font-bold text-amber-600">{onDutyDrivers.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">{captains.length} drivers in fleet</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <MapPin size={16} className="text-[#4a6cf7]"/>
          <h3 className="text-sm font-bold text-gray-700">Route Operations Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <th className="px-5 py-3 text-left">Route</th>
                <th className="px-5 py-3 text-left">From → To</th>
                <th className="px-5 py-3 text-center">Buses</th>
                <th className="px-5 py-3 text-center">Drivers</th>
                <th className="px-5 py-3 text-right">Fare (RWF)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {routeBreakdown.map(r => (
                <tr key={r.number} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3 font-bold text-[#0A2558]">{r.number}</td>
                  <td className="px-5 py-3 text-gray-600">{r.from} → {r.to}</td>
                  <td className="px-5 py-3 text-center font-semibold">{r.buses}</td>
                  <td className="px-5 py-3 text-center font-semibold">{r.drivers}</td>
                  <td className="px-5 py-3 text-right text-gray-700">{r.fare.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
