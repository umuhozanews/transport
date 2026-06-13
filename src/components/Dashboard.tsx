import { useTranslation } from 'react-i18next'
import InsightCards from './InsightCards'
import ActiveOperations from './ActiveOperations'
import MostEngagingRoutes from './MostEngagingRoutes'
import PassengersToday from './PassengersToday'

export default function Dashboard() {
  const { t } = useTranslation()
  return (
    <div className="space-y-5">
      <section>
        <h2 className="text-sm font-semibold text-gray-500 mb-3 tracking-wide">{t('dashboard.todayInsights')}</h2>
        <InsightCards />
      </section>

      <ActiveOperations />

      <section>
        <div className="grid grid-cols-[1fr_300px] gap-4">
          <div>
            <PassengersToday />
          </div>
          <div>
            <MostEngagingRoutes />
          </div>
        </div>
      </section>
    </div>
  )
}
