// Define the gtag function globally
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

import { minimalGA } from '@/utils/minimalGA';

// Initialize Google Analytics with maximum performance optimizations
export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-7LMJGM0MQT';
  
  // Use minimal GA implementation to reduce bundle size
  minimalGA.init(measurementId);
};

// Track page views optimized for GA4 SPA
export const trackPageView = (url: string, title?: string) => {
  // Use the enhanced GA4 page view tracking
  minimalGA.trackPageView(url, title);
};

// Track events with minimal overhead
export const trackEvent = (
  action: string, 
  category?: string, 
  label?: string, 
  value?: number
) => {
  minimalGA.track(action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};