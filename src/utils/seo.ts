/**
 * SEO utility functions for managing meta tags and document title
 */

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

const DEFAULT_TITLE = 'Dashverse';
const DEFAULT_DESCRIPTION = 'A modern, feature-rich dashboard application built with React, TypeScript, and Vite.';

/**
 * Updates the document title
 */
export const updateTitle = (title?: string): void => {
  if (typeof document !== 'undefined') {
    document.title = title ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
  }
};

/**
 * Updates or creates a meta tag
 */
export const updateMetaTag = (name: string, content: string, attribute: 'name' | 'property' = 'name'): void => {
  if (typeof document === 'undefined') return;

  let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
};

/**
 * Removes a meta tag
 */
export const removeMetaTag = (name: string, attribute: 'name' | 'property' = 'name'): void => {
  if (typeof document === 'undefined') return;
  
  const meta = document.querySelector(`meta[${attribute}="${name}"]`);
  if (meta) {
    meta.remove();
  }
};

/**
 * Applies SEO data to the document
 */
export const applySEO = (data: SEOData): void => {
  // Update title
  if (data.title) {
    updateTitle(data.title);
  }

  // Standard meta tags
  if (data.description) {
    updateMetaTag('description', data.description);
  }
  
  if (data.keywords) {
    updateMetaTag('keywords', data.keywords);
  }

  // Open Graph tags
  if (data.ogTitle) {
    updateMetaTag('og:title', data.ogTitle, 'property');
  } else if (data.title) {
    updateMetaTag('og:title', `${data.title} | ${DEFAULT_TITLE}`, 'property');
  }

  if (data.ogDescription) {
    updateMetaTag('og:description', data.ogDescription, 'property');
  } else if (data.description) {
    updateMetaTag('og:description', data.description, 'property');
  }

  if (data.ogImage) {
    updateMetaTag('og:image', data.ogImage, 'property');
  }

  if (data.ogType) {
    updateMetaTag('og:type', data.ogType, 'property');
  } else {
    updateMetaTag('og:type', 'website', 'property');
  }

  // Twitter Card tags
  if (data.twitterCard) {
    updateMetaTag('twitter:card', data.twitterCard);
  } else {
    updateMetaTag('twitter:card', 'summary_large_image');
  }

  if (data.twitterTitle) {
    updateMetaTag('twitter:title', data.twitterTitle);
  } else if (data.title) {
    updateMetaTag('twitter:title', `${data.title} | ${DEFAULT_TITLE}`);
  }

  if (data.twitterDescription) {
    updateMetaTag('twitter:description', data.twitterDescription);
  } else if (data.description) {
    updateMetaTag('twitter:description', data.description);
  }

  if (data.twitterImage) {
    updateMetaTag('twitter:image', data.twitterImage);
  }
};

/**
 * Resets SEO to default values
 */
export const resetSEO = (): void => {
  updateTitle();
  updateMetaTag('description', DEFAULT_DESCRIPTION);
  updateMetaTag('og:title', DEFAULT_TITLE, 'property');
  updateMetaTag('og:description', DEFAULT_DESCRIPTION, 'property');
  updateMetaTag('og:type', 'website', 'property');
  updateMetaTag('twitter:card', 'summary_large_image');
  updateMetaTag('twitter:title', DEFAULT_TITLE);
  updateMetaTag('twitter:description', DEFAULT_DESCRIPTION);
};




