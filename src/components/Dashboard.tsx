import InsightCards from './InsightCards'
import MostEngagingRoutes from './MostEngagingRoutes'
import TicketsRevenue from './TicketsRevenue'
import RevenueChart from './RevenueChart'
import { useLanguage } from '../store/LanguageContext'

export default function Dashboard() {
  const { t } = useLanguage()

  return (
    <div className="space-y-5">
      {/* Today Insights section */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 mb-3 tracking-wide">{t('db.todayInsights')}</h2>

        {/* Two-column on large screens, stacked on mobile */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4 lg:gap-6">
          {/* Left column */}
          <div className="space-y-4 lg:space-y-6">
            <InsightCards />
            <TicketsRevenue />
          </div>

          {/* Right column — routes panel */}
          <div className="xl:h-full">
            <MostEngagingRoutes />
          </div>
        </div>
      </section>

      {/* Revenue chart full width */}
      <RevenueChart />
    </div>
  )
}
