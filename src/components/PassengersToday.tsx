import { useApp } from '../store/AppContext'

function AdultIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="9" r="5" fill="#0A2558"/>
      <path d="M4 26c0-5.523 4.477-10 10-10s10 4.477 10 10" fill="#0A2558" opacity="0.8"/>
    </svg>
  )
}
function ChildIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="7" r="4" fill="#4a6cf7"/>
      <path d="M3 21c0-4.418 3.582-8 8-8s8 3.582 8 8" fill="#4a6cf7" opacity="0.8"/>
    </svg>
  )
}

export default function PassengersToday() {
  const { routes, buses, captains } = useApp()

  const activeBuses = buses.filter(b => b.status === 'Active' || b.status === 'In Service').length
  const activeRoutes = routes.filter(r => r.status === 'Active').length
  const workersOnDuty = captains.filter(c => c.status === 'On Duty').length

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="text-sm font-bold text-gray-700 mb-4">Today's Operations</h3>
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[#0A2558]">{String(activeBuses).padStart(2, '0')}</div>
          <div className="text-xs text-gray-500 mt-1">Buses running</div>
        </div>
        <div className="bg-indigo-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[#4a6cf7]">{String(activeRoutes).padStart(2, '0')}</div>
          <div className="text-xs text-gray-500 mt-1">Active routes</div>
        </div>
        <div className="bg-emerald-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-emerald-700">{String(workersOnDuty).padStart(2, '0')}</div>
          <div className="text-xs text-gray-500 mt-1">Drivers on duty</div>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-[#0A2558]/10 flex items-center justify-center flex-shrink-0">
            <AdultIcon />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Fleet capacity</div>
            <div className="text-2xl font-bold text-gray-800">
              {buses.reduce((s, b) => s + b.capacity, 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">Total seats available</div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-indigo-50 rounded-xl px-4 py-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-[#4a6cf7]/10 flex items-center justify-center flex-shrink-0">
            <ChildIcon />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Stations</div>
            <div className="text-2xl font-bold text-gray-800">{routes.length}</div>
            <div className="text-xs text-gray-400">Routes in network</div>
          </div>
        </div>
      </div>
    </div>
  )
}
