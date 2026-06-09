import { useState } from 'react'
import { Plus, Pencil, Trash2, Wifi, WifiOff, Wrench } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { type Terminal, type TerminalStatus, type PaymentMethod } from '../data/mockData'
import Badge from '../components/shared/Badge'
import Modal from '../components/shared/Modal'

const statusIcon: Record<TerminalStatus, React.ReactNode> = {
  Online: <Wifi size={14} className="text-emerald-500"/>,
  Offline: <WifiOff size={14} className="text-red-400"/>,
  Maintenance: <Wrench size={14} className="text-amber-500"/>,
}
const statusVariant: Record<TerminalStatus, 'success'|'danger'|'warning'> = {
  Online: 'success', Offline: 'danger', Maintenance: 'warning',
}
const allMethods: PaymentMethod[] = ['MoMo', 'Airtel', 'Cash', 'Card']

const empty: Omit<Terminal, 'id'> = {
  name: '', location: '', type: 'Fixed POS', status: 'Online',
  lastTx: '—', totalToday: 0, accepts: ['MoMo'],
}

export default function PaymentTerminal() {
  const { terminals, addTerminal, updateTerminal, deleteTerminal } = useApp()
  const [modal, setModal] = useState<null|'add'|'edit'|'delete'>(null)
  const [selected, setSelected] = useState<Terminal|null>(null)
  const [form, setForm] = useState<Omit<Terminal,'id'>>(empty)

  const openAdd  = () => { setForm(empty); setModal('add') }
  const openEdit = (t: Terminal) => { setSelected(t); setForm({ ...t }); setModal('edit') }
  const openDel  = (t: Terminal) => { setSelected(t); setModal('delete') }

  const save = () => {
    if (modal === 'add')               addTerminal(form)
    else if (modal === 'edit' && selected) updateTerminal(selected.id, form)
    setModal(null)
  }

  const toggleMethod = (m: PaymentMethod) =>
    setForm(f => ({ ...f, accepts: f.accepts.includes(m) ? f.accepts.filter(x => x !== m) : [...f.accepts, m] }))

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Ibikoresho byose',  value: terminals.length },
          { label: 'Biri gukora ubu',   value: terminals.filter(t => t.status === 'Online').length },
          { label: 'Ayishyuwe uyu munsi', value: `RWF ${terminals.reduce((s,t) => s + t.totalToday, 0).toLocaleString()}` },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className="text-2xl font-bold text-[#4a6cf7] mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-700">Imashini z’Imiripo (Terminals)</h3>
          <button onClick={openAdd} className="flex items-center gap-2 bg-[#0A2558] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#0d2d6b] transition-colors">
            <Plus size={15}/> Ongeraho Terminal
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['ID','Izina','Aho Iri','Ubwoko','Imiterere','Yishyura','Urugendo rwa Nyuma','Uyu Munsi','Ibikorwa'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {terminals.map(t => (
                <tr key={t.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{t.id}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-700">{t.name}</td>
                  <td className="px-5 py-3.5 text-gray-600">{t.location}</td>
                  <td className="px-5 py-3.5 text-gray-600">{t.type}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {statusIcon[t.status]}
                      <Badge label={t.status === 'Online' ? 'Irakora' : t.status === 'Offline' ? 'Ntabwo ikora' : 'Iri gusanwa'} variant={statusVariant[t.status]}/>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1">{t.accepts.map(m => <span key={m} className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{m}</span>)}</div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{t.lastTx}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-800">RWF {t.totalToday.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Pencil size={14}/></button>
                      <button onClick={() => openDel(t)}  className="p-1.5 rounded-lg hover:bg-red-50  text-red-500"><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {terminals.length === 0 && (
                <tr><td colSpan={9} className="px-5 py-12 text-center text-gray-400">Nta mashini yanditse. Ongeraho imwe.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? 'Ongeraho Terminal nshya' : `Hindura amakuru ya — ${selected?.name}`}
          onClose={() => setModal(null)}
          footer={<>
            <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Reka</button>
            <button onClick={save} className="px-4 py-2 rounded-xl bg-[#0A2558] text-white text-sm font-semibold hover:bg-[#0d2d6b]">Bika amakuru</button>
          </>}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[{label:'Izina ry’Imashini', key:'name'},{label:'Aho Iri (Ahantu)', key:'location'}].map(({label,key}) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                  <input value={String(form[key as keyof typeof form])} onChange={e => setForm(f => ({...f,[key]:e.target.value}))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30"/>
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Ubwoko</label>
                <select value={form.type} onChange={e => setForm(f => ({...f,type:e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30">
                  <option>Fixed POS</option><option>Mobile POS</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Imiterere</label>
                <select value={form.status} onChange={e => setForm(f => ({...f,status:e.target.value as TerminalStatus}))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30">
                  <option value="Online">Irakora</option>
                  <option value="Offline">Ntabwo ikora</option>
                  <option value="Maintenance">Iri gusanwa</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Uburyo bwo Kwishyura</label>
              <div className="flex gap-4">
                {allMethods.map(m => (
                  <label key={m} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.accepts.includes(m)} onChange={() => toggleMethod(m)} className="w-4 h-4 accent-[#4a6cf7]"/>
                    <span className="text-sm text-gray-700">{m}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'delete' && selected && (
        <Modal title="Siba Terminal" onClose={() => setModal(null)}
          footer={<>
            <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Reka</button>
            <button onClick={() => { deleteTerminal(selected.id); setModal(null) }} className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700">Emeza isiba</button>
          </>}>
          <p className="text-sm text-gray-600">Urashaka gusiba imashini <strong>{selected.name}</strong> i <strong>{selected.location}</strong> mu buryo budasubirwaho?</p>
        </Modal>
      )}
    </div>
  )
}
