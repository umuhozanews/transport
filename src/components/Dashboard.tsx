import InsightCards from './InsightCards'
import MostEngagingRoutes from './MostEngagingRoutes'
import TicketsRevenue from './TicketsRevenue'
import RevenueChart from './RevenueChart'

export default function Dashboard() {
  return (
    <div className="space-y-5">
      {/* Today Insights section */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 mb-3 tracking-wide">Today Insights</h2>

        {/* Two-column: left (cards + tickets) | right (routes) */}
        <div className="grid grid-cols-[1fr_300px] gap-4">
          {/* Left column */}
          <div className="space-y-4">
            <InsightCards />
            <TicketsRevenue />
          </div>

          {/* Right column — routes panel */}
          <div>
            <MostEngagingRoutes />
          </div>
        </div>
      </section>

      {/* Revenue chart full width */}
      <RevenueChart />
    </div>
  )
}
