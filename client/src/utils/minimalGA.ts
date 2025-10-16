// Enhanced Google Analytics implementation for SPA with proper GA4 tracking
export const minimalGA = {
  init: (measurementId: string) => {
    // Proper GA4 implementation for SPAs
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || ((...args: any[]) => window.dataLayer.push(args));
    
    // Load GA script first
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
    
    // Wait for script to load then initialize
    script.onload = () => {
      const gtag = window.gtag;
      
      gtag('js', new Date());
      gtag('config', measurementId, {
        // GA4 SPA configuration
        send_page_view: false, // We'll manually track page views for SPA
        transport_type: 'beacon',
        anonymize_ip: true,
        allow_google_signals: true,
        allow_ad_personalization_signals: false,
        // Enhanced tracking for GA4
        enhanced_conversions: true,
        custom_map: {
          'page_title': 'title',
          'page_location': 'url'
        }
      });
      
      // Send initial page view
      gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname + window.location.search
      });
      
      console.log('Google Analytics GA4 initialized with ID:', measurementId);
      console.log('Initial page view sent:', window.location.pathname);
    };
    
    return window.gtag;
  },
  
  trackPageView: (path: string, title?: string) => {
    if (window.gtag && window.dataLayer) {
      window.gtag('event', 'page_view', {
        page_title: title || document.title,
        page_location: window.location.origin + path,
        page_path: path
      });
      console.log('GA4 Page view tracked:', path, title || document.title);
    } else {
      console.warn('Google Analytics not initialized for page view');
    }
  },
  
  track: (eventName: string, parameters?: any) => {
    if (window.gtag && window.dataLayer) {
      window.gtag('event', eventName, parameters);
      console.log('GA4 Event tracked:', eventName, parameters);
    } else {
      console.warn('Google Analytics not initialized for event');
    }
  }
};

// Extend window type
declare global {
  interface Window {
    dataLayer: any[];
  }
}