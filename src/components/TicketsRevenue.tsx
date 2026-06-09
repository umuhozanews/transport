import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { useApp } from '../store/AppContext'
import { useLanguage } from '../store/LanguageContext'

const METHOD_COLORS: Record<string, string> = {
  MoMo: '#F59E0B', Cash: '#10B981', Airtel: '#EF4444', Card: '#3B82F6',
}

const todayKey = () =>
  new Intl.DateTimeFormat('sv-SE', { timeZone: 'Africa/Kigali' }).format(new Date())

export default function TicketsRevenue() {
  const { transactions } = useApp()
  const { language, t } = useLanguage()
  const today = todayKey()
  const todayTx = transactions.filter(tx => tx.date.startsWith(today))

  const totalRevenue    = todayTx.reduce((s, tx) => s + tx.amount, 0)
  const totalPassengers = todayTx.reduce((s, tx) => s + tx.passengers, 0)

  const revenueData = ['MoMo', 'Airtel', 'Cash', 'Card']
    .map(m => ({
      name: m === 'MoMo' ? 'MTN MoMo' : m === 'Airtel' ? 'Airtel Money' : m,
      key: m,
      value: todayTx.filter(tx => tx.method === m).reduce((s, tx) => s + tx.amount, 0),
      color: METHOD_COLORS[m],
    }))
    .filter(d => d.value > 0)

  const displayData  = revenueData.length ? revenueData : [{ name: 'No data', key: 'none', value: 1, color: '#e2e8f0' }]
  const showTotal    = totalRevenue > 0

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-2">
            <div className="text-4xl lg:text-5xl font-extrabold text-[#0A2558]">
              {totalPassengers > 0 ? totalPassengers.toLocaleString() : '—'}
            </div>
            <div className="text-[11px] lg:text-xs text-gray-400 font-bold mt-1 uppercase tracking-wider">{t('db.passengersToday')}</div>
          </div>
          <p className="text-sm text-gray-500 max-w-[200px]">
            {language === 'rw' ? 'Umubare w’abagenzi bose bishyuwe uyu munsi mu nzira zose.' : 'Total number of paid passengers recorded today across all routes.'}
          </p>
        </div>

        <div className="hidden sm:block w-px bg-gray-100" />
        <div className="block sm:hidden h-px bg-gray-100 w-full" />

        <div className="flex-1 flex flex-col items-center">
          <div className="text-sm font-bold text-gray-700 self-start">{t('db.revenueToday')}</div>
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
