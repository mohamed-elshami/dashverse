import axios from 'axios';
import type { Language } from '@/stores/languageStore';
import type { NewsCategory, RSS2JSONResponse, NewsItem } from '../types';

const GOOGLE_NEWS_BASE = 'https://news.google.com/rss';

// CORS proxies for fetching RSS feeds
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://api.codetabs.com/v1/proxy?quest=',
  'https://corsproxy.io/?',
];

// RSS2JSON API endpoints (try alternatives if one fails)
const RSS2JSON_ALTERNATIVES = [
  'https://api.rss2json.com/v1/api.json',
  'https://rss-to-json-serverless.vercel.app/api?feedURL=',
];

// Request cache to avoid duplicate requests
const requestCache = new Map<string, { data: RSS2JSONResponse; timestamp: number }>();
const CACHE_DURATION = 60000; // 1 minute cache

/**
 * Map country codes to Google News language/country codes
 * Format: ceid=COUNTRY:LANGUAGE (e.g., US:en-US, EG:ar-EG)
 */
const getGoogleNewsCountryCode = (countryCode: string): { ceid: string; hl: string; gl: string } => {
  const countryMap: Record<string, { ceid: string; hl: string; gl: string }> = {
    US: { ceid: 'US:en-US', hl: 'en', gl: 'US' },
    GB: { ceid: 'GB:en-GB', hl: 'en', gl: 'GB' },
    CA: { ceid: 'CA:en-CA', hl: 'en', gl: 'CA' },
    AU: { ceid: 'AU:en-AU', hl: 'en', gl: 'AU' },
    NZ: { ceid: 'NZ:en-NZ', hl: 'en', gl: 'NZ' },
    IE: { ceid: 'IE:en-IE', hl: 'en', gl: 'IE' },
    SA: { ceid: 'SA:ar-SA', hl: 'ar', gl: 'SA' },
    AE: { ceid: 'AE:ar-AE', hl: 'ar', gl: 'AE' },
    EG: { ceid: 'EG:ar-EG', hl: 'ar', gl: 'EG' },
    IQ: { ceid: 'IQ:ar-IQ', hl: 'ar', gl: 'IQ' },
    JO: { ceid: 'JO:ar-JO', hl: 'ar', gl: 'JO' },
    LB: { ceid: 'LB:ar-LB', hl: 'ar', gl: 'LB' },
    MA: { ceid: 'MA:ar-MA', hl: 'ar', gl: 'MA' },
    DZ: { ceid: 'DZ:ar-DZ', hl: 'ar', gl: 'DZ' },
    TN: { ceid: 'TN:ar-TN', hl: 'ar', gl: 'TN' },
    KW: { ceid: 'KW:ar-KW', hl: 'ar', gl: 'KW' },
    QA: { ceid: 'QA:ar-QA', hl: 'ar', gl: 'QA' },
    BH: { ceid: 'BH:ar-BH', hl: 'ar', gl: 'BH' },
    OM: { ceid: 'OM:ar-OM', hl: 'ar', gl: 'OM' },
    DE: { ceid: 'DE:de-DE', hl: 'de', gl: 'DE' },
    FR: { ceid: 'FR:fr-FR', hl: 'fr', gl: 'FR' },
    IT: { ceid: 'IT:it-IT', hl: 'it', gl: 'IT' },
    ES: { ceid: 'ES:es-ES', hl: 'es', gl: 'ES' },
    JP: { ceid: 'JP:ja-JP', hl: 'ja', gl: 'JP' },
    IN: { ceid: 'IN:en-IN', hl: 'en', gl: 'IN' },
    BR: { ceid: 'BR:pt-BR', hl: 'pt', gl: 'BR' },
    MX: { ceid: 'MX:es-MX', hl: 'es', gl: 'MX' },
    RU: { ceid: 'RU:ru-RU', hl: 'ru', gl: 'RU' },
    CN: { ceid: 'CN:zh-CN', hl: 'zh', gl: 'CN' },
    KR: { ceid: 'KR:ko-KR', hl: 'ko', gl: 'KR' },
    TR: { ceid: 'TR:tr-TR', hl: 'tr', gl: 'TR' },
    NL: { ceid: 'NL:nl-NL', hl: 'nl', gl: 'NL' },
  };
  return countryMap[countryCode] || { ceid: 'US:en-US', hl: 'en', gl: 'US' };
};

/**
 * Map categories to Google News RSS paths
 * Google News RSS uses different paths for different categories
 */
const getGoogleNewsPath = (category: NewsCategory): string => {
  const categoryMap: Record<NewsCategory, string> = {
    'Top Stories': '/headlines',
    'World': '/world',
    'Local News': '/headlines/section/topic/LOCAL_NEWS',
    'Business': '/headlines/section/topic/BUSINESS',
    'Technology': '/headlines/section/topic/TECHNOLOGY',
    'Entertainment': '/headlines/section/topic/ENTERTAINMENT',
    'Sports': '/headlines/section/topic/SPORTS',
    'Science': '/headlines/section/topic/SCIENCE',
    'Health': '/headlines/section/topic/HEALTH',
    'Lifestyle': '/headlines/section/topic/LIFESTYLE',
  };
  return categoryMap[category];
};

/**
 * Build Google News RSS URL based on category, optional query, and location
 * Google News RSS format: https://news.google.com/rss/path?ceid=COUNTRY:LANGUAGE&hl=LANGUAGE&gl=COUNTRY&q=QUERY
 * Note: Google News RSS requires ceid parameter for proper feed generation
 */
const buildGoogleNewsRSSUrl = (
  category: NewsCategory,
  query?: string,
  location?: string
): string => {
  const path = getGoogleNewsPath(category);
  const params = new URLSearchParams();

  // Add location parameters (required for Google News RSS)
  if (location) {
    const countryInfo = getGoogleNewsCountryCode(location);
    params.append('ceid', countryInfo.ceid);
    params.append('hl', countryInfo.hl);
    params.append('gl', countryInfo.gl);
  } else {
    // Default to US
    params.append('ceid', 'US:en-US');
    params.append('hl', 'en');
    params.append('gl', 'US');
  }

  // Add search query if provided
  if (query && query.trim()) {
    params.append('q', query.trim());
  }

  // Build final URL - always include parameters
  const url = `${GOOGLE_NEWS_BASE}${path}?${params.toString()}`;
  console.log('[Google News RSS] Built URL:', url);
  return url;
};

/**
 * Fetch RSS feed and convert to JSON using RSS2JSON API
 * Falls back to direct RSS parsing if RSS2JSON fails
 */
const fetchRSS2JSON = async (
  rssUrl: string,
  retries = 2,
  delay = 1000
): Promise<RSS2JSONResponse> => {
  console.log('[Google News RSS] Fetching:', rssUrl);

  // Check cache first
  const cacheKey = rssUrl;
  const cached = requestCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('[Google News RSS] Using cached response');
    return cached.data;
  }

  // Fetch RSS feed through CORS proxy (Google News blocks direct browser requests)
  let rssContent: string | null = null;

  // Try to fetch RSS feed through CORS proxies
  for (const proxy of CORS_PROXIES) {
    try {
      const proxyUrl = proxy.includes('?')
        ? `${proxy}${encodeURIComponent(rssUrl)}`
        : `${proxy}${rssUrl}`;
      
      console.log(`[Google News RSS] Fetching RSS through proxy: ${proxy.substring(0, 30)}...`);
      
      const proxyResponse = await axios.get<string>(proxyUrl, {
        timeout: 15000,
        headers: {
          'Accept': 'application/rss+xml, application/xml, text/xml, text/plain',
        },
        responseType: 'text',
        validateStatus: (status) => status < 500,
      });

      if (proxyResponse.status === 200 && proxyResponse.data) {
        // Handle different proxy response formats
        let content = proxyResponse.data;
        
        // allorigins.win wraps response in JSON
        if (typeof proxyResponse.data === 'string' && proxyResponse.data.trim().startsWith('{')) {
          try {
            const jsonData = JSON.parse(proxyResponse.data);
            if (jsonData.contents) {
              content = typeof jsonData.contents === 'string' ? jsonData.contents : proxyResponse.data;
            }
          } catch {
            // Not JSON, use as-is
          }
        }

        if (content && content.includes('<rss') || content.includes('<feed')) {
          rssContent = content;
          console.log('[Google News RSS] Successfully fetched RSS feed through proxy');
          break;
        }
      }
    } catch (error) {
      console.warn(`[Google News RSS] Proxy ${proxy.substring(0, 30)} failed:`, error);
      continue; // Try next proxy
    }
  }

  if (!rssContent) {
    throw new Error('Failed to fetch Google News RSS feed through any CORS proxy. The feed may be temporarily unavailable.');
  }

  // Parse RSS XML directly since we have the content
  try {
    const parsedData = parseRSSXML(rssContent);
    // Cache the successful response
    requestCache.set(cacheKey, { data: parsedData, timestamp: Date.now() });
    return parsedData;
  } catch (parseError) {
    console.error('[Google News RSS] Failed to parse RSS XML:', parseError);
    // Fallback to RSS2JSON API
    console.log('[Google News RSS] Falling back to RSS2JSON API...');
  }

  // Try different RSS2JSON endpoints as fallback
  for (let endpointIndex = 0; endpointIndex < RSS2JSON_ALTERNATIVES.length; endpointIndex++) {
    const endpoint = RSS2JSON_ALTERNATIVES[endpointIndex];
    const apiUrl = endpoint.includes('feedURL')
      ? `${endpoint}${encodeURIComponent(rssUrl)}`
      : `${endpoint}?rss_url=${encodeURIComponent(rssUrl)}`;

    console.log(`[Google News RSS] Trying RSS2JSON endpoint ${endpointIndex + 1}/${RSS2JSON_ALTERNATIVES.length}: ${endpoint}`);

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        console.log(`[Google News RSS] Attempt ${attempt + 1}/${retries + 1} on endpoint ${endpointIndex + 1}`);

        const response = await axios.get<RSS2JSONResponse>(apiUrl, {
          timeout: 25000,
          headers: {
            'Accept': 'application/json',
          },
          validateStatus: (status) => status < 500, // Don't throw on 4xx
        });

        if (response.status === 200 && response.data?.status === 'ok' && Array.isArray(response.data.items)) {
          console.log(`[Google News RSS] Successfully fetched ${response.data.items.length} items`);
          // Cache the successful response
          requestCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
          return response.data;
        }

        // Handle API errors
        if (response.data?.status === 'error') {
          const errorData = response.data as unknown as { message?: string };
          const errorMessage = errorData.message || 'Unknown error';
          console.error('[Google News RSS] RSS2JSON API error:', errorMessage);
          console.error('[Google News RSS] RSS URL that failed:', rssUrl);
          
          // If it's a conversion error and not the last endpoint, try next endpoint
          if (errorMessage.includes('could not be converted') && endpointIndex < RSS2JSON_ALTERNATIVES.length - 1) {
            console.warn('[Google News RSS] Conversion failed, trying next endpoint...');
            break; // Try next endpoint
          }
          
          throw new Error(`RSS2JSON API error: ${errorMessage}`);
        }

        // Log response for debugging
        console.error('[Google News RSS] Unexpected response:', {
          status: response.status,
          dataStatus: response.data?.status,
          hasItems: Array.isArray(response.data?.items),
        });

        throw new Error(`Invalid response: status ${response.status}`);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const status = axios.isAxiosError(error) ? error.response?.status : null;

        console.error(`[Google News RSS] Attempt ${attempt + 1} failed:`, {
          status,
          message: errorMessage,
        });

        // If it's a rate limit (429) or server error (5xx), wait and retry
        if (status === 429 || (status && status >= 500)) {
          if (attempt < retries) {
            const waitTime = delay * Math.pow(2, attempt);
            console.warn(`[Google News RSS] Rate limited or server error. Waiting ${waitTime}ms before retry...`);
            await new Promise((resolve) => setTimeout(resolve, waitTime));
            continue; // Retry
          }
        }

        // If it's a client error (4xx) and not 429, try next endpoint
        if (status && status >= 400 && status < 500 && status !== 429) {
          console.warn(`[Google News RSS] Client error on endpoint ${endpointIndex + 1}, trying next endpoint...`);
          break; // Try next endpoint
        }

        // If this is the last attempt for this endpoint, try next endpoint
        if (attempt === retries) {
          console.warn(`[Google News RSS] Endpoint ${endpointIndex + 1} failed after ${retries + 1} attempts, trying next...`);
          break; // Try next endpoint
        }
      }
    }

    // If we got here and haven't returned, this endpoint failed, try next
    if (endpointIndex < RSS2JSON_ALTERNATIVES.length - 1) {
      continue; // Try next endpoint
    }
  }

  throw new Error('Failed to fetch news: All RSS2JSON endpoints failed. Google News RSS feeds may not be compatible with RSS2JSON API.');
};

/**
 * Parse RSS XML content and convert to RSS2JSONResponse format
 */
const parseRSSXML = (xmlContent: string): RSS2JSONResponse => {
  // Create a temporary DOM parser
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');

  // Check for parsing errors
  const parseError = xmlDoc.querySelector('parsererror');
  if (parseError) {
    throw new Error('Failed to parse RSS XML: ' + parseError.textContent);
  }

  // Extract feed information
  const channel = xmlDoc.querySelector('channel') || xmlDoc.querySelector('feed');
  if (!channel) {
    throw new Error('Invalid RSS format: no channel or feed element found');
  }

  const feedTitle = channel.querySelector('title')?.textContent || 'Google News';
  const feedLink = channel.querySelector('link')?.textContent || '';
  const feedDescription = channel.querySelector('description')?.textContent || channel.querySelector('subtitle')?.textContent || '';

  // Extract items
  const items = Array.from(channel.querySelectorAll('item')).map((item) => {
    const title = item.querySelector('title')?.textContent || '';
    const link = item.querySelector('link')?.textContent || '';
    const pubDate = item.querySelector('pubDate')?.textContent || item.querySelector('published')?.textContent || '';
    const description = item.querySelector('description')?.textContent || item.querySelector('summary')?.textContent || '';
    const content = item.querySelector('content\\:encoded')?.textContent || description;
    const guid = item.querySelector('guid')?.textContent || link;
    const author = item.querySelector('author')?.textContent || item.querySelector('dc\\:creator')?.textContent || '';
    
    // Extract thumbnail from media:thumbnail or enclosure
    let thumbnail: string | undefined;
    const mediaThumbnail = item.querySelector('media\\:thumbnail') || item.querySelector('thumbnail');
    if (mediaThumbnail) {
      thumbnail = mediaThumbnail.getAttribute('url') || undefined;
    }
    
    const enclosure = item.querySelector('enclosure');
    if (!thumbnail && enclosure) {
      const type = enclosure.getAttribute('type') || '';
      if (type.startsWith('image/')) {
        thumbnail = enclosure.getAttribute('url') || undefined;
      }
    }

    // Extract categories
    const categories: string[] = [];
    item.querySelectorAll('category').forEach((cat) => {
      const catText = cat.textContent;
      if (catText) categories.push(catText);
    });

    return {
      title,
      link,
      pubDate,
      guid,
      author,
      thumbnail: thumbnail || '',
      description,
      content,
      categories: categories.length > 0 ? categories : undefined,
    };
  });

  return {
    status: 'ok',
    feed: {
      url: '',
      title: feedTitle,
      link: feedLink,
      author: '',
      description: feedDescription,
      image: '',
    },
    items,
  };
};

/**
 * Extract image from HTML content or description
 */
const extractImageFromContent = (content: string, description: string): string | undefined => {
  // Try to find img tag in content
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch && imgMatch[1]) {
    return imgMatch[1];
  }

  // Try to find img tag in description
  const descImgMatch = description.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (descImgMatch && descImgMatch[1]) {
    return descImgMatch[1];
  }

  // Try to find image URL in text
  const urlMatch = (content + ' ' + description).match(/https?:\/\/[^\s<>"]+\.(jpg|jpeg|png|gif|webp)/i);
  if (urlMatch && urlMatch[0]) {
    return urlMatch[0];
  }

  return undefined;
};

/**
 * Transform RSS items to NewsItem format
 */
const transformRSSItems = (items: RSS2JSONResponse['items']): NewsItem[] => {
  return items.map((item) => {
    // Extract thumbnail from content, description, or enclosure
    let thumbnail: string | undefined = item.thumbnail;
    
    if (!thumbnail && item.enclosure?.link) {
      thumbnail = item.enclosure.link;
    }

    if (!thumbnail) {
      thumbnail = extractImageFromContent(item.content || '', item.description || '');
    }

    return {
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      description: item.description || '',
      content: item.content,
      thumbnail: thumbnail,
      author: item.author,
      categories: item.categories,
      guid: item.guid || item.link,
    };
  });
};

/**
 * Translate news items based on the current language
 */
const translateNewsItems = async (
  items: NewsItem[],
  targetLanguage: Language
): Promise<NewsItem[]> => {
  // Don't translate if target is English
  if (targetLanguage === 'en') {
    return items;
  }

  try {
    const { translateText, extractPlainText } = await import('@/utils/translation/googleTranslate');
    
    // Translate items in parallel (batch processing)
    const translatedItems = await Promise.all(
      items.map(async (item) => {
        // Extract plain text from HTML descriptions
        const plainTitle = extractPlainText(item.title);
        const plainDescription = extractPlainText(item.description);
        
        // Translate title and description
        const [translatedTitle, translatedDescription] = await Promise.all([
          translateText(plainTitle, targetLanguage, 'en'),
          translateText(plainDescription, targetLanguage, 'en'),
        ]);

        return {
          ...item,
          title: translatedTitle,
          description: translatedDescription,
          // Keep original content for reference, but translate if needed
          content: item.content ? await translateText(extractPlainText(item.content), targetLanguage, 'en') : item.content,
        };
      })
    );

    return translatedItems;
  } catch (error) {
    console.error('[News API] Error translating news items:', error);
    // Return original items if translation fails
    return items;
  }
};

/**
 * Fetch news for a specific category from Google News RSS
 */
export const fetchNewsByCategory = async (
  category: NewsCategory,
  query?: string,
  location?: string,
  targetLanguage?: Language
): Promise<NewsItem[]> => {
  try {
    console.log('[News API] Fetching news:', { category, query, location, targetLanguage });
    const rssUrl = buildGoogleNewsRSSUrl(category, query, location);
    console.log('[News API] Google News RSS URL:', rssUrl);

    const rssData = await fetchRSS2JSON(rssUrl);

    // Validate response structure
    if (!rssData || rssData.status !== 'ok') {
      console.error('[News API] Invalid RSS2JSON response:', rssData);
      throw new Error(`Invalid RSS2JSON response: ${rssData?.status || 'unknown status'}`);
    }

    if (!Array.isArray(rssData.items)) {
      console.error('[News API] Invalid RSS2JSON response structure:', rssData);
      throw new Error('Invalid RSS2JSON response format - items is not an array');
    }

    if (rssData.items.length === 0) {
      console.warn('[News API] No items found in RSS2JSON response');
      return []; // Return empty array instead of error
    }

    console.log(`[News API] Successfully fetched ${rssData.items.length} items`);

    // Transform items
    console.log('[News API] Transforming items...');
    const transformed = transformRSSItems(rssData.items);
    console.log(`[News API] Successfully transformed ${transformed.length} items`);

    // Translate items if target language is specified and not English
    if (targetLanguage && targetLanguage !== 'en') {
      console.log(`[News API] Translating items to ${targetLanguage}...`);
      const translated = await translateNewsItems(transformed, targetLanguage);
      console.log(`[News API] Successfully translated ${translated.length} items`);
      return translated;
    }

    return transformed;
  } catch (error) {
    console.error('[News API] Error fetching news:', error);

    // Provide more helpful error messages
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;

      if (status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else if (status === 403) {
        throw new Error('Access forbidden. Please try again later.');
      } else if (status === 404) {
        throw new Error('News feed not found. Please try a different category.');
      } else if (status && status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(`Failed to fetch news: ${message || 'Unknown error'}`);
      }
    }

    throw error instanceof Error
      ? error
      : new Error('Failed to fetch news from Google News');
  }
};

/**
 * Get user's location for news (defaults to US)
 */
export const getUserLocation = (): string => {
  // Try to get from browser's timezone or language
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Extract country code from timezone (e.g., "America/New_York" -> "US")
    // This is a simple approach; you might want to use a more robust solution
    if (timezone.includes('America')) return 'US';
    if (timezone.includes('Europe/London')) return 'GB';
    if (timezone.includes('Europe')) return 'DE';
    if (timezone.includes('Asia/Tokyo')) return 'JP';
    if (timezone.includes('Asia')) return 'IN';
    // Default to US
    return 'US';
  } catch {
    return 'US';
  }
};

