export const SUPPORTED_LANGUAGES = {
  en: {
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    rtl: false,
    dateFormat: 'MM/dd/yyyy',
    numberFormat: 'en-US'
  },
  es: {
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    rtl: false,
    dateFormat: 'dd/MM/yyyy',
    numberFormat: 'es-ES'
  },
  fr: {
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    rtl: false,
    dateFormat: 'dd/MM/yyyy',
    numberFormat: 'fr-FR'
  }
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

export const PRIORITY_LANGUAGES: SupportedLanguage[] = ['en', 'es', 'fr'];

export const getLanguageInfo = (lang: SupportedLanguage) => {
  return SUPPORTED_LANGUAGES[lang] || SUPPORTED_LANGUAGES[DEFAULT_LANGUAGE];
};

export const formatDate = (date: Date, lang: SupportedLanguage): string => {
  const languageInfo = getLanguageInfo(lang);
  return new Intl.DateTimeFormat(languageInfo.numberFormat, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
};

export const formatNumber = (num: number, lang: SupportedLanguage): string => {
  const languageInfo = getLanguageInfo(lang);
  return new Intl.NumberFormat(languageInfo.numberFormat).format(num);
};

export const formatCurrency = (amount: number, lang: SupportedLanguage): string => {
  const languageInfo = getLanguageInfo(lang);
  return new Intl.NumberFormat(languageInfo.numberFormat, {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};