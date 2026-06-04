import { useState } from 'react'
import { Eye, EyeOff, LogIn, ChevronDown, ChevronUp } from 'lucide-react'
import { useAuth, SYSTEM_USERS } from '../store/AuthContext'

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

const ROLE_BADGE: Record<string, { label: string; color: string }> = {
  admin:   { label: 'Admin',   color: 'bg-[#0A2558] text-white' },
  agent:   { label: 'Agent',   color: 'bg-emerald-700 text-white' },
  captain: { label: 'Captain', color: 'bg-amber-600 text-white' },
}

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [showDemo, setShowDemo] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    const result = login(email.trim(), password)
    if (!result.ok) setError(result.error ?? 'Unknown error.')
    setLoading(false)
  }

  const fillCredentials = (e: string, p: string) => {
    setEmail(e); setPassword(p); setError('')
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #071a40 0%, #0A2558 60%, #0d2d6b 100%)' }}>
      {/* Left panel — branding */}
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
            Bus Management<br/>
            <span className="text-red-400">System</span>
          </h1>
          <p className="text-blue-200/60 text-sm leading-relaxed">
            Track buses, drivers, routes, and revenue — all in one place, in real time.
          </p>
        </div>

        <div className="space-y-3">
          {[
            '9 buses in operation',
            '7 active routes across Rwanda',
            'Payments: MTN MoMo, Airtel, Cash',
            'Real-time daily reports',
          ].map(item => (
            <div key={item} className="flex items-center gap-3 text-sm text-blue-200/70">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0"/>
              {item}
            </div>
          ))}
          <p className="text-xs text-white/30 pt-4 border-t border-white/10">
            HORIZON Express Ltd · TIN: 102 456 789<br/>
            Nyabugogo, Kigali, Rwanda
          </p>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 justify-center mb-8">
            <HorizonLogoSVG />
            <div>
              <div className="text-2xl font-extrabold text-red-500">HORIZON</div>
              <div className="text-xs font-bold text-white/60 tracking-widest">EXPRESS</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
              <p className="text-sm text-gray-400 mt-1">Enter your credentials to access the system</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Email Address
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

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Password
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

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 font-medium">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0A2558] hover:bg-[#0d2d6b] text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
              >
                {loading
                  ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
                  : <><LogIn size={17}/> Sign In</>
                }
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 border-t border-gray-100 pt-5">
              <button onClick={() => setShowDemo(v => !v)}
                className="w-full flex items-center justify-between text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors">
                <span>Demo Accounts — click to fill</span>
                {showDemo ? <ChevronUp size={15}/> : <ChevronDown size={15}/>}
              </button>

              {showDemo && (
                <div className="mt-3 space-y-2">
                  {SYSTEM_USERS.map(u => (
                    <button
                      key={u.id}
                      onClick={() => fillCredentials(u.email, u.password)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-100 hover:border-[#0A2558]/30 hover:bg-blue-50/40 transition-all text-left group"
                    >
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${ROLE_BADGE[u.role].color}`}>
                        {ROLE_BADGE[u.role].label}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-700 truncate">{u.name}</div>
                        <div className="text-[10px] text-gray-400 truncate">{u.email}</div>
                      </div>
                      <span className="font-mono text-[10px] text-gray-400 group-hover:text-[#0A2558] flex-shrink-0">{u.password}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <p className="text-center text-white/30 text-xs mt-6">
            © 2024 HORIZON Express Ltd · Kigali, Rwanda · v1.0.0
          </p>
        </div>
      </div>
    </div>
  )
}
