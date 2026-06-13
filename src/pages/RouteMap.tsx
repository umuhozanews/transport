import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { type Route, type RouteStatus } from '../types'
import Badge from '../components/shared/Badge'
import Modal from '../components/shared/Modal'

const empty: Omit<Route, 'id'> = {
  number: '', from: '', to: '', distance: 0, fare: 0, stops: 0, busesAssigned: 0, status: 'Active',
}

interface FormFieldProps {
  label: string
  name: keyof Omit<Route, 'id'>
  type?: string
  value: any
  onChange: (name: keyof Omit<Route, 'id'>, value: any) => void
}

const F = ({ label, name, type = 'text', value, onChange }: FormFieldProps) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
    <input
      type={type}
      value={String(value)}
      onChange={e => onChange(name, type === 'number' ? Number(e.target.value) : e.target.value)}
      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30"
    />
  </div>
)

export default function RouteMap() {
  const { t } = useTranslation()
  const label = (s: string) => t(`status.${s}`, { defaultValue: s })
  const { routes, addRoute, updateRoute, deleteRoute } = useApp()
  const [modal, setModal] = useState<null | 'add' | 'edit' | 'delete'>(null)
  const [selected, setSelected] = useState<Route | null>(null)
  const [form, setForm] = useState<Omit<Route, 'id'>>(empty)

  const openAdd = () => { setForm(empty); setModal('add') }
  const openEdit = (r: Route) => { setSelected(r); setForm({ ...r }); setModal('edit') }
  const openDel = (r: Route) => { setSelected(r); setModal('delete') }

  const handleFieldChange = (name: keyof Omit<Route, 'id'>, value: any) => {
    setForm(f => ({ ...f, [name]: value }))
  }

  const save = async () => {
    const { busesAssigned: _, ...payload } = form
    if (modal === 'add') await addRoute(payload)
    else if (modal === 'edit' && selected) await updateRoute(selected.id, payload)
    setModal(null)
  }

  const tableCols = [
    t('routeMap.colRouteNo'), t('routeMap.colFromTo'), t('routeMap.colDistance'),
    t('routeMap.colFare'), t('routeMap.colStops'), t('routeMap.colBuses'),
    t('common.status'), t('common.actions'),
  ]

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t('routeMap.totalRoutes'), value: routes.length, color: 'text-[#4a6cf7]' },
          { label: t('routeMap.active'), value: routes.filter(r => r.status === 'Active').length, color: 'text-emerald-600' },
          { label: t('routeMap.inactive'), value: routes.filter(r => r.status === 'Inactive').length, color: 'text-gray-500' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2"><MapPin size={16}/> {t('routeMap.title')}</h3>
          <button onClick={openAdd} className="flex items-center gap-2 bg-[#0A2558] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#0d2d6b] transition-colors">
            <Plus size={15}/> {t('routeMap.addRoute')}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {tableCols.map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {routes.map(r => (
                <tr key={r.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5"><span className="bg-[#0A2558] text-white text-[11px] font-bold px-2.5 py-1 rounded">{r.number}</span></td>
                  <td className="px-5 py-3.5 font-medium text-gray-700">{r.from} → {r.to}</td>
                  <td className="px-5 py-3.5 text-gray-600">{r.distance} {t('common.km')}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-800">{r.fare.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-gray-600">{r.stops}</td>
                  <td className="px-5 py-3.5 text-gray-600">{r.busesAssigned}</td>
                  <td className="px-5 py-3.5"><Badge label={label(r.status)} variant={r.status === 'Active' ? 'success' : 'neutral'}/></td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"><Pencil size={14}/></button>
                      <button onClick={() => openDel(r)}  className="p-1.5 rounded-lg hover:bg-red-50  text-red-500  transition-colors"><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {routes.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-gray-400">{t('routeMap.empty')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? t('routeMap.addTitle') : t('routeMap.editTitle', { number: selected?.number })}
          onClose={() => setModal(null)}
          footer={<>
            <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">{t('common.cancel')}</button>
            <button onClick={save} className="px-4 py-2 rounded-xl bg-[#0A2558] text-white text-sm font-semibold hover:bg-[#0d2d6b]">{t('common.save')}</button>
          </>}>
          <div className="grid grid-cols-2 gap-4">
            <F label={t('routeMap.fieldNumber')} name="number" value={form.number} onChange={handleFieldChange}/>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">{t('common.status')}</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as RouteStatus }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30">
                <option value="Active">{label('Active')}</option>
                <option value="Inactive">{label('Inactive')}</option>
              </select>
            </div>
            <F label={t('routeMap.fieldFrom')} name="from" value={form.from} onChange={handleFieldChange}/>
            <F label={t('routeMap.fieldTo')} name="to" value={form.to} onChange={handleFieldChange}/>
            <F label={t('routeMap.fieldDistance')} name="distance" type="number" value={form.distance} onChange={handleFieldChange}/>
            <F label={t('routeMap.fieldFare')} name="fare" type="number" value={form.fare} onChange={handleFieldChange}/>
            <F label={t('routeMap.fieldStops')} name="stops" type="number" value={form.stops} onChange={handleFieldChange}/>
            <F label={t('routeMap.fieldBuses')} name="busesAssigned" type="number" value={form.busesAssigned} onChange={handleFieldChange}/>
          </div>
        </Modal>
      )}

      {modal === 'delete' && selected && (
        <Modal title={t('routeMap.deleteTitle')} onClose={() => setModal(null)}
          footer={<>
            <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">{t('common.cancel')}</button>
            <button onClick={async () => { await deleteRoute(selected!.id); setModal(null) }} className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700">{t('common.delete')}</button>
          </>}>
          <p className="text-sm text-gray-600">{t('routeMap.deleteConfirm', { number: selected.number, from: selected.from, to: selected.to })}</p>
        </Modal>
      )}
    </div>
  )
}
