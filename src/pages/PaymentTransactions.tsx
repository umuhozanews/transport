import { useState, useMemo } from 'react'
import { Search, Filter, Download, Plus } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { useAuth } from '../store/AuthContext'
import { type PaymentMethod, type TxStatus, type Transaction } from '../data/mockData'
import Badge from '../components/shared/Badge'
import Modal from '../components/shared/Modal'

const methodVariant: Record<PaymentMethod,'warning'|'danger'|'neutral'|'info'> = {
  MoMo:'warning', Airtel:'danger', Cash:'neutral', Card:'info',
}
const statusVariant: Record<TxStatus,'success'|'warning'|'danger'> = {
  Success:'success', Pending:'warning', Failed:'danger',
}

function nowKigali() {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone:'Africa/Kigali', year:'numeric', month:'2-digit', day:'2-digit',
    hour:'2-digit', minute:'2-digit',
  }).format(new Date()).replace('T',' ')
}

const emptyTx: Omit<Transaction,'id'> = {
  route:'', from:'', to:'', captain:'', date:'',
  amount:0, method:'MoMo', status:'Success', passengers:0,
}

export default function PaymentTransactions() {
  const { transactions, addTransaction, routes, captains } = useApp()
  const { user } = useAuth()
  const [search, setSearch]               = useState('')
  const [filterMethod, setFilterMethod]   = useState<PaymentMethod|'All'>('All')
  const [filterStatus, setFilterStatus]   = useState<TxStatus|'All'>('All')
  const [modal, setModal]                 = useState(false)
  const [form, setForm]                   = useState<Omit<Transaction,'id'>>(emptyTx)

  // For captains: only show their route's transactions
  const isCaptain = user?.role === 'captain'
  const captainName = user?.captainName ?? ''

  const visibleTransactions = isCaptain
    ? transactions.filter(tx => tx.captain === captainName)
    : transactions

  const filtered = useMemo(() => visibleTransactions.filter(tx => {
    const q = search.toLowerCase()
    return (
      (tx.id.toLowerCase().includes(q) || tx.captain.toLowerCase().includes(q) ||
       `${tx.from} ${tx.to}`.toLowerCase().includes(q)) &&
      (filterMethod==='All' || tx.method===filterMethod) &&
      (filterStatus==='All' || tx.status===filterStatus)
    )
  }), [visibleTransactions, search, filterMethod, filterStatus])

  const totals = useMemo(() => ({
    all:    visibleTransactions.reduce((s,t)=>s+t.amount,0),
    momo:   visibleTransactions.filter(t=>t.method==='MoMo').reduce((s,t)=>s+t.amount,0),
    airtel: visibleTransactions.filter(t=>t.method==='Airtel').reduce((s,t)=>s+t.amount,0),
    cash:   visibleTransactions.filter(t=>t.method==='Cash').reduce((s,t)=>s+t.amount,0),
  }), [visibleTransactions])

  // when route is selected, auto-fill from/to/fare
  const handleRouteChange = (num: string) => {
    const r = routes.find(r => r.number===num)
    setForm(f => ({
      ...f, route:num,
      from: r?.from ?? '', to: r?.to ?? '',
      amount: r ? r.fare * f.passengers : f.amount,
    }))
  }
  const handlePassengersChange = (n: number) => {
    const r = routes.find(r => r.number===form.route)
    setForm(f => ({ ...f, passengers:n, amount: r ? r.fare * n : f.amount }))
  }

  const openModal = () => {
    // For captains: pre-fill their route and their name
    if (isCaptain && captainName) {
      const captain = captains.find(c => c.name === captainName)
      const route   = routes.find(r => r.number === captain?.route)
      setForm({
        ...emptyTx,
        date: nowKigali(),
        captain: captainName,
        route:   captain?.route ?? '',
        from:    route?.from ?? '',
        to:      route?.to ?? '',
      })
    } else {
      setForm({ ...emptyTx, date: nowKigali() })
    }
    setModal(true)
  }

  const submit = () => {
    if (!form.route || !form.captain || form.passengers < 1) return
    addTransaction(form)
    setModal(false)
  }

  return (
    <div className="space-y-5">
      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label:'Amafaranga Yose',  value:`RWF ${totals.all.toLocaleString()}`,    bg:'bg-indigo-50', color:'text-[#4a6cf7]' },
          { label:'MTN MoMo',         value:`RWF ${totals.momo.toLocaleString()}`,   bg:'bg-amber-50',  color:'text-amber-600' },
          { label:'Airtel Money',     value:`RWF ${totals.airtel.toLocaleString()}`, bg:'bg-red-50',    color:'text-red-600'   },
          { label:'Cash',             value:`RWF ${totals.cash.toLocaleString()}`,   bg:'bg-gray-50',   color:'text-gray-700'  },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 shadow-sm`}>
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={`text-lg font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-wrap gap-3 items-center p-5 border-b border-gray-100">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Shakisha inzira cyangwa umushoferi…"
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30"/>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-gray-400"/>
            <select value={filterMethod} onChange={e => setFilterMethod(e.target.value as PaymentMethod|'All')}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30">
              <option value="All">Uburyo bwose</option>
              <option>MoMo</option><option>Airtel</option><option>Cash</option><option>Card</option>
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as TxStatus|'All')}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30">
              <option value="All">Imiterere yose</option>
              <option value="Success">Byakunze</option>
              <option value="Pending">Biracyategereje</option>
              <option value="Failed">Byanze</option>
            </select>
          </div>
          <div className="flex gap-2 ml-auto">
            <button onClick={openModal} className="flex items-center gap-2 bg-[#0A2558] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#0d2d6b] transition-colors">
              <Plus size={15}/> Andika Urugendo
            </button>
            <button className="flex items-center gap-2 border border-gray-200 text-gray-600 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
              <Download size={15}/> Kuramo raporo
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['ID','Inzira n’Icyerekezo','Umushoferi','Isaha','Abagenzi','Amafaranga (RWF)','Uburyo','Imiterere'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(tx => (
                <tr key={tx.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{tx.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#0A2558] text-white text-[11px] font-bold px-2 py-0.5 rounded">{tx.route}</span>
                      <span className="text-gray-700">{tx.from} → {tx.to}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-700 whitespace-nowrap">{tx.captain}</td>
                  <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{tx.date}</td>
                  <td className="px-5 py-3.5 text-center text-gray-700">{tx.passengers}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-800">{tx.amount.toLocaleString()}</td>
                  <td className="px-5 py-3.5"><Badge label={tx.method} variant={methodVariant[tx.method]}/></td>
                  <td className="px-5 py-3.5"><Badge label={tx.status === 'Success' ? 'Byakunze' : tx.status === 'Pending' ? 'Biracyategereje' : 'Byanze'} variant={statusVariant[tx.status]}/></td>
                </tr>
              ))}
              {filtered.length===0 && (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-gray-400">Nta makuru ahuye.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400 flex items-center justify-between">
          <span>Werekana {filtered.length} muri {visibleTransactions.length} ingendo</span>
          {isCaptain && <span className="text-amber-600 font-medium">Werekana ingendo zawe gusa</span>}
        </div>
      </div>

      {/* Record trip modal */}
      {modal && (
        <Modal title="Andika Urugendo Rushya" onClose={() => setModal(false)}
          footer={<>
            <button onClick={() => setModal(false)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Reka</button>
            <button onClick={submit} disabled={!form.route||!form.captain||form.passengers<1}
              className="px-4 py-2 rounded-xl bg-[#0A2558] text-white text-sm font-semibold hover:bg-[#0d2d6b] disabled:opacity-50">
              Bika Urugendo
            </button>
          </>}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Inzira *</label>
              {isCaptain ? (
                <div className="w-full border border-gray-100 bg-gray-50 rounded-xl px-3 py-2 text-sm text-gray-600 font-medium">
                  {form.route} — {form.from} → {form.to}
                </div>
              ) : (
                <select value={form.route} onChange={e => handleRouteChange(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30">
                  <option value="">— Hitamo inzira —</option>
                  {routes.filter(r=>r.status==='Active').map(r => (
                    <option key={r.id} value={r.number}>{r.number} — {r.from} → {r.to}</option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Umushoferi *</label>
              {isCaptain ? (
                <div className="w-full border border-gray-100 bg-gray-50 rounded-xl px-3 py-2 text-sm text-gray-600 font-medium">
                  {captainName}
                </div>
              ) : (
                <select value={form.captain} onChange={e => setForm(f => ({...f,captain:e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30">
                  <option value="">— Hitamo umushoferi —</option>
                  {captains.filter(c=>c.status==='On Duty').map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Umubare w’Abagenzi *</label>
              <input type="number" min="1" value={form.passengers||''}
                onChange={e => handlePassengersChange(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30"
                placeholder="urugero: 42"/>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Amafaranga (RWF)</label>
              <input type="number" value={form.amount||''}
                onChange={e => setForm(f => ({...f,amount:Number(e.target.value)}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30"/>
              {form.route && routes.find(r=>r.number===form.route) && (
                <p className="text-[11px] text-gray-400 mt-1">Igiciro cy’inzira: RWF {routes.find(r=>r.number===form.route)!.fare.toLocaleString()} / umuntu</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Uburyo bwo Kwishyura</label>
              <select value={form.method} onChange={e => setForm(f => ({...f,method:e.target.value as PaymentMethod}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30">
                <option>MoMo</option><option>Airtel</option><option>Cash</option><option>Card</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Imiterere</label>
              <select value={form.status} onChange={e => setForm(f => ({...f,status:e.target.value as TxStatus}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30">
                <option value="Success">Byakunze</option>
                <option value="Pending">Biracyategereje</option>
                <option value="Failed">Byanze</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Italiki n’Isaha</label>
              <input type="datetime-local" value={form.date.replace(' ','T')}
                onChange={e => setForm(f => ({...f,date:e.target.value.replace('T',' ')}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30"/>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
