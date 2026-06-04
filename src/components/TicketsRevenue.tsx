import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { useApp } from '../store/AppContext'

const METHOD_COLORS: Record<string, string> = {
  MoMo: '#F59E0B', Cash: '#10B981', Airtel: '#EF4444', Card: '#3B82F6',
}

const todayKey = () =>
  new Intl.DateTimeFormat('sv-SE', { timeZone: 'Africa/Kigali' }).format(new Date())

function AdultIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="9" r="5" fill="#0A2558"/>
      <path d="M4 26c0-5.523 4.477-10 10-10s10 4.477 10 10" fill="#0A2558" opacity="0.8"/>
    </svg>
  )
}
function ChildIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="7" r="4" fill="#4a6cf7"/>
      <path d="M3 21c0-4.418 3.582-8 8-8s8 3.582 8 8" fill="#4a6cf7" opacity="0.8"/>
    </svg>
  )
}

export default function TicketsRevenue() {
  const { transactions } = useApp()
  const today = todayKey()
  const todayTx = transactions.filter(tx => tx.date.startsWith(today))

  const totalRevenue    = todayTx.reduce((s, tx) => s + tx.amount, 0)
  const totalPassengers = todayTx.reduce((s, tx) => s + tx.passengers, 0)
  const adults  = Math.round(totalPassengers * 0.856)
  const children = totalPassengers - adults

  const revenueData = ['MoMo', 'Airtel', 'Cash', 'Card']
    .map(m => ({
      name: m === 'MoMo' ? 'MTN MoMo' : m === 'Airtel' ? 'Airtel Money' : m,
      key: m,
      value: todayTx.filter(tx => tx.method === m).reduce((s, tx) => s + tx.amount, 0),
      color: METHOD_COLORS[m],
    }))
    .filter(d => d.value > 0)

  const displayData  = revenueData.length ? revenueData : [{ name: 'Nta makuru', key: 'none', value: 1, color: '#e2e8f0' }]
  const showTotal    = totalRevenue > 0

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="mb-5">
            <div className="text-4xl font-bold text-[#0A2558]">
              {totalPassengers > 0 ? totalPassengers.toLocaleString() : '—'}
            </div>
            <div className="text-[11px] text-gray-400 font-bold mt-1 uppercase tracking-wider">Abagenzi b'uyu munsi</div>
            <div className="text-sm text-gray-500 mt-0.5">Passengers Today</div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
              <div className="w-10 h-10 rounded-full bg-[#0A2558]/10 flex items-center justify-center flex-shrink-0">
                <AdultIcon />
              </div>
              <div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Abakuru</div>
                <div className="text-2xl font-bold text-gray-800">{adults || '—'}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-indigo-50 rounded-xl px-4 py-3">
              <div className="w-10 h-10 rounded-full bg-[#4a6cf7]/10 flex items-center justify-center flex-shrink-0">
                <ChildIcon />
              </div>
              <div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Abana</div>
                <div className="text-2xl font-bold text-gray-800">{children || '—'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-px bg-gray-100" />

        <div className="flex-1 flex flex-col items-center">
          <div className="text-sm font-bold text-gray-700 self-start">Amafaranga y'uyu munsi</div>
          <div className="text-xs text-gray-400 self-start mb-2">Today's Revenue</div>
          <div className="relative w-44 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={displayData} cx="50%" cy="50%" innerRadius={52} outerRadius={78}
                  startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                  {displayData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold text-gray-400 tracking-widest">RWF</span>
              <span className="text-base font-extrabold text-gray-800 leading-tight">
                {showTotal ? totalRevenue.toLocaleString() : '0'}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-1">
            {revenueData.map(item => (
              <div key={item.key} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-[11px] text-gray-500 font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
