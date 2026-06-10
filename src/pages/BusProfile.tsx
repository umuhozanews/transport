import { useState } from 'react'
import { Plus, Pencil, Trash2, Bus as BusIcon } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { type Bus, type BusStatus } from '../data/mockData'
import Badge from '../components/shared/Badge'
import Modal from '../components/shared/Modal'

const statusVariant: Record<BusStatus,'success'|'info'|'warning'|'danger'> = {
  Active: 'success', 'In Service': 'info', Maintenance: 'warning', Retired: 'danger',
}

const empty: Omit<Bus,'id'> = {
  regNumber:'', model:'', capacity:46, type:'AC Coach',
  route:'—', captain:'—', status:'Active', lastService:'', totalKm:0,
}

const F = ({label,name,form,setForm,type='text'}:{
  label:string;
  name:keyof Omit<Bus,'id'>;
  form:Omit<Bus,'id'>;
  setForm: React.Dispatch<React.SetStateAction<Omit<Bus,'id'>>>;
  type?:string
}) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
    <input type={type} value={String(form[name])}
      onChange={e => setForm(f => ({...f,[name]: type==='number' ? Number(e.target.value) : e.target.value}))}
      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30"/>
  </div>
)

export default function BusProfile() {
  const { buses, routes, captains, addBus, updateBus, deleteBus } = useApp()
  const [modal, setModal] = useState<null|'add'|'edit'|'delete'>(null)
  const [selected, setSelected] = useState<Bus|null>(null)
  const [form, setForm] = useState<Omit<Bus,'id'>>(empty)

  const openAdd  = () => { setForm(empty); setModal('add') }
  const openEdit = (b: Bus) => { setSelected(b); setForm({...b}); setModal('edit') }
  const openDel  = (b: Bus) => { setSelected(b); setModal('delete') }

  const save = () => {
    if (modal === 'add')               addBus(form)
    else if (modal === 'edit' && selected) updateBus(selected.id, form)
    setModal(null)
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:'Imodoka zose',     value: buses.length },
          { label:'Iziri mu muhanda',  value: buses.filter(b => b.status==='Active' || b.status==='In Service').length },
          { label:'Iziri gusanwa',    value: buses.filter(b => b.status==='Maintenance').length },
          { label:'Imyanya yose',     value: `${buses.reduce((s,b) => s+b.capacity, 0)} intebe` },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className="text-2xl font-bold text-[#4a6cf7] mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2"><BusIcon size={16}/> Amabisi dufite mu nzu</h3>
          <button onClick={openAdd} className="flex items-center gap-2 bg-[#0A2558] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#0d2d6b] transition-colors">
            <Plus size={15}/> Ongeraho Bisi nshya
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['Plaque','Modeli','Ubwoko','Imyanya','Inzira','Umushoferi','Imiterere','Iheruka gusanwa','KM Yose','Ibikorwa'].map(h => (
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
                  <td className="px-4 py-3.5"><Badge label={b.status === 'Active' ? 'Mu muhanda' : b.status === 'In Service' ? 'Iri gukora' : b.status === 'Maintenance' ? 'Iri gusanwa' : 'Yarahagaritswe'} variant={statusVariant[b.status]}/></td>
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
                <tr><td colSpan={10} className="px-5 py-12 text-center text-gray-400">Nta modoka yanditse. Ongeraho imwe.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(modal==='add'||modal==='edit') && (
        <Modal title={modal==='add' ? 'Ongeraho Bisi Nshya' : `Hindura amakuru ya — ${selected?.regNumber}`}
          onClose={() => setModal(null)}
          footer={<>
            <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Reka</button>
            <button onClick={save} className="px-4 py-2 rounded-xl bg-[#0A2558] text-white text-sm font-semibold hover:bg-[#0d2d6b]">Bika amakuru</button>
          </>}>
          <div className="grid grid-cols-2 gap-4">
            <F label="Plaque (Imeyili)" name="regNumber" form={form} setForm={setForm}/>
            <F label="Modeli ya Bisi" name="model" form={form} setForm={setForm}/>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Ubwoko</label>
              <select value={form.type} onChange={e => setForm(f => ({...f,type:e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30">
                <option>AC Coach</option><option>Standard</option><option>Mini Bus</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Imiterere</label>
              <select value={form.status} onChange={e => setForm(f => ({...f,status:e.target.value as BusStatus}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30">
                <option value="Active">Izima/Irakora</option>
                <option value="In Service">Iri mu muhanda</option>
                <option value="Maintenance">Iri gusanwa</option>
                <option value="Retired">Yarahagaritswe</option>
              </select>
            </div>
            <F label="Umubare w'Intebe" name="capacity" type="number" form={form} setForm={setForm}/>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Inzira y’Ingendo</label>
              <select value={form.route} onChange={e => setForm(f => ({...f,route:e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30">
                <option value="—">— Ntiyagenewe —</option>
                {routes.filter(r => r.status==='Active').map(r => (
                  <option key={r.id} value={r.number}>{r.number} — {r.from} → {r.to}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Umushoferi Uyitwara</label>
              <input list="captain-list" value={form.captain} onChange={e => setForm(f => ({...f,captain:e.target.value}))}
                placeholder="Andika izina..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30" />
              <datalist id="captain-list">
                <option value="—">— Nta mushoferi —</option>
                {captains.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </datalist>
            </div>
            <F label="Italiki iheruka gusanwa" name="lastService" type="date" form={form} setForm={setForm}/>
            <F label="Ibirometero (KM) zose" name="totalKm" type="number" form={form} setForm={setForm}/>
          </div>
        </Modal>
      )}

      {modal==='delete' && selected && (
        <Modal title="Siba Bisi" onClose={() => setModal(null)}
          footer={<>
            <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Reka</button>
            <button onClick={() => { deleteBus(selected.id); setModal(null) }} className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700">Emeza isiba</button>
          </>}>
          <p className="text-sm text-gray-600">Urashaka gusiba bisi ifite plaque <strong>{selected.regNumber}</strong> mu buryo budasubirwaho?</p>
        </Modal>
      )}
    </div>
  )
}
