import { useEffect } from 'react';
import { initPerformanceOptimizations, preloadImage, prefetchRoute } from '@/utils/performance';

// Preload critical resources for better performance
export function usePreloadCritical() {
  useEffect(() => {
    // Initialize general performance optimizations
    initPerformanceOptimizations();
    
    // Preload critical images that are above the fold
    const criticalImages = [
      '/attached_assets/IKIGAIN+Black (1)_1752659023498.png', // Main logo
      // Add other critical images here
    ];

    criticalImages.forEach(src => {
      preloadImage(src);
    });

    // Prefetch likely next pages for faster navigation
    const likelyRoutes = [
      '/test',
      '/type-test',
      '/about',
      '/shop'
    ];

    likelyRoutes.forEach(route => {
      prefetchRoute(route);
    });

    // Mark React root for spinner removal
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.setAttribute('data-react-root', 'true');
    }

    // Remove loading spinner when React has rendered
    const removeSpinner = () => {
      const loadingSpinner = document.querySelector('.loading-spinner');
      if (loadingSpinner) {
        loadingSpinner.remove();
      }
    };

    // Try to remove spinner after a short delay
    setTimeout(removeSpinner, 500);
  }, []);
}