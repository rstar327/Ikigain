import { SupportedLanguage } from '@/i18n/languages';

export const getLanguageFromPath = (path: string): SupportedLanguage => {
  const pathSegments = path.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];
  
  // Check if first segment is a supported language code
  if (firstSegment && ['es', 'fr'].includes(firstSegment)) {
    return firstSegment as SupportedLanguage;
  }
  
  return 'en'; // Default to English
};

export const getPathWithoutLanguage = (path: string): string => {
  const pathSegments = path.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];
  
  // If first segment is a supported language code, remove it
  if (firstSegment && ['es', 'fr'].includes(firstSegment)) {
    return '/' + pathSegments.slice(1).join('/');
  }
  
  return path;
};

export const getLocalizedPath = (path: string, language: SupportedLanguage): string => {
  const cleanPath = getPathWithoutLanguage(path);
  
  if (language === 'en') {
    return cleanPath;
  }
  
  // Add language prefix for non-English languages
  return `/${language}${cleanPath === '/' ? '' : cleanPath}`;
};

export const switchLanguageInUrl = (currentPath: string, targetLanguage: SupportedLanguage): string => {
  const cleanPath = getPathWithoutLanguage(currentPath);
  return getLocalizedPath(cleanPath, targetLanguage);
};