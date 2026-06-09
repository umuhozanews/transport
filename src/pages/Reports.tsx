import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import { ChevronDown, ChevronRight, TrendingUp, Users, DollarSign } from 'lucide-react'
import { useApp } from '../store/AppContext'

interface TipProps { active?:boolean; payload?:{value:number;name:string}[]; label?:string }
function Tip({ active, payload, label }:TipProps) {
  if (!active||!payload?.length) return null
  return (
    <div className="bg-[#1e293b] text-white text-xs px-3 py-2 rounded-lg shadow-lg">
      <div className="font-bold mb-1">{label}</div>
      <div>RWF {payload[0].value>=1000000 ? `${(payload[0].value/1000000).toFixed(1)}M` : payload[0].value.toLocaleString()}</div>
    </div>
  )
}

export default function Reports() {
  const { transactions } = useApp()
  const [expandedDay, setExpandedDay] = useState<string|null>(null)
  const [selectedYear, setSelectedYear] = useState('2024')

  // ── monthly aggregation ──────────────────────────────────────────────────
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const monthlyData = useMemo(() => {
    const base = MONTHS.map((m,i) => ({ month:m, revenue:0, index:i }))
    transactions.forEach(tx => {
      const d = tx.date.slice(0,10)
      if (!d.startsWith(selectedYear)) return
      const mi = parseInt(d.slice(5,7)) - 1
      if (mi>=0&&mi<12) base[mi].revenue += tx.amount
    })
    // fill zeros with seed data for visual richness if no real data
    const hasReal = base.some(b => b.revenue > 0)
    if (!hasReal) {
      const seeds = [22000000,19500000,14200000,17800000,35620000,26400000,30100000,21000000,24600000,25900000,32800000,28500000]
      seeds.forEach((v,i) => { base[i].revenue = v })
    }
    return base
  }, [transactions, selectedYear])

  const peakMonth = monthlyData.reduce((a,b) => a.revenue>b.revenue?a:b)
  const totalRevenue = monthlyData.reduce((s,d) => s+d.revenue, 0)
  const avgMonthly  = Math.floor(totalRevenue/12)

  // ── daily breakdown ──────────────────────────────────────────────────────
  const dailyData = useMemo(() => {
    const acc: Record<string, { date:string; trips:number; passengers:number; revenue:number; methods:Record<string,number> }> = {}
    transactions.forEach(tx => {
      const d = tx.date.slice(0,10)
      if (!acc[d]) acc[d] = { date:d, trips:0, passengers:0, revenue:0, methods:{} }
      acc[d].trips += 1
      acc[d].passengers += tx.passengers
      acc[d].revenue += tx.amount
      acc[d].methods[tx.method] = (acc[d].methods[tx.method]||0) + tx.amount
    })
    return Object.values(acc).sort((a,b) => b.date.localeCompare(a.date))
  }, [transactions])

  const years = [...new Set(transactions.map(t => t.date.slice(0,4)))].sort((a,b) => b.localeCompare(a))
  if (!years.includes(selectedYear) && years.length) setSelectedYear(years[0])

  const dayTx = (date:string) => transactions.filter(tx => tx.date.startsWith(date))

  return (
    <div className="space-y-5">
      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={15} className="text-[#4a6cf7]"/>
            <p className="text-xs text-gray-500 font-medium">Amafaranga y’Umwaka</p>
          </div>
          <p className="text-2xl font-bold text-[#4a6cf7]">RWF {(totalRevenue/1000000).toFixed(1)}M</p>
          <p className="text-xs text-gray-400 mt-0.5">Umwaka wa {selectedYear}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={15} className="text-emerald-500"/>
            <p className="text-xs text-gray-500 font-medium">Impuzandengo ku Kwezi</p>
          </div>
          <p className="text-2xl font-bold text-emerald-600">RWF {(avgMonthly/1000000).toFixed(1)}M</p>
          <p className="text-xs text-gray-400 mt-0.5">Amezi 12</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={15} className="text-amber-500"/>
            <p className="text-xs text-gray-500 font-medium">Ukwezi Kwungutse cyane</p>
          </div>
          <p className="text-2xl font-bold text-amber-600">{peakMonth.month}</p>
          <p className="text-xs text-gray-400 mt-0.5">RWF {(peakMonth.revenue/1000000).toFixed(1)}M</p>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-700">Imiterere y’Amafaranga buri kwezi — {selectedYear}</h3>
            <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#4a6cf7]/30">
              {(years.length ? years : ['2024']).map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} barSize={32} margin={{top:10,right:0,left:10,bottom:0}}>
                <CartesianGrid vertical={false} stroke="#f1f5f9"/>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill:'#94a3b8',fontSize:12}}/>
                <YAxis axisLine={false} tickLine={false} tick={{fill:'#94a3b8',fontSize:11}} tickFormatter={v=>`${(v/1000000).toFixed(0)}M`}/>
                <Tooltip content={<Tip/>} cursor={{fill:'transparent'}}/>
                <Bar dataKey="revenue" radius={[6,6,0,0]}>
                  {monthlyData.map(e => <Cell key={e.month} fill={e.month===peakMonth.month?'#4a6cf7':'#c7d2fe'}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Daily reports */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Users size={16} className="text-[#4a6cf7]"/>
          <h3 className="text-sm font-bold text-gray-700">Raporo y’Iminsi n’Ingendo</h3>
          <span className="ml-auto text-xs text-gray-400">{dailyData.length} iminsi yabonetse</span>
        </div>

        {dailyData.length === 0 ? (
          <div className="px-5 py-12 text-center text-gray-400 text-sm">Nta makuru y’ingendo arahari kuri ubu.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {dailyData.map(day => {
              const isOpen = expandedDay === day.date
              const txs = dayTx(day.date)
              return (
                <div key={day.date}>
                  {/* Day summary row */}
                  <button
                    onClick={() => setExpandedDay(isOpen ? null : day.date)}
                    className="w-full flex items-center px-5 py-4 hover:bg-gray-50/70 transition-colors text-left"
                  >
                    <span className="flex-shrink-0 mr-3 text-gray-400">
                      {isOpen ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
                    </span>
                    <span className="font-semibold text-gray-700 w-32 flex-shrink-0">{day.date}</span>
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <div>
                        <span className="text-xs text-gray-400 block">Ingendo zose</span>
                        <span className="text-sm font-bold text-gray-800">{day.trips}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 block">Abagenzi</span>
                        <span className="text-sm font-bold text-gray-800">{day.passengers}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 block">Igiteranyo cy’Amafaranga</span>
                        <span className="text-sm font-bold text-[#4a6cf7]">RWF {day.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </button>

                  {/* Expanded transactions */}
                  {isOpen && (
                    <div className="bg-blue-50/40 border-t border-b border-blue-100/60">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-blue-50/80">
                              {['ID','Inzira n’Icyerekezo','Umushoferi','Igihe','Abagenzi','Amafaranga (RWF)','Imiterere'].map(h => (
                                <th key={h} className="px-4 py-2 text-left font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-blue-100/60">
                            {txs.map(tx => (
                              <tr key={tx.id} className="hover:bg-white/60">
                                <td className="px-4 py-2.5 font-mono text-gray-400">{tx.id}</td>
                                <td className="px-4 py-2.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="bg-[#0A2558] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">{tx.route}</span>
                                    <span className="text-gray-600">{tx.from} → {tx.to}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-2.5 text-gray-700 whitespace-nowrap">{tx.captain}</td>
                                <td className="px-4 py-2.5 text-gray-500 whitespace-nowrap">{tx.date.slice(11)}</td>
                                <td className="px-4 py-2.5 text-center text-gray-700">{tx.passengers}</td>
                                <td className="px-4 py-2.5 font-semibold text-gray-800">{tx.amount.toLocaleString()}</td>
                                <td className="px-4 py-2.5">
                                  <span className={`font-semibold text-xs ${tx.status==='Success'?'text-emerald-600':tx.status==='Pending'?'text-amber-600':'text-red-500'}`}>{tx.status==='Success'?'Byakunze':tx.status==='Pending'?'Biracyategereje':'Byanze'}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-blue-50/80 font-bold">
                              <td colSpan={4} className="px-4 py-2.5 text-gray-600 text-right text-xs">Igiteranyo cy’umunsi:</td>
                              <td className="px-4 py-2.5 text-center text-gray-800">{day.passengers}</td>
                              <td className="px-4 py-2.5 text-[#4a6cf7]">{day.revenue.toLocaleString()}</td>
                              <td colSpan={1}/>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
