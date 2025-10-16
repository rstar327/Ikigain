import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages, Check } from 'lucide-react';
import { SUPPORTED_LANGUAGES, SupportedLanguage, PRIORITY_LANGUAGES } from '@/i18n/languages';
import { switchLanguageInUrl } from '@/lib/urlUtils';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'default' | 'ghost' | 'outline';
}

export default function LanguageSwitcher({ className, variant = 'ghost' }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const [location, navigate] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLanguage = i18n.language as SupportedLanguage;
  const currentLangInfo = SUPPORTED_LANGUAGES[currentLanguage] || SUPPORTED_LANGUAGES.en;

  const handleLanguageChange = (language: SupportedLanguage) => {
    // Get the new URL with the target language
    const newUrl = switchLanguageInUrl(location, language);
    
    // Navigate to the new URL
    navigate(newUrl);
    
    // Change the i18n language
    i18n.changeLanguage(language);
    setIsOpen(false);
    
    // Update document direction for RTL languages
    if (SUPPORTED_LANGUAGES[language].rtl) {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  // Show priority languages first, then others
  const priorityLanguages = PRIORITY_LANGUAGES;
  const otherLanguages = Object.keys(SUPPORTED_LANGUAGES).filter(
    lang => !PRIORITY_LANGUAGES.includes(lang as SupportedLanguage)
  ) as SupportedLanguage[];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="sm" className={className}>
          <Languages className="h-4 w-4 mr-2" />
          <span className="mr-1">{currentLangInfo.flag}</span>
          <span className="hidden sm:inline">{currentLangInfo.nativeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {/* Priority Languages */}
        {priorityLanguages.map((lang) => {
          const langInfo = SUPPORTED_LANGUAGES[lang];
          const isActive = currentLanguage === lang;
          
          return (
            <DropdownMenuItem
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center">
                <span className="mr-2">{langInfo.flag}</span>
                <span>{langInfo.nativeName}</span>
              </div>
              {isActive && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          );
        })}
        
        {/* Separator if we have other languages */}
        {otherLanguages.length > 0 && (
          <div className="border-t border-gray-200 my-1" />
        )}
        
        {/* Other Languages */}
        {otherLanguages.map((lang) => {
          const langInfo = SUPPORTED_LANGUAGES[lang];
          const isActive = currentLanguage === lang;
          
          return (
            <DropdownMenuItem
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center">
                <span className="mr-2">{langInfo.flag}</span>
                <span>{langInfo.nativeName}</span>
              </div>
              {isActive && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}