import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { trackPageView } from '../lib/analytics';

export const useAnalytics = () => {
  const [location] = useLocation();
  const prevLocationRef = useRef<string>(location);
  
  useEffect(() => {
    // Track page views with a small delay to ensure the page title is updated
    const timer = setTimeout(() => {
      if (location !== prevLocationRef.current) {
        trackPageView(location, document.title);
        prevLocationRef.current = location;
      }
    }, 100); // Small delay to ensure title is set by SEO component
    
    return () => clearTimeout(timer);
  }, [location]);
};