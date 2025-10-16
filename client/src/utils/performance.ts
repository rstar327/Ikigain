// Performance utilities for improving page speed metrics

export const prefetchRoute = (route: string) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = route;
  document.head.appendChild(link);
};

export const preloadImage = (src: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
};

export const deferNonCriticalCSS = () => {
  // Move non-critical CSS to the end of loading queue
  const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
  stylesheets.forEach((stylesheet) => {
    const link = stylesheet as HTMLLinkElement;
    if (link.href.includes('fonts.googleapis.com') || 
        link.href.includes('cdn.jsdelivr.net') ||
        link.href.includes('unpkg.com')) {
      link.rel = 'preload';
      link.as = 'style';
      link.onload = () => {
        link.rel = 'stylesheet';
      };
    }
  });
};

export const optimizeForMobile = () => {
  // Add mobile-specific optimizations
  if ('serviceWorker' in navigator && !window.location.hostname.includes('localhost')) {
    // Register service worker for caching (basic implementation)
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Silently fail if service worker not available
    });
  }

  // Reduce animations on low-end devices
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches || navigator.hardwareConcurrency <= 2) {
    document.documentElement.style.setProperty('--animation-duration', '0.1s');
  }
};

export const measurePerformance = () => {
  // Measure key performance metrics
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');
        
        if (navigation) {
          console.log('Performance Metrics:', {
            'DOM Content Loaded': `${navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart}ms`,
            'Load Complete': `${navigation.loadEventEnd - navigation.loadEventStart}ms`,
            'First Paint': paint.find(p => p.name === 'first-paint')?.startTime + 'ms',
            'First Contentful Paint': paint.find(p => p.name === 'first-contentful-paint')?.startTime + 'ms'
          });
        }
      }, 0);
    });
  }
};

export const initPerformanceOptimizations = () => {
  deferNonCriticalCSS();
  optimizeForMobile();
  
  if (process.env.NODE_ENV === 'development') {
    measurePerformance();
  }
};