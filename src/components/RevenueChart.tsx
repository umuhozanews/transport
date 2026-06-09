import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import { ChevronDown } from 'lucide-react'
import { useLanguage } from '../store/LanguageContext'

const monthlyData = [
  { month: 'Jan', revenue: 22000000 },
  { month: 'Feb', revenue: 19500000 },
  { month: 'Mar', revenue: 14200000 },
  { month: 'Apr', revenue: 17800000 },
  { month: 'May', revenue: 35620000 },
  { month: 'Jun', revenue: 26400000 },
  { month: 'Jul', revenue: 30100000 },
  { month: 'Aug', revenue: 21000000 },
  { month: 'Sep', revenue: 24600000 },
  { month: 'Oct', revenue: 25900000 },
  { month: 'Nov', revenue: 32800000 },
  { month: 'Dec', revenue: 28500000 },
]

const HIGHLIGHT = 'May'

interface TipProps { active?: boolean; payload?: { value: number }[] }
function CustomTooltip({ active, payload }: TipProps) {
  if (active && payload?.length) {
    return (
      <div className="bg-[#1e293b] text-white text-xs px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
        RWF {(payload[0].value / 1000000).toFixed(1)}M
      </div>
    )
  }
  return null
}

export default function RevenueChart() {
  const [year] = useState('2024')
  const { t } = useLanguage()

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-700">{t('db.revenueReport')}</h3>
          <span className="text-xs text-gray-400">{t('db.currencyNote')}</span>
        </div>
        <button className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5">
          {year} <ChevronDown size={14} />
        </button>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData} barSize={28} margin={{ top: 20, right: 0, left: 10, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis
              axisLine={false} tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
              {monthlyData.map((entry) => (
                <Cell key={entry.month} fill={entry.month === HIGHLIGHT ? '#4a6cf7' : '#c7d2fe'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
