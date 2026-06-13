import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MapPin, BusFront, UserCheck } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { api } from '../api/client'

interface CardProps { icon: React.ReactNode; iconBg: string; value: number; label: string; total: string }

function InsightCard({ icon, iconBg, value, label, total }: CardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          {icon}
        </div>
        <div>
          <div className="text-3xl font-bold text-[#0A2558]">{String(value).padStart(2, '0')}</div>
          <div className="text-sm font-medium text-gray-500 mt-0.5">{label}</div>
        </div>
      </div>
      <div className="bg-amber-50 rounded-lg px-3 py-1.5 text-center text-xs font-semibold text-amber-700">
        {total}
      </div>
    </div>
  )
}

export default function InsightCards() {
  const { t } = useTranslation()
  const { routes, buses } = useApp()
  const [activeWorkers, setActiveWorkers] = useState(0)

  useEffect(() => {
    api.getActiveOperations()
      .then(op => setActiveWorkers(op.stationWorkers.length + op.drivers.length))
      .catch(() => setActiveWorkers(0))
  }, [])

  const activeRoutes   = routes.filter(r => r.status === 'Active').length
  const activeBuses    = buses.filter(b => b.status === 'Active' || b.status === 'In Service').length

  return (
    <div className="grid grid-cols-3 gap-4">
      <InsightCard icon={<MapPin size={26} className="text-[#4a6cf7]" strokeWidth={2}/>} iconBg="bg-[#4a6cf7]/10" value={activeRoutes} label={t('dashboard.activeRoutes')} total={t('dashboard.routesTotal', { count: routes.length })}/>
      <InsightCard icon={<BusFront size={26} className="text-blue-600" strokeWidth={2}/>} iconBg="bg-blue-100" value={activeBuses} label={t('dashboard.activeBuses')} total={t('dashboard.busesInFleet', { count: buses.length })}/>
      <InsightCard icon={<UserCheck size={26} className="text-emerald-600" strokeWidth={2}/>} iconBg="bg-emerald-100" value={activeWorkers} label={t('dashboard.activeWorkers')} total={t('dashboard.workersOnDuty')}/>
    </div>
  )
}
