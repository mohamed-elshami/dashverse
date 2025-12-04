import { HiExternalLink, HiCalendar } from 'react-icons/hi';
import { useTranslation } from '@/utils/i18n';
import type { NewsItem } from '../types';

interface NewsCardProps {
  news: NewsItem;
}

const NewsCard = ({ news }: NewsCardProps) => {
  const { t, language } = useTranslation();
  
  // Extract plain text from HTML description
  const extractText = (html: string): string => {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  // Extract image from HTML if thumbnail is not available
  const extractImageFromHTML = (html: string): string | null => {
    if (!html) return null;
    const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    return imgMatch && imgMatch[1] ? imgMatch[1] : null;
  };

  // Get image URL - try thumbnail first, then extract from description/content
  const getImageUrl = (): string | null => {
    if (news.thumbnail) return news.thumbnail;
    if (news.description) {
      const img = extractImageFromHTML(news.description);
      if (img) return img;
    }
    if (news.content) {
      const img = extractImageFromHTML(news.content);
      if (img) return img;
    }
    return null;
  };

  const imageUrl = getImageUrl();

  // Format date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : language, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const description = extractText(news.description || '');
  const truncatedDescription =
    description.length > 150
      ? `${description.substring(0, 150)}...`
      : description;

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900 overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col">
      {/* Thumbnail */}
      {imageUrl && (
        <div className="w-full h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
          <img
            src={imageUrl}
            alt={news.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              // Hide image container on error
              const container = (e.target as HTMLImageElement).parentElement;
              if (container) {
                container.style.display = 'none';
              }
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2">
          {news.title}
        </h3>

        {/* Description */}
        {truncatedDescription && (
          <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1 line-clamp-3">
            {truncatedDescription}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {/* Date */}
            <time
              className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400"
              dateTime={news.pubDate}
            >
              <HiCalendar className="w-4 h-4" />
              {formatDate(news.pubDate)}
            </time>

            {/* Link */}
            <a
              href={news.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors"
            >
              {t('news.readMore')}
              <HiExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;

