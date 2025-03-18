import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// English translations
import enTranslation from './locales/en/translation.json';

// Swahili translations
import swTranslation from './locales/sw/translation.json';

// Get saved language from localStorage or use browser detection
const savedLanguage = localStorage.getItem('smartWakalaLanguage');

i18n
  // Load translations from backend (for larger projects)
  .use(Backend)
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      sw: {
        translation: swTranslation
      }
    },
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    // language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'smartWakalaLanguage',
      caches: ['localStorage'],
    },
    
    // Initial language
    lng: savedLanguage || undefined, // undefined will trigger language detection
    
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  });

export default i18n;
