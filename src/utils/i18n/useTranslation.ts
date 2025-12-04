import { useLanguageStore } from '@/stores/languageStore';
import { translations, type Translations } from './translations';

/**
 * Hook to get translations for the current language
 * @returns Translation function and current language
 */
export const useTranslation = () => {
  const { language } = useLanguageStore();
  
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language] || translations.en;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if translation not found
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return { t, language };
};

/**
 * Get translation object directly (useful for components that need all translations)
 */
export const getTranslations = (lang: string): Translations => {
  return translations[lang] || translations.en;
};

