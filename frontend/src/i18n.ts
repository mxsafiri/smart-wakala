import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
import translationEN from './locales/en/translation.json';

// Swahili translations
import translationSW from './locales/sw/translation.json';

// the translations
const resources = {
  en: {
    translation: translationEN
  },
  sw: {
    translation: translationSW
  }
};

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    
    // language detection options
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'smartWakalaLanguage',
      caches: ['localStorage'],
    }
  });

export default i18n;
