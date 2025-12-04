export type NewsCategory =
  | 'Top Stories'
  | 'World'
  | 'Local News'
  | 'Business'
  | 'Technology'
  | 'Entertainment'
  | 'Sports'
  | 'Science'
  | 'Health'
  | 'Lifestyle';

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  content?: string;
  thumbnail?: string;
  author?: string;
  categories?: string[];
  guid?: string;
}

// RSS2JSON API Response Types
export interface RSS2JSONItem {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
  enclosure?: {
    link: string;
    type: string;
  };
  categories?: string[];
}

export interface RSS2JSONResponse {
  status: string;
  feed: {
    url: string;
    title: string;
    link: string;
    author: string;
    description: string;
    image: string;
  };
  items: RSS2JSONItem[];
}

