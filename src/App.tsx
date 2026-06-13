import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth, can } from './store/AuthContext'
import { useApp } from './store/AppContext'
import LoginPage from './pages/LoginPage'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Reports from './pages/Reports'
import AuditLog from './pages/AuditLog'
import RouteMap from './pages/RouteMap'
import BusProfile from './pages/BusProfile'
import BusCaptain from './pages/BusCaptain'
import LiveTracking from './pages/LiveTracking'
import Modal from './components/shared/Modal'
import Avatar from './components/shared/Avatar'
import LanguageSwitcher from './components/LanguageSwitcher'
import { useRoleLabel } from './lib/i18nHelpers'
import { ROLE_BADGE_CLASS } from './lib/roles'
import { Menu, ShieldAlert } from 'lucide-react'

const PAGE_KEYS: Record<string, string> = {
  dashboard: 'pages.dashboard',
  'live-tracking': 'pages.liveTracking',
  reports: 'pages.reports',
  audit: 'pages.audit',
  'route-map': 'pages.routeMap',
  'bus-profile': 'pages.busProfile',
  'bus-captain': 'pages.busCaptain',
}

function KigaliClock() {
  const { t, i18n } = useTranslation()
  const [now, setNow] = useState(new Date())
  useEffect(() => { const timer = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(timer) }, [])
  const locale = i18n.language?.startsWith('en') ? 'en-RW' : 'rw-RW'
  const time = new Intl.DateTimeFormat(locale, { timeZone: 'Africa/Kigali', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now)
  const date = new Intl.DateTimeFormat(locale, { timeZone: 'Africa/Kigali', weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(now)
  return (
    <div className="hidden md:flex flex-col items-end mr-1">
      <span className="text-sm font-bold text-gray-700 tabular-nums">{time} <span className="text-xs font-medium text-gray-400">{t('common.eat')}</span></span>
      <span className="text-xs text-gray-400">{date} · {t('common.kigali')}</span>
    </div>
  )
}

function AccessDenied() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
      <ShieldAlert size={48} className="text-red-300 mb-4"/>
      <p className="text-lg font-bold text-gray-600">{t('auth.accessDenied')}</p>
      <p className="text-sm mt-1">{t('auth.noPermission')}</p>
    </div>
  )
}

function PageContent({ active }: { active: string }) {
  const { user } = useAuth()
  if (!user) return null
  const role = user.role

  switch (active) {
    case 'dashboard':         return <Dashboard />
    case 'live-tracking':     return <LiveTracking />
    case 'reports':           return can.seeReports(role)   ? <Reports />        : <AccessDenied />
    case 'audit':             return can.seeAuditLog(role)  ? <AuditLog />       : <AccessDenied />
    case 'route-map':         return can.seeSetup(role)     ? <RouteMap />       : <AccessDenied />
    case 'bus-profile':       return can.seeSetup(role)     ? <BusProfile />     : <AccessDenied />
    case 'bus-captain':       return can.seeSetup(role)     ? <BusCaptain />     : <AccessDenied />
    default:                  return <Dashboard />
  }
}

export default function App() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const { loading, error } = useApp()
  const roleLabel = useRoleLabel(user?.role ?? 'agent')
  const [active, setActive]           = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [logoutModal, setLogoutModal] = useState(false)

  if (!user) return <LoginPage />

  return (
    <div className="min-h-screen bg-[#f0f2f7] flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)}/>
      )}

      <div className={`fixed lg:static inset-y-0 left-0 z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar
          active={active}
          onNavigate={id => { setActive(id); setSidebarOpen(false) }}
          onLogout={() => setLogoutModal(true)}
        />
      </div>

      <div className="flex-1 lg:ml-[280px] flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-5 lg:px-7 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} className="text-gray-600"/>
            </button>
            <h1 className="text-xl font-bold text-gray-800">{t(PAGE_KEYS[active] ?? 'pages.dashboard')}</h1>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <KigaliClock />
            <div className="h-8 w-px bg-gray-200 hidden md:block"/>
            <div className="flex items-center gap-2.5">
              <Avatar name={user.name} size="md"/>
              <div className="hidden sm:block text-right">
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-sm font-bold text-gray-800 leading-tight">{user.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ROLE_BADGE_CLASS[user.role]}`}>
                    {roleLabel}
                  </span>
                </div>
                <div className="text-xs text-gray-400 leading-tight truncate max-w-[220px]">{user.title}</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 lg:p-7 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="w-8 h-8 border-2 border-[#0A2558]/20 border-t-[#0A2558] rounded-full animate-spin"/>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 text-sm">
              {error}
            </div>
          ) : (
            <PageContent active={active}/>
          )}
        </main>

        <footer className="text-center text-xs text-gray-400 py-3 border-t border-gray-200 bg-white">
          {t('footer.text')}
        </footer>
      </div>

      {logoutModal && (
        <Modal title={t('auth.confirmLogout')} onClose={() => setLogoutModal(false)}
          footer={<>
            <button onClick={() => setLogoutModal(false)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">{t('common.cancel')}</button>
            <button onClick={async () => { await logout(); setLogoutModal(false) }} className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700">
              {t('common.logout')}
            </button>
          </>}>
          <p className="text-sm text-gray-600">
            {t('auth.logoutQuestion', { name: user.name })}
            <br/><span className="text-gray-400 text-xs">{t('auth.logoutNote')}</span>
          </p>
        </Modal>
      )}
    </div>
  )
}
