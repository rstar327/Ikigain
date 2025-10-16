import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { getSEOConfigForRoute, getCanonicalURL, generateWebsiteStructuredData, generateBreadcrumbStructuredData } from '@/lib/seoConfig';

export function useDynamicSEO() {
  const [location] = useLocation();
  const { i18n } = useTranslation();
  
  useEffect(() => {
    // Get SEO config for current route
    const seoConfig = getSEOConfigForRoute(location);
    const canonical = getCanonicalURL(location, i18n.language);
    
    // Update document title
    document.title = seoConfig.title;
    
    // Helper function to set meta tag
    const setMetaTag = (property: string, content: string, isProperty = false) => {
      const attributeName = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attributeName}="${property}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attributeName, property);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };
    
    // Helper function to set link tag
    const setLinkTag = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`);
      
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      
      link.setAttribute('href', href);
    };
    
    // Set basic meta tags
    setMetaTag('description', seoConfig.description);
    if (seoConfig.keywords) {
      setMetaTag('keywords', seoConfig.keywords);
    }
    
    // Set canonical URL
    setLinkTag('canonical', canonical);
    console.log(`Setting canonical URL for ${location}:`, canonical);
    
    // Set robots meta tag
    const robotsContent = seoConfig.noindex ? 'noindex, nofollow' : 'index, follow';
    setMetaTag('robots', robotsContent);
    
    // Set Open Graph tags
    setMetaTag('og:title', seoConfig.title, true);
    setMetaTag('og:description', seoConfig.description, true);
    setMetaTag('og:url', canonical, true);
    setMetaTag('og:type', 'website', true);
    setMetaTag('og:site_name', 'Ikigain - Discover Your Life Purpose', true);
    
    if (seoConfig.ogImage) {
      setMetaTag('og:image', `https://www.ikigain.org${seoConfig.ogImage}`, true);
    }
    
    // Set Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', seoConfig.title);
    setMetaTag('twitter:description', seoConfig.description);
    
    if (seoConfig.ogImage) {
      setMetaTag('twitter:image', `https://www.ikigain.org${seoConfig.ogImage}`);
    }
    
    // Set language
    document.documentElement.lang = i18n.language;
    
    // Set hreflang alternates
    const setHreflangTag = (hreflang: string, href: string) => {
      let link = document.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`);
      
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'alternate');
        link.setAttribute('hreflang', hreflang);
        document.head.appendChild(link);
      }
      
      link.setAttribute('href', href);
    };
    
    // Add language alternates
    const enURL = getCanonicalURL(location, 'en');
    const esURL = getCanonicalURL(location, 'es');
    
    setHreflangTag('en', enURL);
    setHreflangTag('es', esURL);
    setHreflangTag('x-default', enURL); // Default to English
    
    // Set structured data
    const removeExistingStructuredData = () => {
      const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
      existingScripts.forEach(script => script.remove());
    };
    
    const addStructuredData = (data: any) => {
      const script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    };
    
    // Remove existing structured data and add new
    removeExistingStructuredData();
    
    // Add website structured data
    addStructuredData(generateWebsiteStructuredData());
    
    // Add breadcrumb structured data (except for home page)
    if (location !== '/') {
      addStructuredData(generateBreadcrumbStructuredData(location));
    }
    
    // Add route-specific structured data if provided
    if (seoConfig.structuredData) {
      addStructuredData(seoConfig.structuredData);
    }
    
  }, [location, i18n.language]);
  
  return { location, language: i18n.language };
}