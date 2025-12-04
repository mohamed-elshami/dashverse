import axios from 'axios';
import type { Language } from '@/stores/languageStore';

// Google Cloud Translation API endpoint
const GOOGLE_TRANSLATE_API = 'https://translation.googleapis.com/language/translate/v2';

// Translation cache to avoid redundant API calls
const translationCache = new Map<string, string>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Get API key from environment variable
const getApiKey = (): string | null => {
  return import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY || null;
};

/**
 * Map our language codes to Google Translate API language codes
 */
const mapLanguageCode = (lang: Language): string => {
  const langMap: Record<Language, string> = {
    en: 'en',
    ar: 'ar',
    fr: 'fr',
    es: 'es',
    de: 'de',
    it: 'it',
    pt: 'pt',
    ja: 'ja',
    zh: 'zh',
    ru: 'ru',
  };
  return langMap[lang] || 'en';
};

/**
 * Translate text using Google Translation API
 */
export const translateText = async (
  text: string,
  targetLanguage: Language,
  sourceLanguage: Language = 'en'
): Promise<string> => {
  // Return original text if target is English or same as source
  if (targetLanguage === 'en' || targetLanguage === sourceLanguage) {
    return text;
  }

  // Check cache first
  const cacheKey = `${text}|${sourceLanguage}|${targetLanguage}`;
  const cached = translationCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn('[Translation] Google Translate API key not found. Returning original text.');
    return text;
  }

  try {
    const response = await axios.post(
      `${GOOGLE_TRANSLATE_API}?key=${apiKey}`,
      {
        q: text,
        source: mapLanguageCode(sourceLanguage),
        target: mapLanguageCode(targetLanguage),
        format: 'text',
      },
      {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data?.data?.translations?.[0]?.translatedText) {
      const translated = response.data.data.translations[0].translatedText;
      // Cache the translation
      translationCache.set(cacheKey, translated);
      return translated;
    }

    throw new Error('Invalid translation response');
  } catch (error) {
    console.error('[Translation] Error translating text:', error);
    
    // If it's a rate limit or quota error, return original text
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 429 || status === 403) {
        console.warn('[Translation] Rate limit or quota exceeded. Returning original text.');
        return text;
      }
    }
    
    // Return original text on error
    return text;
  }
};

/**
 * Translate multiple texts in batch (more efficient)
 */
export const translateBatch = async (
  texts: string[],
  targetLanguage: Language,
  sourceLanguage: Language = 'en'
): Promise<string[]> => {
  // Return original texts if target is English or same as source
  if (targetLanguage === 'en' || targetLanguage === sourceLanguage) {
    return texts;
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn('[Translation] Google Translate API key not found. Returning original texts.');
    return texts;
  }

  try {
    const response = await axios.post(
      `${GOOGLE_TRANSLATE_API}?key=${apiKey}`,
      {
        q: texts,
        source: mapLanguageCode(sourceLanguage),
        target: mapLanguageCode(targetLanguage),
        format: 'text',
      },
      {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data?.data?.translations) {
      const translations = response.data.data.translations.map(
        (t: { translatedText: string }) => t.translatedText
      );
      
      // Cache translations
      texts.forEach((text, index) => {
        const cacheKey = `${text}|${sourceLanguage}|${targetLanguage}`;
        translationCache.set(cacheKey, translations[index]);
      });
      
      return translations;
    }

    throw new Error('Invalid translation response');
  } catch (error) {
    console.error('[Translation] Error translating batch:', error);
    
    // If it's a rate limit or quota error, return original texts
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 429 || status === 403) {
        console.warn('[Translation] Rate limit or quota exceeded. Returning original texts.');
        return texts;
      }
    }
    
    // Return original texts on error
    return texts;
  }
};

/**
 * Extract plain text from HTML for translation
 */
export const extractPlainText = (html: string): string => {
  if (!html) return '';
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

/**
 * Clean translation cache (useful for memory management)
 */
export const clearTranslationCache = (): void => {
  translationCache.clear();
};

