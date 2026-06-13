import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff, LogIn, ChevronDown, ChevronUp, MapPin } from 'lucide-react'
import { useAuth, DEMO_ACCOUNTS } from '../store/AuthContext'
import { useRoleLabel } from '../lib/i18nHelpers'
import { ROLE_BADGE_CLASS } from '../lib/roles'
import LanguageSwitcher from '../components/LanguageSwitcher'
import LiveTracking from './LiveTracking'

function HorizonLogoSVG() {
  return (
    <svg width="48" height="48" viewBox="0 0 36 36" fill="none">
      <path d="M4 28 L14 18 L22 18 L32 28 Z" fill="#ef4444" opacity="0.25"/>
      <path d="M16 18 L16 28" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" opacity="0.5"/>
      <path d="M20 18 L20 28" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" opacity="0.5"/>
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

export default function LoginPage() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [showDemo, setShowDemo] = useState(false)
  const [showTrack, setShowTrack] = useState(false)

  if (showTrack) {
    return (
      <div className="min-h-screen bg-[#f0f2f7]">
        <header className="bg-[#0A2558] px-6 py-4 flex items-center justify-between">
          <div className="text-white font-bold">{t('login.customerTracking')}</div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher variant="dark" />
            <button onClick={() => setShowTrack(false)} className="text-sm text-blue-200 hover:text-white font-semibold">
              {t('login.backToSignIn')}
            </button>
          </div>
        </header>
        <main className="p-5 lg:p-7 max-w-6xl mx-auto">
          <LiveTracking publicView />
        </main>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    const result = await login(email.trim(), password)
    if (!result.ok) setError(result.error ?? t('login.error'))
    setLoading(false)
  }

  const fillCredentials = (e: string, p: string) => {
    setEmail(e); setPassword(p); setError('')
  }

  const features = ['login.feature1', 'login.feature2', 'login.feature3', 'login.feature4'] as const

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #071a40 0%, #0A2558 60%, #0d2d6b 100%)' }}>
      <div className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 p-12 border-r border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <HorizonLogoSVG />
            <div>
              <div className="text-2xl font-extrabold text-red-500 tracking-tight leading-tight">HORIZON</div>
              <div className="text-xs font-bold text-white/60 tracking-widest leading-tight">EXPRESS</div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white leading-snug mb-4">
            {t('login.systemTitle')}<br/>
            <span className="text-red-400">{t('login.systemTitleHighlight')}</span>
          </h1>
          <p className="text-blue-200/60 text-sm leading-relaxed">
            {t('login.systemDesc')}
          </p>
        </div>

        <div className="space-y-3">
          {features.map(key => (
            <div key={key} className="flex items-center gap-3 text-sm text-blue-200/70">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0"/>
              {t(key)}
            </div>
          ))}
          <p className="text-xs text-white/30 pt-4 border-t border-white/10 whitespace-pre-line">
            {t('login.companyFooter')}
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex lg:hidden items-center gap-3 justify-center mb-8">
            <HorizonLogoSVG />
            <div>
              <div className="text-2xl font-extrabold text-red-500">HORIZON</div>
              <div className="text-xs font-bold text-white/60 tracking-widest">EXPRESS</div>
            </div>
          </div>

          <div className="flex justify-end mb-3 lg:absolute lg:top-6 lg:right-6">
            <LanguageSwitcher variant="dark" />
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-gray-800">{t('login.title')}</h2>
              <p className="text-sm text-gray-400 mt-1">{t('login.subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                  {t('login.email')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  placeholder="you@horizon.rw"
                  required
                  autoComplete="email"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0A2558] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                  {t('login.password')}
                </label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError('') }}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0A2558] transition-colors pr-11"
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1">
                    {showPw ? <EyeOff size={17}/> : <Eye size={17}/>}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0A2558] hover:bg-[#0d2d6b] text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
              >
                {loading
                  ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
                  : <><LogIn size={17}/> {t('login.signIn')}</>
                }
              </button>
            </form>

            <button
              onClick={() => setShowTrack(true)}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-[#0A2558]/20 text-[#0A2558] font-bold text-sm hover:bg-blue-50 transition-colors"
            >
              <MapPin size={16}/> {t('login.trackBuses')}
            </button>

            <div className="mt-6 border-t border-gray-100 pt-5">
              <button onClick={() => setShowDemo(v => !v)}
                className="w-full flex items-center justify-between text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors">
                <span>{t('login.demoAccounts')}</span>
                {showDemo ? <ChevronUp size={15}/> : <ChevronDown size={15}/>}
              </button>

              {showDemo && (
                <div className="mt-3 space-y-2">
                  {DEMO_ACCOUNTS.map(u => (
                    <DemoAccountRow key={u.email} account={u} onSelect={fillCredentials} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <p className="text-center text-white/30 text-xs mt-6">
            {t('login.copyright')}
          </p>
        </div>
      </div>
    </div>
  )
}

function DemoAccountRow({ account, onSelect }: { account: typeof DEMO_ACCOUNTS[number]; onSelect: (e: string, p: string) => void }) {
  const roleLabel = useRoleLabel(account.role)
  return (
    <button
      onClick={() => onSelect(account.email, account.password)}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-100 hover:border-[#0A2558]/30 hover:bg-blue-50/40 transition-all text-left group"
    >
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${ROLE_BADGE_CLASS[account.role]}`}>
        {roleLabel}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-gray-700 truncate">{account.name}</div>
        <div className="text-[10px] text-gray-400 truncate">{account.email}</div>
      </div>
      <span className="font-mono text-[10px] text-gray-400 group-hover:text-[#0A2558] flex-shrink-0">{account.password}</span>
    </button>
  )
}
