import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Pencil, Trash2, Bus as BusIcon } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { type Bus, type BusStatus } from '../types'
import Badge from '../components/shared/Badge'
import Modal from '../components/shared/Modal'

const empty: Omit<Bus,'id'> = {
  regNumber:'', model:'', capacity:46, type:'AC Coach',
  route:'—', captain:'—', status:'Active', lastService:'', totalKm:0,
}

interface FormFieldProps {
  label: string
  name: keyof Omit<Bus, 'id'>
  type?: string
  value: any
  onChange: (name: keyof Omit<Bus, 'id'>, value: any) => void
  autoFocus?: boolean
  onKeyDown?: (e: React.KeyboardEvent) => void
}

const F = ({ label, name, type = 'text', value, onChange, autoFocus, onKeyDown }: FormFieldProps) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
    <input
      type={type}
      value={String(value)}
      autoFocus={autoFocus}
      onKeyDown={onKeyDown}
      onChange={e => onChange(name, type === 'number' ? Number(e.target.value) : e.target.value)}
      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30"
    />
  </div>
)

export default function BusProfile() {
  const { t } = useTranslation()
  const label = (s: string) => t(`status.${s}`, { defaultValue: s })
  const { buses, routes, captains, addBus, updateBus, deleteBus } = useApp()
  const [modal, setModal] = useState<null | 'add' | 'edit' | 'delete'>(null)
  const [selected, setSelected] = useState<Bus | null>(null)
  const [form, setForm] = useState<Omit<Bus, 'id'>>(empty)

  const openAdd = () => { setForm(empty); setModal('add') }
  const openEdit = (b: Bus) => { setSelected(b); setForm({ ...b }); setModal('edit') }
  const openDel = (b: Bus) => { setSelected(b); setModal('delete') }

  const handleFieldChange = (name: keyof Omit<Bus, 'id'>, value: any) => {
    setForm(f => ({ ...f, [name]: value }))
  }

  const save = async () => {
    if (modal === 'add') await addBus(form)
    else if (modal === 'edit' && selected) await updateBus(selected.id, form)
    setModal(null)
  }

  const tableCols = [
    t('busProfile.colPlate'), t('busProfile.colModel'), t('busProfile.colType'),
    t('busProfile.colCapacity'), t('busProfile.colRoute'), t('busProfile.colCaptain'),
    t('common.status'), t('busProfile.colLastService'), t('busProfile.colTotalKm'), t('common.actions'),
  ]

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: t('busProfile.totalBuses'), value: buses.length },
          { label: t('busProfile.inService'), value: buses.filter(b => b.status==='Active' || b.status==='In Service').length },
          { label: t('busProfile.maintenance'), value: buses.filter(b => b.status==='Maintenance').length },
          { label: t('busProfile.totalSeats'), value: t('busProfile.seatsUnit', { count: buses.reduce((s,b) => s+b.capacity, 0) }) },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className="text-2xl font-bold text-[#4a6cf7] mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2"><BusIcon size={16}/> {t('busProfile.title')}</h3>
          <button onClick={openAdd} className="flex items-center gap-2 bg-[#0A2558] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#0d2d6b] transition-colors">
            <Plus size={15}/> {t('busProfile.addBus')}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {tableCols.map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {buses.map(b => (
                <tr key={b.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3.5 font-mono text-xs font-bold text-gray-800 whitespace-nowrap">{b.regNumber}</td>
                  <td className="px-4 py-3.5 text-gray-700 whitespace-nowrap">{b.model}</td>
                  <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">{b.type}</td>
                  <td className="px-4 py-3.5 text-gray-600">{b.capacity}</td>
                  <td className="px-4 py-3.5">
                    {b.route !== '—'
                      ? <span className="bg-[#0A2558] text-white text-[11px] font-bold px-2 py-0.5 rounded">{b.route}</span>
                      : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3.5 text-gray-700 whitespace-nowrap">{b.captain}</td>
                  <td className="px-4 py-3.5"><Badge label={label(b.status)} variant={b.status === 'Active' || b.status === 'In Service' ? 'success' : b.status === 'Maintenance' ? 'warning' : 'danger'}/></td>
                  <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">{b.lastService}</td>
                  <td className="px-4 py-3.5 text-gray-600">{b.totalKm.toLocaleString()}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Pencil size={14}/></button>
                      <button onClick={() => openDel(b)}  className="p-1.5 rounded-lg hover:bg-red-50  text-red-500"><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {buses.length === 0 && (
                <tr><td colSpan={10} className="px-5 py-12 text-center text-gray-400">{t('busProfile.empty')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(modal==='add'||modal==='edit') && (
        <Modal title={modal==='add' ? t('busProfile.addTitle') : t('busProfile.editTitle', { reg: selected?.regNumber })}
          onClose={() => setModal(null)}
          footer={<>
            <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">{t('common.cancel')}</button>
            <button onClick={save} className="px-4 py-2 rounded-xl bg-[#0A2558] text-white text-sm font-semibold hover:bg-[#0d2d6b]">{t('common.save')}</button>
          </>}>
          <div className="grid grid-cols-2 gap-4">
            <F label={t('busProfile.fieldPlate')} name="regNumber" value={form.regNumber} onChange={handleFieldChange} autoFocus onKeyDown={e => { if(e.key==='Enter' && form.regNumber) save() }}/>
            <F label={t('busProfile.fieldModel')} name="model" value={form.model} onChange={handleFieldChange}/>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">{t('busProfile.fieldType')}</label>
              <select value={form.type} onChange={e => setForm(f => ({...f,type:e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30">
                <option>AC Coach</option><option>Standard</option><option>Mini Bus</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">{t('common.status')}</label>
              <select value={form.status} onChange={e => setForm(f => ({...f,status:e.target.value as BusStatus}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30">
                {(['Active', 'In Service', 'Maintenance', 'Retired'] as BusStatus[]).map(s => (
                  <option key={s} value={s}>{label(s)}</option>
                ))}
              </select>
            </div>
            <F label={t('busProfile.fieldCapacity')} name="capacity" type="number" value={form.capacity} onChange={handleFieldChange}/>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">{t('busProfile.fieldRoute')}</label>
              <select value={form.route} onChange={e => setForm(f => ({...f,route:e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30">
                <option value="—">{t('common.notAssigned')}</option>
                {routes.filter(r => r.status==='Active').map(r => (
                  <option key={r.id} value={r.number}>{r.number} — {r.from} → {r.to}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">{t('busProfile.fieldCaptain')}</label>
              <select value={form.captain} onChange={e => setForm(f => ({...f,captain:e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30">
                <option value="—">{t('common.noDriver')}</option>
                {captains.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <F label={t('busProfile.fieldLastService')} name="lastService" type="date" value={form.lastService} onChange={handleFieldChange}/>
            <F label={t('busProfile.fieldTotalKm')} name="totalKm" type="number" value={form.totalKm} onChange={handleFieldChange}/>
          </div>
        </Modal>
      )}

      {modal==='delete' && selected && (
        <Modal title={t('busProfile.deleteTitle')} onClose={() => setModal(null)}
          footer={<>
            <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">{t('common.cancel')}</button>
            <button onClick={async () => { await deleteBus(selected!.id); setModal(null) }} className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700">{t('common.delete')}</button>
          </>}>
          <p className="text-sm text-gray-600">{t('busProfile.deleteConfirm', { reg: selected.regNumber, model: selected.model })}</p>
        </Modal>
      )}
    </div>
  )
}
