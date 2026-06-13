import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { type AuditAction, type AuditModule } from '../types'
import Badge from '../components/shared/Badge'

const actionVariant: Record<AuditAction,'success'|'info'|'danger'|'neutral'|'warning'|'navy'> = {
  Created:'success', Updated:'info', Deleted:'danger', Login:'neutral', Logout:'neutral', Assigned:'warning',
}
const moduleColors: Record<AuditModule, string> = {
  Route:'bg-purple-100 text-purple-700', Bus:'bg-blue-100 text-blue-700',
  Captain:'bg-amber-100 text-amber-700', Payment:'bg-emerald-100 text-emerald-700',
  System:'bg-gray-100 text-gray-600', Terminal:'bg-indigo-100 text-indigo-700',
}

export default function AuditLog() {
  const { t } = useTranslation()
  const label = (s: string) => t(`status.${s}`, { defaultValue: s })
  const moduleLabel = (m: string) => t(`modules.${m}`, { defaultValue: m })
  const { auditLogs } = useApp()
  const [search, setSearch] = useState('')
  const [filterModule, setFilterModule] = useState<AuditModule|'All'>('All')
  const [filterAction, setFilterAction] = useState<AuditAction|'All'>('All')

  const filtered = useMemo(() => auditLogs.filter(log => {
    const q = search.toLowerCase()
    return (
      (log.user.toLowerCase().includes(q) || log.detail.toLowerCase().includes(q)) &&
      (filterModule==='All' || log.module===filterModule) &&
      (filterAction==='All' || log.action===filterAction)
    )
  }), [auditLogs, search, filterModule, filterAction])

  const cols = ['#', t('audit.colTime'), t('audit.colUser'), t('audit.colAction'), t('audit.colModule'), t('audit.colDetail')]

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t('audit.totalActions'), value: auditLogs.length, color: 'text-[#4a6cf7]' },
          { label: t('audit.adminActions'), value: auditLogs.filter(l => l.user === 'Mugisha Eric').length, color: 'text-emerald-600' },
          { label: t('audit.systemActions'), value: auditLogs.filter(l => l.module === 'System').length, color: 'text-amber-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-wrap gap-3 items-center p-5 border-b border-gray-100">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('audit.searchPlaceholder')}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30"/>
          </div>
          <select value={filterModule} onChange={e => setFilterModule(e.target.value as AuditModule|'All')}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30">
            <option value="All">{t('audit.allModules')}</option>
            {(['Route','Bus','Captain','Payment','System','Terminal'] as AuditModule[]).map(m => (
              <option key={m} value={m}>{moduleLabel(m)}</option>
            ))}
          </select>
          <select value={filterAction} onChange={e => setFilterAction(e.target.value as AuditAction|'All')}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30">
            <option value="All">{t('audit.allActions')}</option>
            {(['Created','Updated','Deleted','Login','Logout','Assigned'] as AuditAction[]).map(a => (
              <option key={a} value={a}>{label(a)}</option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {cols.map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(log => (
                <tr key={log.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-400">{log.id}</td>
                  <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-700">{log.user}</td>
                  <td className="px-5 py-3.5"><Badge label={label(log.action)} variant={actionVariant[log.action]}/></td>
                  <td className="px-5 py-3.5"><span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${moduleColors[log.module]}`}>{moduleLabel(log.module)}</span></td>
                  <td className="px-5 py-3.5 text-gray-600 max-w-xs truncate" title={log.detail}>{log.detail}</td>
                </tr>
              ))}
              {filtered.length===0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">{t('audit.noResults')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
          {t('audit.showing', { filtered: filtered.length, total: auditLogs.length })}
        </div>
      </div>
    </div>
  )
}
