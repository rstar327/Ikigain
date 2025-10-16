import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'en', // Default language
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    react: {
      useSuspense: false,
    },
    
    detection: {
      order: ['path', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
    },
    
    ns: ['common', 'navigation', 'landing', 'test', 'results', 'blog', 'types', 'ikigai-test', 'shop', 'whatIsIkigai'],
    defaultNS: 'common',
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      crossDomain: true,
      allowMultiLoading: false,
      reloadInterval: false,
      requestOptions: {
        cache: 'no-cache'
      }
    },
    
    preload: ['en', 'es', 'fr']
  });

export default i18n;