import { useState } from 'react'
import { Plus, Pencil, Trash2, Star, UserCheck } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { type Captain, type CaptainStatus } from '../data/mockData'
import Badge from '../components/shared/Badge'
import Modal from '../components/shared/Modal'
import Avatar from '../components/shared/Avatar'

const statusVariant: Record<CaptainStatus,'success'|'neutral'|'warning'> = {
  'On Duty':'success', 'Off Duty':'neutral', 'On Leave':'warning',
}

const empty: Omit<Captain,'id'> = {
  name:'', phone:'+250 7', license:'RWA-DR-', licenseExpiry:'', busAssigned:'—',
  route:'—', rating:5.0, experience:0, status:'Off Duty', joinDate:'',
}

const F = ({label,name,form,setForm,type='text'}:{
  label:string;
  name:keyof Omit<Captain,'id'>;
  form:Omit<Captain,'id'>;
  setForm: React.Dispatch<React.SetStateAction<Omit<Captain,'id'>>>;
  type?:string
}) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
    <input type={type} value={String(form[name])}
      onChange={e => setForm(f => ({...f,[name]: type==='number'?Number(e.target.value):e.target.value}))}
      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30"/>
  </div>
)

export default function BusCaptain() {
  const { captains, buses, routes, addCaptain, updateCaptain, deleteCaptain } = useApp()
  const [modal, setModal] = useState<null|'add'|'edit'|'delete'>(null)
  const [selected, setSelected] = useState<Captain|null>(null)
  const [form, setForm] = useState<Omit<Captain,'id'>>(empty)
  const [view, setView] = useState<'table'|'grid'>('table')

  const openAdd  = () => { setForm(empty); setModal('add') }
  const openEdit = (c: Captain) => { setSelected(c); setForm({...c}); setModal('edit') }
  const openDel  = (c: Captain) => { setSelected(c); setModal('delete') }

  const save = () => {
    if (modal==='add')                addCaptain(form)
    else if (modal==='edit'&&selected) updateCaptain(selected.id, form)
    setModal(null)
  }

  const avg = captains.length ? (captains.reduce((s,c)=>s+c.rating,0)/captains.length).toFixed(1) : '—'

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label:'Abashoferi Bose',  value: captains.length },
          { label:'Abari mu Kazi',    value: captains.filter(c=>c.status==='On Duty').length },
          { label:'Abari mu Kiruhuko', value: captains.filter(c=>c.status==='On Leave').length },
          { label:'Inota ry’Akazi',    value: `${avg} ★` },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className="text-2xl font-bold text-[#4a6cf7] mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2"><UserCheck size={16}/> Urutonde rw’Abashoferi</h3>
          <div className="flex gap-3 items-center">
            <div className="flex border border-gray-200 rounded-xl overflow-hidden text-xs font-semibold">
              <button onClick={() => setView('table')} className={`px-3 py-1.5 ${view==='table'?'bg-[#0A2558] text-white':'text-gray-500 hover:bg-gray-50'}`}>Imbonerahamwe</button>
              <button onClick={() => setView('grid')}  className={`px-3 py-1.5 ${view==='grid'? 'bg-[#0A2558] text-white':'text-gray-500 hover:bg-gray-50'}`}>Ikarita</button>
            </div>
            <button onClick={openAdd} className="flex items-center gap-2 bg-[#0A2558] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#0d2d6b] transition-colors">
              <Plus size={15}/> Ongeraho Umushoferi
            </button>
          </div>
        </div>

        {view==='table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  {['Amazina','Telefone','Uruhushya','Irangira','Bisi','Inzira','Inota','Uburambe','Imiterere','Ibikorwa'].map(h => (
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
                    <td className="px-4 py-3.5 text-gray-600">{c.experience} yrs</td>
                    <td className="px-4 py-3.5"><Badge label={c.status === 'On Duty' ? 'Ari mu kazi' : c.status === 'On Leave' ? 'Mu kiruhuko' : 'Ntabwo ari mu kazi'} variant={statusVariant[c.status]}/></td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Pencil size={14}/></button>
                        <button onClick={() => openDel(c)}  className="p-1.5 rounded-lg hover:bg-red-50  text-red-500"><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {captains.length===0 && (
                  <tr><td colSpan={10} className="px-5 py-12 text-center text-gray-400">Nta mushoferi wanditswe. Ongeraho umwe.</td></tr>
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
                      <div className="text-xs text-gray-500">{c.experience} yrs · {c.license.slice(0,10)}</div>
                    </div>
                  </div>
                  <Badge label={c.status === 'On Duty' ? 'Ari mu kazi' : c.status === 'On Leave' ? 'Mu kiruhuko' : 'Ntabwo ari mu kazi'} variant={statusVariant[c.status]}/>
                </div>
                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between"><span className="text-gray-400">Telefone</span>{c.phone}</div>
                  <div className="flex justify-between"><span className="text-gray-400">Bisi</span><span className="font-mono">{c.busAssigned}</span></div>
                  <div className="flex justify-between items-center"><span className="text-gray-400">Inzira</span>
                    {c.route!=='—'?<span className="bg-[#0A2558] text-white text-[10px] font-bold px-2 py-0.5 rounded">{c.route}</span>:'—'}
                  </div>
                  <div className="flex justify-between items-center"><span className="text-gray-400">Inota</span>
                    <span className="flex items-center gap-1 text-amber-500 font-semibold"><Star size={11} fill="currentColor"/>{c.rating}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button onClick={() => openEdit(c)} className="flex-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 py-1.5 rounded-lg">Hindura</button>
                  <button onClick={() => openDel(c)}  className="flex-1 text-xs font-semibold text-red-500 hover:bg-red-50 py-1.5 rounded-lg">Siba</button>
                </div>
              </div>
            ))}
            {captains.length===0 && (
              <div className="col-span-3 py-12 text-center text-gray-400">Nta mushoferi wanditswe. Ongeraho umwe.</div>
            )}
          </div>
        )}
      </div>

      {(modal==='add'||modal==='edit') && (
        <Modal title={modal==='add'?'Ongeraho Umushoferi Mwiza':`Hindura — ${selected?.name}`}
          onClose={() => setModal(null)}
          footer={<>
            <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Reka</button>
            <button onClick={save} className="px-4 py-2 rounded-xl bg-[#0A2558] text-white text-sm font-semibold hover:bg-[#0d2d6b]">Bika</button>
          </>}>
          <div className="grid grid-cols-2 gap-4">
            <F label="Amazina Yuzuye" name="name" form={form} setForm={setForm}/>
            <F label="Telefone (+250 7…)" name="phone" form={form} setForm={setForm}/>
            <F label="Nomero y’Uruhushya" name="license" form={form} setForm={setForm}/>
            <F label="Irangira ry’Uruhushya" name="licenseExpiry" type="date" form={form} setForm={setForm}/>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Bisi Yagenewe</label>
              <select value={form.busAssigned} onChange={e => setForm(f => ({...f,busAssigned:e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30">
                <option value="—">— Ntiyagenewe —</option>
                {buses.map(b => <option key={b.id} value={b.regNumber}>{b.regNumber} ({b.model})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Inzira Yagenewe</label>
              <select value={form.route} onChange={e => setForm(f => ({...f,route:e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30">
                <option value="—">— Ntiyagenewe —</option>
                {routes.filter(r=>r.status==='Active').map(r => <option key={r.id} value={r.number}>{r.number} — {r.from} → {r.to}</option>)}
              </select>
            </div>
            <F label="Uburambe mu Kazi (Imyaka)" name="experience" type="number" form={form} setForm={setForm}/>
            <F label="Inota ry’Umushoferi (1–5)" name="rating" type="number" form={form} setForm={setForm}/>
            <F label="Italiki yatangiriyeho" name="joinDate" type="date" form={form} setForm={setForm}/>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Imiterere</label>
              <select value={form.status} onChange={e => setForm(f => ({...f,status:e.target.value as CaptainStatus}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30">
                <option value="On Duty">Ari mu kazi</option>
                <option value="Off Duty">Ntabwo ari mu kazi</option>
                <option value="On Leave">Mu kiruhuko</option>
              </select>
            </div>
          </div>
        </Modal>
      )}

      {modal==='delete'&&selected && (
        <Modal title="Siba Umushoferi" onClose={() => setModal(null)}
          footer={<>
            <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Reka</button>
            <button onClick={() => { deleteCaptain(selected.id); setModal(null) }} className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700">Emeza isiba</button>
          </>}>
          <p className="text-sm text-gray-600">Urashaka gusiba umushoferi <strong>{selected.name}</strong> mu buryo budasubirwaho?</p>
        </Modal>
      )}
    </div>
  )
}
