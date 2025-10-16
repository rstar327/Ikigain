import { useTranslation } from 'react-i18next';
import { getLocalizedPath } from '@/lib/urlUtils';
import { SupportedLanguage } from '@/i18n/languages';

export function useLocalizedPath() {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language as SupportedLanguage;

  const getPath = (path: string): string => {
    return getLocalizedPath(path, currentLanguage);
  };

  return { getPath, currentLanguage };
}