import { useEffect } from 'react';
import { optimizeCSSDelivery, deferNonCriticalCSS } from '@/utils/cssOptimizer';

// Loads only the most critical resources to improve FCP and LCP
export function CriticalResourceLoader() {
  useEffect(() => {
    // Optimize CSS delivery for better performance
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        deferNonCriticalCSS();
        optimizeCSSDelivery();
      }, { timeout: 3000 });
    } else {
      setTimeout(() => {
        deferNonCriticalCSS();
        optimizeCSSDelivery();
      }, 2000);
    }

    // Remove loading spinner when React has mounted
    const removeSpinner = () => {
      const spinner = document.querySelector('.loading-spinner') as HTMLElement;
      if (spinner) {
        spinner.style.transition = 'opacity 0.3s ease';
        spinner.style.opacity = '0';
        setTimeout(() => spinner.remove(), 300);
      }
    };

    // Check for React root element
    const observer = new MutationObserver(() => {
      const reactContent = document.querySelector('[data-react-root], main, .hero');
      if (reactContent) {
        removeSpinner();
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Fallback removal
    setTimeout(removeSpinner, 1500);

    return () => observer.disconnect();
  }, []);

  return null;
}