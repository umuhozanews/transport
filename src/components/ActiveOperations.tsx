import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '../api/client'
import type { ActiveOperations } from '../types'
import Badge from './shared/Badge'

export default function ActiveOperations() {
  const { t } = useTranslation()
  const label = (s: string) => t(`status.${s}`, { defaultValue: s })
  const [data, setData] = useState<ActiveOperations | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = () => api.getActiveOperations()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))

    load()
    const timer = setInterval(load, 15000)
    return () => clearInterval(timer)
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm text-sm text-gray-400 text-center">
        {t('dashboard.loadingOperations')}
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-500 tracking-wide">{t('dashboard.liveOperations')}</h2>
        <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
          {t('dashboard.updatedLive')}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800">{t('dashboard.activeBusesTitle')}</h3>
            <Badge label={String(data.buses.length)} variant="info" />
          </div>
          <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
            {data.buses.map(b => (
              <div key={b.id} className="px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-gray-800">{b.regNumber}</span>
                  <Badge label={label(b.status)} variant="success" />
                </div>
                <div className="text-xs text-gray-500 mt-1">{b.route} · {b.from} → {b.to}</div>
                <div className="text-xs text-[#4a6cf7] mt-0.5 font-medium">📍 {b.currentStop}</div>
                <div className="text-[10px] text-gray-400">{t('common.driver')}: {b.driver}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800">{t('dashboard.stationWorkers')}</h3>
            <Badge label={String(data.stationWorkers.length)} variant="success" />
          </div>
          <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
            {data.stationWorkers.map(w => (
              <div key={w.id} className="px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-gray-800">{w.name}</span>
                  <Badge label={label(w.dutyStatus)} variant="success" />
                </div>
                <div className="text-xs text-gray-500 mt-1">{w.role}</div>
                <div className="text-xs text-emerald-700 font-medium mt-0.5">🏬 {w.station}</div>
              </div>
            ))}
            {data.drivers.map(d => (
              <div key={d.id} className="px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-gray-800">{d.name}</span>
                  <Badge label={t('dashboard.onRoute')} variant="warning" />
                </div>
                <div className="text-xs text-gray-500 mt-1">{t('common.driver')} · {d.route}</div>
                <div className="text-xs text-amber-700 font-medium mt-0.5">🚌 {d.bus}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800">{t('dashboard.routesInUse')}</h3>
            <Badge label={String(data.routes.length)} variant="info" />
          </div>
          <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
            {data.routes.map(r => (
              <div key={r.id} className="px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-[#0A2558]">{r.number}</span>
                  <Badge label={label('Active')} variant="success" />
                </div>
                <div className="text-xs text-gray-600 mt-1">{r.from} → {r.to}</div>
                <div className="flex gap-3 mt-1.5 text-[10px] text-gray-400">
                  <span>{t('dashboard.busCount', { count: r.busesActive })}</span>
                  <span>{t('dashboard.driverCount', { count: r.driversOnDuty })}</span>
                  <span>RWF {r.fare.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
