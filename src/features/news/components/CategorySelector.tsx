import { useTranslation } from '@/utils/i18n';
import type { NewsCategory } from '../types';

interface CategorySelectorProps {
  selectedCategory: NewsCategory;
  onCategoryChange: (category: NewsCategory) => void;
}

const categories: NewsCategory[] = [
  'Top Stories',
  'World',
  'Local News',
  'Business',
  'Technology',
  'Entertainment',
  'Sports',
  'Science',
  'Health',
  'Lifestyle',
];

const CategorySelector = ({
  selectedCategory,
  onCategoryChange,
}: CategorySelectorProps) => {
  const { t } = useTranslation();

  const getCategoryKey = (category: NewsCategory): string => {
    const keyMap: Record<NewsCategory, string> = {
      'Top Stories': 'news.categories.topStories',
      'World': 'news.categories.world',
      'Local News': 'news.categories.localNews',
      'Business': 'news.categories.business',
      'Technology': 'news.categories.technology',
      'Entertainment': 'news.categories.entertainment',
      'Sports': 'news.categories.sports',
      'Science': 'news.categories.science',
      'Health': 'news.categories.health',
      'Lifestyle': 'news.categories.lifestyle',
    };
    return keyMap[category] || category;
  };

  return (
    <nav className="flex flex-wrap gap-2 mb-6" aria-label={t('news.categories.topStories')}>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
            selectedCategory === category
              ? 'bg-blue-600 text-white dark:bg-blue-500'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
          aria-pressed={selectedCategory === category}
        >
          {t(getCategoryKey(category))}
        </button>
      ))}
    </nav>
  );
};

export default CategorySelector;

