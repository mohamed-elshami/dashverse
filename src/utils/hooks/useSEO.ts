import { useEffect, type DependencyList } from 'react';
import { applySEO, resetSEO, type SEOData } from '@/utils/seo';

/**
 * Hook to manage SEO meta tags and document title
 * 
 * @param data - SEO data to apply
 * @param deps - Optional dependency array for re-applying SEO when values change
 * 
 * @example
 * ```tsx
 * useSEO({
 *   title: 'Weather Forecast',
 *   description: 'Get real-time weather forecasts for any city',
 *   keywords: 'weather, forecast, temperature, climate'
 * });
 * ```
 */
export const useSEO = (data: SEOData, deps?: DependencyList): void => {
  useEffect(() => {
    applySEO(data);

    // Cleanup: reset to default on unmount
    return () => {
      resetSEO();
    };
  }, deps || []);
};

