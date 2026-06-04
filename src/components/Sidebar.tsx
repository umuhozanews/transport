import { useState } from 'react'
import {
  LayoutDashboard, CreditCard, BarChart2, ScrollText,
  Settings, LogOut, ChevronDown, ChevronRight,
} from 'lucide-react'
import { useAuth, can } from '../store/AuthContext'

function HorizonLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <path d="M4 28 L14 18 L22 18 L32 28 Z" fill="#ef4444" opacity="0.25"/>
      <path d="M16 18 L16 28" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" opacity="0.6"/>
      <path d="M20 18 L20 28" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" opacity="0.6"/>
      <rect x="3" y="17" width="30" height="2.5" rx="1.25" fill="#ef4444"/>
      <path d="M8 17 A10 10 0 0 1 28 17 Z" fill="#ef4444" opacity="0.8"/>
      <path d="M10 17 A8 8 0 0 1 26 17 Z" fill="#ff6b6b"/>
      <line x1="18" y1="5" x2="18" y2="8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
      <line x1="10" y1="8" x2="12" y2="10" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
      <line x1="26" y1="8" x2="24" y2="10" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
      <line x1="6" y1="14" x2="9" y2="14" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
      <line x1="30" y1="14" x2="27" y2="14" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  children?: { id: string; label: string }[]
}

interface SidebarProps {
  active: string
  onNavigate: (id: string) => void
  onLogout: () => void
}

const ROLE_COLOR: Record<string, string> = {
  admin:   'bg-white/15 text-white',
  agent:   'bg-emerald-500/20 text-emerald-300',
  captain: 'bg-amber-500/20 text-amber-300',
}
const ROLE_LABEL: Record<string, string> = { admin: 'Admin', agent: 'Agent', captain: 'Captain' }

export default function Sidebar({ active, onNavigate, onLogout }: SidebarProps) {
  const { user } = useAuth()
  const [setupOpen, setSetupOpen] = useState(true)
  const role = user?.role ?? 'agent'

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard',             icon: <LayoutDashboard size={19}/> },
    { id: 'payments',  label: 'Payment Transactions',  icon: <CreditCard size={19}/> },
    ...(can.seeReports(role)  ? [{ id: 'reports', label: 'Reports',   icon: <BarChart2 size={19}/> }] : []),
    ...(can.seeAuditLog(role) ? [{ id: 'audit',   label: 'Audit Log', icon: <ScrollText size={19}/> }] : []),
    ...(can.seeSetup(role) ? [{
      id: 'setup', label: 'Setup', icon: <Settings size={19}/>,
      children: [
        { id: 'route-map',         label: 'Route Map' },
        { id: 'payment-terminal',  label: 'Payment Terminal' },
        { id: 'bus-profile',       label: 'Bus Profile' },
        { id: 'bus-captain',       label: 'Bus Captain' },
      ],
    }] : []),
  ]

  return (
    <aside className="fixed top-0 left-0 h-screen w-[280px] bg-[#0A2558] flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <HorizonLogo />
          <div>
            <div className="text-xl font-extrabold text-red-500 tracking-tight leading-tight">HORIZON</div>
            <div className="text-[11px] font-bold text-white/60 tracking-widest leading-tight">EXPRESS</div>
          </div>
        </div>
        <p className="text-[10px] text-blue-300/40 mt-1.5 tracking-widest uppercase">Bus Company · Rwanda</p>
      </div>

      {/* Logged-in user strip */}
      {user && (
        <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">{user.name}</div>
            <div className="text-[10px] text-blue-300/60 truncate">{user.title}</div>
          </div>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${ROLE_COLOR[role]}`}>
            {ROLE_LABEL[role]}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(item => {
          const isActive    = active === item.id
          const hasChildren = !!item.children
          const isSetup     = item.id === 'setup'

          return (
            <div key={item.id}>
              <button
                onClick={() => { if (isSetup) setSetupOpen(o => !o); else onNavigate(item.id) }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive ? 'bg-white/15 text-white' : 'text-blue-200/65 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-blue-300/65'}>{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {hasChildren && (
                  <span className="text-blue-300/65">
                    {setupOpen ? <ChevronDown size={15}/> : <ChevronRight size={15}/>}
                  </span>
                )}
              </button>

              {hasChildren && setupOpen && (
                <div className="mt-0.5 ml-5 space-y-0.5">
                  {item.children!.map(child => {
                    const childActive = active === child.id
                    return (
                      <button key={child.id} onClick={() => onNavigate(child.id)}
                        className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-sm transition-all duration-150 ${
                          childActive ? 'text-white font-semibold' : 'text-blue-200/55 hover:text-white font-medium'
                        }`}>
                        <span className="w-1.5 h-1.5 rounded-full border border-current flex-shrink-0"/>
                        {child.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 pb-6">
        <button onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-blue-200/65 hover:bg-white/10 hover:text-white transition-all duration-150">
          <LogOut size={19} className="text-blue-300/65"/>
          Logout
        </button>
      </div>
    </aside>
  )
}
