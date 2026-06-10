import { useState, useEffect } from 'react'
import { useAuth, can } from './store/AuthContext'
import { useLanguage } from './store/LanguageContext'
import LoginPage from './pages/LoginPage'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import PaymentTransactions from './pages/PaymentTransactions'
import Reports from './pages/Reports'
import AuditLog from './pages/AuditLog'
import RouteMap from './pages/RouteMap'
import PaymentTerminal from './pages/PaymentTerminal'
import BusProfile from './pages/BusProfile'
import BusCaptain from './pages/BusCaptain'
import Modal from './components/shared/Modal'
import Avatar from './components/shared/Avatar'
import { Menu, ShieldAlert } from 'lucide-react'

function KigaliClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t) }, [])
  const time = new Intl.DateTimeFormat('en-RW', { timeZone: 'Africa/Kigali', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now)
  const date = new Intl.DateTimeFormat('en-RW', { timeZone: 'Africa/Kigali', weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(now)
  return (
    <div className="hidden md:flex flex-col items-end mr-1">
      <span className="text-sm font-bold text-gray-700 tabular-nums">{time} <span className="text-xs font-medium text-gray-400">EAT</span></span>
      <span className="text-xs text-gray-400">{date} · Kigali</span>
    </div>
  )
}

function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
      <ShieldAlert size={48} className="text-red-300 mb-4"/>
      <p className="text-lg font-bold text-gray-600">Access Denied</p>
      <p className="text-sm mt-1">You do not have permission to view this page.</p>
    </div>
  )
}

function PageContent({ active }: { active: string }) {
  const { user } = useAuth()
  if (!user) return null
  const role = user.role

  switch (active) {
    case 'dashboard':         return <Dashboard />
    case 'payments':          return <PaymentTransactions />
    case 'reports':           return can.seeReports(role)   ? <Reports />        : <AccessDenied />
    case 'audit':             return can.seeAuditLog(role)  ? <AuditLog />       : <AccessDenied />
    case 'route-map':         return can.seeSetup(role)     ? <RouteMap />       : <AccessDenied />
    case 'payment-terminal':  return can.seeSetup(role)     ? <PaymentTerminal /> : <AccessDenied />
    case 'bus-profile':       return can.seeSetup(role)     ? <BusProfile />     : <AccessDenied />
    case 'bus-captain':       return can.seeSetup(role)     ? <BusCaptain />     : <AccessDenied />
    default:                  return <Dashboard />
  }
}

export default function App() {
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const [active, setActive]           = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [logoutModal, setLogoutModal] = useState(false)

  if (!user) return <LoginPage />

  const PAGE_TITLE: Record<string, string> = {
    dashboard:          t('nav.dashboard'),
    payments:           t('nav.payments'),
    reports:            t('nav.reports'),
    audit:              t('nav.audit'),
    'route-map':        t('nav.routeMap'),
    'payment-terminal': t('nav.paymentTerminal'),
    'bus-profile':      t('nav.busProfile'),
    'bus-captain':      t('nav.busCaptain'),
  }

  const ROLE_BADGE: Record<string, string> = {
    admin:   'bg-[#0A2558] text-white',
    agent:   'bg-emerald-700 text-white',
    captain: 'bg-amber-600 text-white',
  }
  const ROLE_LABEL: Record<string, string> = { admin: 'Admin', agent: 'Agent', captain: 'Captain' }

  return (
    <div className="min-h-screen bg-[#f0f2f7] flex overflow-hidden">
      {/* Sidebar - fixed on mobile, sticky on desktop */}
      <div className={`fixed lg:sticky top-0 h-screen z-50 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 shadow-xl lg:shadow-none'}`}>
        <Sidebar
          active={active}
          onNavigate={id => { setActive(id); setSidebarOpen(false) }}
          onLogout={() => setLogoutModal(true)}
        />
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)}/>
      )}

      <div className="flex-1 flex flex-col min-h-screen min-w-0 h-screen">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-7 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-2 lg:gap-3">
            <button className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} className="text-gray-600"/>
            </button>
            <h1 className="text-lg lg:text-xl font-bold text-gray-800 truncate max-w-[150px] sm:max-w-none">{PAGE_TITLE[active] ?? 'Dashboard'}</h1>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <KigaliClock />
            <div className="h-8 w-px bg-gray-200 hidden md:block"/>
            <div className="flex items-center gap-2.5">
              <Avatar name={user.name} size="md"/>
              <div className="hidden sm:block text-right">
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-sm font-bold text-gray-800 leading-tight">{user.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ROLE_BADGE[user.role]}`}>
                    {ROLE_LABEL[user.role]}
                  </span>
                </div>
                <div className="text-xs text-gray-400 leading-tight truncate max-w-[220px]">{user.title}</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-7 overflow-x-hidden">
          <PageContent active={active}/>
        </main>

        <footer className="text-center text-[10px] sm:text-xs text-gray-400 py-3 px-4 border-t border-gray-200 bg-white">
          HORIZON Express Ltd · Nyabugogo, Kigali, Rwanda · v1.0.0
        </footer>
      </div>

      {logoutModal && (
        <Modal title={t('nav.logout')} onClose={() => setLogoutModal(false)}
          footer={<>
            <button onClick={() => setLogoutModal(false)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">{t('common.cancel')}</button>
            <button onClick={() => { logout(); setLogoutModal(false) }} className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700">
              {t('nav.logout')}
            </button>
          </>}>
          <p className="text-sm text-gray-600">
            {t('nav.logoutConfirm')} <strong>{user.name}</strong>?
          </p>
        </Modal>
      )}
    </div>
  )
}
