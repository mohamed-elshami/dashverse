import { useLanguageStore, SUPPORTED_LANGUAGES } from '@/stores/languageStore';
import { HiGlobeAlt } from 'react-icons/hi';

const LanguageSelector = () => {
  const { language, setLanguage, getLanguageInfo } = useLanguageStore();
  const currentLang = getLanguageInfo();

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label={`Current language: ${currentLang.name}`}
        title={`Current language: ${currentLang.name}`}
      >
        <HiGlobeAlt className="w-5 h-5" />
        <span className="hidden sm:inline-block text-sm font-medium">
          {currentLang.flag} {currentLang.code.toUpperCase()}
        </span>
      </button>

      {/* Dropdown Menu */}
      <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-2">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-2 uppercase tracking-wide">
            Select Language
          </div>
          <div className="max-h-64 overflow-y-auto">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  language === lang.code
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <div className="flex-1 text-left">
                  <div className="font-medium">{lang.nativeName}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{lang.name}</div>
                </div>
                {language === lang.code && (
                  <span className="text-blue-600 dark:text-blue-400">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;

