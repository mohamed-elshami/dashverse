import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNewsStore } from './store';
import { fetchNewsByCategory, getUserLocation } from './api';
import { NewsCard, CategorySelector } from './components';
import { useSEO } from '@/utils/hooks';
import { useTranslation } from '@/utils/i18n';
import { useLanguageStore } from '@/stores/languageStore';
import { HiSearch, HiLocationMarker } from 'react-icons/hi';
import type { NewsCategory } from './types';

// Location data structure
const LOCATION_GROUPS = [
  {
    label: 'English',
    locations: [
      { code: 'US', name: 'United States' },
      { code: 'GB', name: 'United Kingdom' },
      { code: 'CA', name: 'Canada' },
      { code: 'AU', name: 'Australia' },
      { code: 'NZ', name: 'New Zealand' },
      { code: 'IE', name: 'Ireland' },
    ],
  },
  {
    label: 'Arabic',
    locations: [
      { code: 'SA', name: 'Saudi Arabia' },
      { code: 'AE', name: 'United Arab Emirates' },
      { code: 'EG', name: 'Egypt' },
      { code: 'IQ', name: 'Iraq' },
      { code: 'JO', name: 'Jordan' },
      { code: 'LB', name: 'Lebanon' },
      { code: 'MA', name: 'Morocco' },
      { code: 'DZ', name: 'Algeria' },
      { code: 'TN', name: 'Tunisia' },
      { code: 'KW', name: 'Kuwait' },
      { code: 'QA', name: 'Qatar' },
      { code: 'BH', name: 'Bahrain' },
      { code: 'OM', name: 'Oman' },
    ],
  },
  {
    label: 'Other',
    locations: [
      { code: 'DE', name: 'Germany' },
      { code: 'FR', name: 'France' },
      { code: 'IT', name: 'Italy' },
      { code: 'ES', name: 'Spain' },
      { code: 'JP', name: 'Japan' },
      { code: 'IN', name: 'India' },
      { code: 'BR', name: 'Brazil' },
      { code: 'MX', name: 'Mexico' },
      { code: 'RU', name: 'Russia' },
      { code: 'CN', name: 'China' },
      { code: 'KR', name: 'South Korea' },
      { code: 'TR', name: 'Turkey' },
      { code: 'NL', name: 'Netherlands' },
    ],
  },
];

// Create a flat map for quick lookup
const LOCATION_MAP = LOCATION_GROUPS.reduce((acc, group) => {
  group.locations.forEach(({ code, name }) => {
    acc[code] = name;
  });
  return acc;
}, {} as Record<string, string>);

const NewsPage = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const {
    newsData,
    selectedCategory,
    searchQuery,
    location,
    loading,
    error,
    setNewsData,
    setSelectedCategory,
    setSearchQuery,
    setLocation,
    setLoading,
    setError,
  } = useNewsStore();

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [localLocation, setLocalLocation] = useState(location);

  // Get location name for SEO
  const getLocationName = (): string => {
    return LOCATION_MAP[location] || location || 'World';
  };

  // Dynamic SEO based on category, search query, and location
  const locationName = getLocationName();
  const categoryName = selectedCategory.replace(/([A-Z])/g, ' $1').trim();
  const hasSearchQuery = searchQuery.trim().length > 0;
  
  const categoryKey = `news.categories.${selectedCategory.toLowerCase().replace(/\s+/g, '')}`;
  const categoryTranslated = t(categoryKey) || categoryName;
  
  const seoTitle = hasSearchQuery
    ? `${t('news.title')} - ${searchQuery}`
    : `${t('news.title')} - ${categoryTranslated}${location && location !== 'US' ? ` (${locationName})` : ''}`;
  
  const seoDescription = hasSearchQuery
    ? `${t('common.search')} "${searchQuery}" ${categoryTranslated.toLowerCase()} ${t('news.title').toLowerCase()}${location && location !== 'US' ? ` ${locationName}` : ''}. ${t('news.subtitle')}`
    : `${t('news.subtitle')} ${categoryTranslated.toLowerCase()}${location && location !== 'US' ? ` ${locationName}` : ''}.`;
  
  const seoKeywords = hasSearchQuery
    ? `${t('news.title')}, ${searchQuery}, ${categoryTranslated.toLowerCase()}, ${t('news.categories.topStories')}`
    : `${t('news.title')}, ${categoryTranslated.toLowerCase()}, ${t('news.categories.topStories')}${location && location !== 'US' ? `, ${locationName}` : ''}`;

  useSEO(
    {
      title: seoTitle,
      description: seoDescription,
      keywords: seoKeywords,
      ogTitle: `${seoTitle} - Dashverse`,
      ogDescription: seoDescription,
      ogType: 'website',
    },
    [selectedCategory, searchQuery, location, t]
  );

  // Sync localLocation with store location
  useEffect(() => {
    setLocalLocation(location);
  }, [location]);

  // Initialize location on mount
  useEffect(() => {
    if (!location || location === 'US') {
      const userLocation = getUserLocation();
      setLocation(userLocation);
    }
  }, [location, setLocation]);

  // Debounce timer ref
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch news when category, search query, or location changes
  useEffect(() => {
    // Only fetch if location is set
    if (!location) return;

    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce the API call to prevent rate limiting (429 errors)
    debounceTimerRef.current = setTimeout(async () => {
      const loadNews = async () => {
        try {
          setLoading(true);
          setError(null);
          const query = searchQuery.trim() || undefined;
          
          const news = await fetchNewsByCategory(
            selectedCategory,
            query,
            location, // Location is passed here
            language // Language for translation
          );
          setNewsData(news);
        } catch (err) {
          // Handle 429 rate limit error specifically
          if (axios.isAxiosError(err) && err.response?.status === 429) {
            setError(
              'Too many requests. Please wait a moment before trying again. The API has rate limits to prevent abuse.'
            );
          } else {
            setError(
              err instanceof Error ? err.message : 'Failed to load news'
            );
          }
          console.error('Error loading news:', err);
        } finally {
          setLoading(false);
        }
      };

      loadNews();
    }, 500); // 500ms debounce delay

    // Cleanup timer on unmount or dependency change
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [selectedCategory, searchQuery, location, language, setNewsData, setLoading, setError]);

  const handleCategoryChange = (category: NewsCategory) => {
    setSelectedCategory(category);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearchQuery);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocation = e.target.value;
    // Update both local state and store - this will trigger the useEffect to fetch news
    setLocalLocation(newLocation);
    setLocation(newLocation);
    // Clear current news data immediately for better UX
    setNewsData([]);
  };

  return (
    <section className="p-6 space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          {t('news.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t('news.subtitle')}
        </p>
      </header>

      {/* Search and Location Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 w-full sm:max-w-md">
          <div className="relative">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              placeholder={t('news.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </form>

        {/* Location Selector */}
        <div className="flex items-center gap-2">
          <HiLocationMarker className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="sr-only">{t('news.location')}</span>
          <select
            value={localLocation}
            onChange={handleLocationChange}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer"
          >
            {LOCATION_GROUPS.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.locations.map(({ code, name }) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      {/* Category Selector */}
      <CategorySelector
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Error Message */}
      {error && (
        <aside
          className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400"
          role="alert"
        >
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <p className="font-semibold mb-1">{t('news.errorLoading')}</p>
              <p className="text-sm">{error}</p>
              {error.includes('429') || error.includes('rate limit') ? (
                <p className="text-sm mt-2 opacity-90">
                  {t('news.rateLimitTip')}
                </p>
              ) : null}
            </div>
            <button
              onClick={() => {
                setError(null);
                // Trigger a retry by updating a dependency
                const currentLocation = location;
                setLocation('');
                setTimeout(() => setLocation(currentLocation), 100);
              }}
              className="px-3 py-1 text-sm bg-red-200 dark:bg-red-800 hover:bg-red-300 dark:hover:bg-red-700 rounded transition-colors"
              aria-label={t('news.retryLoading')}
            >
              {t('common.retry')}
            </button>
          </div>
        </aside>
      )}

      {/* Loading State */}
      {loading && (
        <div
          className="flex items-center justify-center p-12"
          role="status"
          aria-label="Loading news"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" aria-hidden="true"></div>
        </div>
      )}

      {/* News Grid */}
      {!loading && newsData.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" aria-label="News articles">
          {newsData.map((news, index) => (
            <NewsCard key={news.guid || news.link || index} news={news} />
          ))}
        </section>
      )}

      {/* Empty State */}
      {!loading && newsData.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {t('news.noNewsFound')}
          </p>
        </div>
      )}
    </section>
  );
};

export default NewsPage;

