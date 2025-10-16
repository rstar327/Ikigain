import { useEffect } from 'react';

// Component to handle various performance optimizations
export function PerformanceOptimizer() {
  useEffect(() => {
    // Remove unused CSS selectors at runtime (basic CSS purging)
    const removeUnusedStyles = () => {
      const stylesheets = Array.from(document.styleSheets);
      
      stylesheets.forEach(stylesheet => {
        if (stylesheet.href && stylesheet.href.includes('replit-dev-banner')) {
          try {
            stylesheet.disabled = true;
          } catch {
            // Silently handle cross-origin stylesheets
          }
        }
      });
    };

    // Optimize images on the page
    const optimizeImages = () => {
      const images = document.querySelectorAll('img');
      
      images.forEach(img => {
        // Add loading="lazy" if not already present
        if (!img.getAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }
        
        // Add decoding="async" for better performance
        if (!img.getAttribute('decoding')) {
          img.setAttribute('decoding', 'async');
        }
        
        // Set up intersection observer for better lazy loading
        if ('IntersectionObserver' in window) {
          const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const img = entry.target as HTMLImageElement;
                if (img.dataset.src) {
                  img.src = img.dataset.src;
                  imgObserver.unobserve(img);
                }
              }
            });
          }, {
            threshold: 0.1,
            rootMargin: '50px'
          });
          
          imgObserver.observe(img);
        }
      });
    };

    // Minimize main thread blocking
    const optimizePerformance = () => {
      // Use requestIdleCallback for non-critical tasks
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          removeUnusedStyles();
          optimizeImages();
        });
      } else {
        setTimeout(() => {
          removeUnusedStyles();
          optimizeImages();
        }, 100);
      }
    };

    // Run optimizations after initial render
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', optimizePerformance);
    } else {
      optimizePerformance();
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', optimizePerformance);
    };
  }, []);

  return null; // This component doesn't render anything
}