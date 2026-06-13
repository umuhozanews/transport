import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './en.json'
import rw from './rw.json'

const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('hz_lang') : null

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      rw: { translation: rw },
    },
    lng: saved === 'en' || saved === 'rw' ? saved : 'rw',
    fallbackLng: 'en',
    supportedLngs: ['en', 'rw'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'hz_lang',
      caches: ['localStorage'],
    },
  })

export default i18n
