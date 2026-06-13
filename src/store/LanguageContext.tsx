import { createContext, useContext, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

export type Language = 'en' | 'rw'

interface LanguageCtx {
  language: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageCtx>(null!)

export const useLanguage = () => useContext(LanguageContext)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()

  const language = (i18n.language?.startsWith('en') ? 'en' : 'rw') as Language

  const setLanguage = (lang: Language) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('hz_lang', lang)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}
