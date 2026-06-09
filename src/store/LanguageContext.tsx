import { createContext, useContext, useState, ReactNode } from 'react'

export type Language = 'rw' | 'en'

interface Translations {
  [key: string]: {
    rw: string
    en: string
  }
}

export const translations: Translations = {
  // Sidebar / Navigation
  'nav.dashboard': { rw: 'Incamake y’Imirimo', en: 'Dashboard' },
  'nav.payments': { rw: 'Ingendo n’Imiripo', en: 'Trips & Payments' },
  'nav.reports': { rw: 'Raporo n’Imibare', en: 'Reports & Analytics' },
  'nav.audit': { rw: 'Amateka y’Ibyakozwe', en: 'Audit Log' },
  'nav.setup': { rw: 'Igenamiterere', en: 'Setup' },
  'nav.routeMap': { rw: 'Inzira n’Imyanya', en: 'Route Map' },
  'nav.paymentTerminal': { rw: 'Ibikoresho by’Imiripo', en: 'Payment Terminals' },
  'nav.busProfile': { rw: 'Amakuru ya Bisi', en: 'Bus Profile' },
  'nav.busCaptain': { rw: 'Abashoferi', en: 'Bus Captains' },
  'nav.logout': { rw: 'Sohoka', en: 'Logout' },
  'nav.logoutConfirm': { rw: 'Urashaka gusohoka koko,', en: 'Are you sure you want to log out,' },

  // Dashboard
  'db.todayInsights': { rw: 'Incamake y’uyu munsi', en: 'Today Insights' },
  'db.activeRoutes': { rw: 'Inzira zikoreshwa', en: 'Active Routes' },
  'db.totalRoutes': { rw: 'Inzira zose hamwe', en: 'Total Routes' },
  'db.busRunning': { rw: 'Bisi ziri mu kazi', en: 'Bus Running' },
  'db.totalBus': { rw: 'Amabisi yose hamwe', en: 'Total Buses' },
  'db.activeCaptains': { rw: 'Abashoferi bari mu kazi', en: 'Active Captains' },
  'db.totalCaptains': { rw: 'Abashoferi bose hamwe', en: 'Total Captains' },
  'db.passengersToday': { rw: 'Abagenzi b’uyu munsi', en: 'Passengers Today' },
  'db.adults': { rw: 'Abakuru', en: 'Adults' },
  'db.children': { rw: 'Abana', en: 'Children' },
  'db.revenueToday': { rw: 'Ayinjijwe uyu munsi', en: 'Revenue Today' },
  'db.topRoutes': { rw: 'Inzira zikoreshwa cyane', en: 'Most Engaging Routes' },
  'db.revenueReport': { rw: 'Raporo y’amafaranga yose', en: 'Overall Revenue Report' },
  'db.currencyNote': { rw: 'mu mafaranga y’u Rwanda (RWF)', en: 'in Rwandan Francs (RWF)' },

  // General
  'common.search': { rw: 'Shakisha...', en: 'Search...' },
  'common.add': { rw: 'Ongeraho', en: 'Add New' },
  'common.edit': { rw: 'Hindura', en: 'Edit' },
  'common.delete': { rw: 'Siba', en: 'Delete' },
  'common.save': { rw: 'Bika amakuru', en: 'Save Changes' },
  'common.cancel': { rw: 'Reka', en: 'Cancel' },
  'common.confirm': { rw: 'Emeza', en: 'Confirm' },
  'common.status': { rw: 'Imiterere', en: 'Status' },
  'common.actions': { rw: 'Ibikorwa', en: 'Actions' },
}

interface LanguageCtx {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageCtx>(null!)

export const useLanguage = () => useContext(LanguageContext)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('hz_lang')
    return (saved as Language) || 'rw'
  })

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('hz_lang', lang)
  }

  const t = (key: string): string => {
    const translation = translations[key]
    if (!translation) return key
    return translation[language]
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
