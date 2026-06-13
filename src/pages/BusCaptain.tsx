import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Pencil, Trash2, Star, UserCheck } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { type Captain, type CaptainStatus } from '../types'
import Badge from '../components/shared/Badge'
import Modal from '../components/shared/Modal'
import Avatar from '../components/shared/Avatar'

const empty: Omit<Captain,'id'> = {
  name:'', phone:'+250 7', license:'RWA-DR-', licenseExpiry:'', busAssigned:'—',
  route:'—', rating:5.0, experience:0, status:'Off Duty', joinDate:'',
}

interface FormFieldProps {
  label: string
  name: keyof Omit<Captain, 'id'>
  type?: string
  value: any
  onChange: (name: keyof Omit<Captain, 'id'>, value: any) => void
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

export default function BusCaptain() {
  const { t } = useTranslation()
  const label = (s: string) => t(`status.${s}`, { defaultValue: s })
  const { captains, buses, routes, addCaptain, updateCaptain, deleteCaptain } = useApp()
  const [modal, setModal] = useState<null | 'add' | 'edit' | 'delete'>(null)
  const [selected, setSelected] = useState<Captain | null>(null)
  const [form, setForm] = useState<Omit<Captain, 'id'>>(empty)
  const [view, setView] = useState<'table' | 'grid'>('table')

  const openAdd = () => { setForm(empty); setModal('add') }
  const openEdit = (c: Captain) => { setSelected(c); setForm({ ...c }); setModal('edit') }
  const openDel = (c: Captain) => { setSelected(c); setModal('delete') }

  const handleFieldChange = (name: keyof Omit<Captain, 'id'>, value: any) => {
    setForm(f => ({ ...f, [name]: value }))
  }

  const save = async () => {
    if (modal === 'add') await addCaptain(form)
    else if (modal === 'edit' && selected) await updateCaptain(selected.id, form)
    setModal(null)
  }

  const avg = captains.length ? (captains.reduce((s, c) => s + c.rating, 0) / captains.length).toFixed(1) : '—'

  const tableCols = [
    t('busCaptain.colCaptain'), t('busCaptain.colPhone'), t('busCaptain.colLicense'),
    t('busCaptain.colExpiry'), t('busCaptain.colBus'), t('busCaptain.colRoute'),
    t('busCaptain.colRating'), t('busCaptain.colExperience'), t('common.status'), t('common.actions'),
  ]

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: t('busCaptain.totalCaptains'), value: captains.length },
          { label: t('busCaptain.onDuty'), value: captains.filter(c=>c.status==='On Duty').length },
          { label: t('busCaptain.onLeave'), value: captains.filter(c=>c.status==='On Leave').length },
          { label: t('busCaptain.avgRating'), value: `${avg} ★` },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className="text-2xl font-bold text-[#4a6cf7] mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2"><UserCheck size={16}/> {t('busCaptain.title')}</h3>
          <div className="flex gap-3 items-center">
            <div className="flex border border-gray-200 rounded-xl overflow-hidden text-xs font-semibold">
              <button onClick={() => setView('table')} className={`px-3 py-1.5 ${view==='table'?'bg-[#0A2558] text-white':'text-gray-500 hover:bg-gray-50'}`}>{t('busCaptain.viewTable')}</button>
              <button onClick={() => setView('grid')}  className={`px-3 py-1.5 ${view==='grid'? 'bg-[#0A2558] text-white':'text-gray-500 hover:bg-gray-50'}`}>{t('busCaptain.viewGrid')}</button>
            </div>
            <button onClick={openAdd} className="flex items-center gap-2 bg-[#0A2558] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#0d2d6b] transition-colors">
              <Plus size={15}/> {t('busCaptain.addCaptain')}
            </button>
          </div>
        </div>

        {view==='table' ? (
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
                {captains.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={c.name} size="sm"/>
                        <span className="font-semibold text-gray-700 whitespace-nowrap">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">{c.phone}</td>
                    <td className="px-4 py-3.5 font-mono text-xs text-gray-600 whitespace-nowrap">{c.license}</td>
                    <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">{c.licenseExpiry}</td>
                    <td className="px-4 py-3.5 font-mono text-xs text-gray-700 whitespace-nowrap">{c.busAssigned}</td>
                    <td className="px-4 py-3.5">
                      {c.route!=='—'
                        ? <span className="bg-[#0A2558] text-white text-[11px] font-bold px-2 py-0.5 rounded">{c.route}</span>
                        : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="flex items-center gap-1 text-amber-500 font-semibold">
                        <Star size={12} fill="currentColor"/> {c.rating}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600">{c.experience} {t('common.years')}</td>
                    <td className="px-4 py-3.5"><Badge label={label(c.status)} variant={c.status === 'On Duty' ? 'success' : c.status === 'On Leave' ? 'warning' : 'neutral'}/></td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Pencil size={14}/></button>
                        <button onClick={() => openDel(c)}  className="p-1.5 rounded-lg hover:bg-red-50  text-red-500"><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {captains.length===0 && (
                  <tr><td colSpan={10} className="px-5 py-12 text-center text-gray-400">{t('busCaptain.empty')}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5 grid grid-cols-3 gap-4">
            {captains.map(c => (
              <div key={c.id} className="border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={c.name} size="lg"/>
                    <div>
                      <div className="font-bold text-gray-800 text-sm">{c.name}</div>
                      <div className="text-xs text-gray-500">{c.experience} {t('common.years')} · {c.license.slice(0,10)}</div>
                    </div>
                  </div>
                  <Badge label={label(c.status)} variant={c.status === 'On Duty' ? 'success' : c.status === 'On Leave' ? 'warning' : 'neutral'}/>
                </div>
                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between"><span className="text-gray-400">{t('busCaptain.colPhone')}</span>{c.phone}</div>
                  <div className="flex justify-between"><span className="text-gray-400">{t('busCaptain.colBus')}</span><span className="font-mono">{c.busAssigned}</span></div>
                  <div className="flex justify-between items-center"><span className="text-gray-400">{t('busCaptain.colRoute')}</span>
                    {c.route!=='—'?<span className="bg-[#0A2558] text-white text-[10px] font-bold px-2 py-0.5 rounded">{c.route}</span>:'—'}
                  </div>
                  <div className="flex justify-between items-center"><span className="text-gray-400">{t('busCaptain.colRating')}</span>
                    <span className="flex items-center gap-1 text-amber-500 font-semibold"><Star size={11} fill="currentColor"/>{c.rating}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button onClick={() => openEdit(c)} className="flex-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 py-1.5 rounded-lg">{t('common.edit')}</button>
                  <button onClick={() => openDel(c)}  className="flex-1 text-xs font-semibold text-red-500 hover:bg-red-50 py-1.5 rounded-lg">{t('common.delete')}</button>
                </div>
              </div>
            ))}
            {captains.length===0 && (
              <div className="col-span-3 py-12 text-center text-gray-400">{t('busCaptain.empty')}</div>
            )}
          </div>
        )}
      </div>

      {(modal==='add'||modal==='edit') && (
        <Modal title={modal==='add' ? t('busCaptain.addTitle') : t('busCaptain.editTitle', { name: selected?.name })}
          onClose={() => setModal(null)}
          footer={<>
            <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">{t('common.cancel')}</button>
            <button onClick={save} className="px-4 py-2 rounded-xl bg-[#0A2558] text-white text-sm font-semibold hover:bg-[#0d2d6b]">{t('common.save')}</button>
          </>}>
          <div className="grid grid-cols-2 gap-4">
            <F label={t('busCaptain.fieldName')} name="name" value={form.name} onChange={handleFieldChange} autoFocus onKeyDown={e => { if(e.key==='Enter' && form.name) save() }}/>
            <F label={t('busCaptain.fieldPhone')} name="phone" value={form.phone} onChange={handleFieldChange}/>
            <F label={t('busCaptain.fieldLicense')} name="license" value={form.license} onChange={handleFieldChange}/>
            <F label={t('busCaptain.fieldExpiry')} name="licenseExpiry" type="date" value={form.licenseExpiry} onChange={handleFieldChange}/>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">{t('busCaptain.fieldBus')}</label>
              <select value={form.busAssigned} onChange={e => setForm(f => ({...f,busAssigned:e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30">
                <option value="—">{t('common.notAssigned')}</option>
                {buses.map(b => <option key={b.id} value={b.regNumber}>{b.regNumber} ({b.model})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">{t('busCaptain.fieldRoute')}</label>
              <select value={form.route} onChange={e => setForm(f => ({...f,route:e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30">
                <option value="—">{t('common.notAssigned')}</option>
                {routes.filter(r=>r.status==='Active').map(r => <option key={r.id} value={r.number}>{r.number} — {r.from} → {r.to}</option>)}
              </select>
            </div>
            <F label={t('busCaptain.fieldExperience')} name="experience" type="number" value={form.experience} onChange={handleFieldChange}/>
            <F label={t('busCaptain.fieldRating')} name="rating" type="number" value={form.rating} onChange={handleFieldChange}/>
            <F label={t('busCaptain.fieldJoinDate')} name="joinDate" type="date" value={form.joinDate} onChange={handleFieldChange}/>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">{t('common.status')}</label>
              <select value={form.status} onChange={e => setForm(f => ({...f,status:e.target.value as CaptainStatus}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30">
                {(['On Duty', 'Off Duty', 'On Leave'] as CaptainStatus[]).map(s => (
                  <option key={s} value={s}>{label(s)}</option>
                ))}
              </select>
            </div>
          </div>
        </Modal>
      )}

      {modal==='delete'&&selected && (
        <Modal title={t('busCaptain.deleteTitle')} onClose={() => setModal(null)}
          footer={<>
            <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">{t('common.cancel')}</button>
            <button onClick={async () => { await deleteCaptain(selected!.id); setModal(null) }} className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700">{t('common.delete')}</button>
          </>}>
          <p className="text-sm text-gray-600">{t('busCaptain.deleteConfirm', { name: selected.name })}</p>
        </Modal>
      )}
    </div>
  )
}
