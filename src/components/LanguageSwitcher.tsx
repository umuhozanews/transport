import { Globe } from 'lucide-react'
import { useLanguage } from '../store/LanguageContext'

interface LanguageSwitcherProps {
  variant?: 'light' | 'dark'
  className?: string
}

export default function LanguageSwitcher({ variant = 'light', className = '' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage()

  const toggle = () => setLanguage(language === 'en' ? 'rw' : 'en')

  const styles = variant === 'dark'
    ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'

  const label = language === 'en' ? 'EN' : 'RW'
  const next = language === 'en' ? 'Kinyarwanda' : 'English'

  return (
    <button
      type="button"
      onClick={toggle}
      title={next}
      aria-label={`Switch to ${next}`}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-colors ${styles} ${className}`}
    >
      <Globe size={14}/>
      {label}
    </button>
  )
}
