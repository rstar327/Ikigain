import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: any;
  noindex?: boolean;
  nofollow?: boolean;
  language?: string;
}

export default function SEO({
  title,
  description,
  keywords = "ikigai, ikigai test, life purpose, ikigai meaning, what is ikigai, personality test, Japanese philosophy, meaning of life, purpose finder",
  canonical,
  ogTitle,
  ogDescription,
  ogImage = "/og-image.png",
  ogType = "website",
  twitterTitle,
  twitterDescription,
  twitterImage,
  structuredData,
  noindex = false,
  nofollow = false,
  language = "en"
}: SEOProps) {
  useEffect(() => {
    // Ensure title is never empty - comprehensive fallback system
    let finalTitle = '';
    
    if (title && typeof title === 'string' && title.trim().length > 0 && !title.includes('undefined') && title !== 'undefined') {
      finalTitle = title.trim();
    } else {
      // Default title based on current page
      const path = window.location.pathname;
      if (path.includes('/positive-words-that-start-with-')) {
        const letter = path.split('-').pop()?.toUpperCase() || 'A';
        finalTitle = `Positive Words That Start With ${letter} – Ikigai Word Wheel | Ikigain`;
      } else if (path.includes('/what-is-ikigai')) {
        finalTitle = 'What is Ikigai? - The Japanese Secret to Life Purpose | Ikigain';
      } else if (path.includes('/ikigai-test')) {
        finalTitle = 'Ikigai Test - Discover Your Life Purpose | Ikigain';
      } else if (path.includes('/about')) {
        finalTitle = 'About Us - Our Story | Ikigai Test - What is Ikigai';
      } else if (path.includes('/privacy')) {
        finalTitle = 'Privacy Policy | Ikigain.org';
      } else if (path.includes('/blog')) {
        finalTitle = 'Ikigai Blog - Insights on Living with Purpose | Ikigain';
      } else if (path.includes('/ikigai-types/builder')) {
        finalTitle = 'The Builder - Ikigai Personality Type | Ikigain';
      } else if (path.includes('/ikigai-types/dreamer')) {
        finalTitle = 'The Dreamer - Ikigai Personality Type | Ikigain';
      } else if (path.includes('/ikigai-types/explorer')) {
        finalTitle = 'The Explorer - Ikigai Personality Type | Ikigain';
      } else if (path.includes('/ikigai-types/achiever')) {
        finalTitle = 'The Achiever - Ikigai Personality Type | Ikigain';
      } else if (path.includes('/ikigai-types/helper')) {
        finalTitle = 'The Helper - Ikigai Personality Type | Ikigain';
      } else if (path.includes('/ikigai-types/creative-enthusiast')) {
        finalTitle = 'Creative Enthusiast - Ikigai Personality Type | Ikigain';
      } else if (path.includes('/ikigai-types/skilled-expert')) {
        finalTitle = 'Skilled Expert - Ikigai Personality Type | Ikigain';
      } else if (path.includes('/ikigai-types/purpose-driven-leader')) {
        finalTitle = 'Purpose-Driven Leader - Ikigai Personality Type | Ikigain';
      } else if (path.includes('/ikigai-types/career-focused-achiever')) {
        finalTitle = 'Career-Focused Achiever - Ikigai Personality Type | Ikigain';
      } else {
        finalTitle = 'Ikigai Test - Discover Your Life Purpose | Ikigain';
      }
    }
    
    document.title = finalTitle;

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

    // Set link tag - Enhanced for canonical URL updates
    const setLinkTag = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`);
      
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      
      // Always update the href attribute
      link.setAttribute('href', href);
      
      // For canonical URLs, also update the canonical-url element if it exists
      if (rel === 'canonical') {
        const canonicalElement = document.querySelector('#canonical-url');
        if (canonicalElement) {
          canonicalElement.setAttribute('href', href);
        }
      }
    };

    // Ensure description is never empty - comprehensive fallback system
    let finalDescription = '';
    
    if (description && typeof description === 'string' && description.trim().length > 0 && !description.includes('undefined') && description !== 'undefined') {
      finalDescription = description.trim();
    } else {
      // Default description based on current page
      const path = window.location.pathname;
      if (path.includes('/positive-words-that-start-with-')) {
        const letter = path.split('-').pop()?.toUpperCase() || 'A';
        finalDescription = `Discover inspiring positive words beginning with ${letter}. Learn their meanings, see examples, and explore how each connects to your Ikigai purpose.`;
      } else if (path.includes('/what-is-ikigai')) {
        finalDescription = 'Discover the authentic Japanese concept of Ikigai. Learn how this ancient philosophy can help you find your reason for being and live a more purposeful life.';
      } else if (path.includes('/ikigai-test')) {
        finalDescription = 'Take our comprehensive Ikigai test to discover your life purpose. Get personalized insights through the Japanese philosophy of finding your reason for being.';
      } else if (path.includes('/about')) {
        finalDescription = 'Meet Sindy, founder of Ikigain. Learn how her personal journey with Japanese philosophy led to creating interactive Ikigai test tools and comprehensive life purpose discovery.';
      } else if (path.includes('/privacy')) {
        finalDescription = 'Read our privacy policy to understand how we protect your personal information and data when using our Ikigai assessment platform.';
      } else if (path.includes('/blog')) {
        finalDescription = 'Explore authentic insights on ikigai, purpose, and meaningful living. Discover practical wisdom from Japanese philosophy and modern psychology.';
      } else if (path.includes('/ikigai-types/')) {
        finalDescription = 'Discover your Ikigai personality type and learn how to find your unique path to purpose and fulfillment through Japanese philosophy.';
      } else {
        finalDescription = 'Discover your Ikigai with our comprehensive personality test. Find your life purpose through Japanese philosophy and get personalized career insights.';
      }
    }
    
    // Basic meta tags
    setMetaTag('description', finalDescription);
    setMetaTag('keywords', keywords);
    setMetaTag('robots', `${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`);
    setMetaTag('viewport', 'width=device-width, initial-scale=1');
    setMetaTag('author', 'Ikigai Team');
    setMetaTag('theme-color', '#3B82F6');
    
    // Set language
    document.documentElement.lang = language;
    
    // Google verification (placeholder - user will need to add actual verification codes)
    setMetaTag('google-site-verification', 'your-google-verification-code-here');
    
    // Additional SEO meta tags
    setMetaTag('application-name', 'Ikigai Test');
    setMetaTag('apple-mobile-web-app-title', 'Ikigai Test');
    setMetaTag('apple-mobile-web-app-capable', 'yes');
    setMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent');
    setMetaTag('format-detection', 'telephone=no');
    setMetaTag('mobile-web-app-capable', 'yes');
    setMetaTag('msapplication-TileColor', '#3B82F6');
    setMetaTag('msapplication-tap-highlight', 'no');

    // Canonical URL - Critical fix for SEO indexing
    const finalCanonical = canonical || `https://www.ikigain.org${window.location.pathname}`;
    console.log('Setting canonical URL:', finalCanonical); // Debug log
    setLinkTag('canonical', finalCanonical);

    // PWA manifest
    setLinkTag('manifest', '/manifest.json');
    
    // Favicon and app icons
    setLinkTag('icon', '/favicon.png');
    setLinkTag('apple-touch-icon', '/apple-touch-icon.png');

    // Open Graph tags
    setMetaTag('og:title', ogTitle || finalTitle, true);
    setMetaTag('og:description', ogDescription || finalDescription, true);
    setMetaTag('og:type', ogType, true);
    setMetaTag('og:image', ogImage, true);
    setMetaTag('og:site_name', 'Ikigai Test - Discover Your Life\'s Purpose', true);
    
    if (canonical) {
      setMetaTag('og:url', canonical, true);
    }

    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', twitterTitle || ogTitle || title);
    setMetaTag('twitter:description', twitterDescription || ogDescription || description);
    setMetaTag('twitter:image', twitterImage || ogImage);

    // Structured Data
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]');
      
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      
      script.textContent = JSON.stringify(structuredData);
    }

    // Language and hreflang for bilingual SEO
    document.documentElement.lang = language;
    
    // Set hreflang alternates for bilingual SEO
    if (canonical) {
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
      
      if (language === 'es') {
        // For Spanish pages, add English alternate
        const englishUrl = canonical.replace('/es/', '/').replace(/\/es$/, '');
        setHreflangTag('en', englishUrl);
        setHreflangTag('es', canonical);
      } else {
        // For English pages, add Spanish alternate
        const spanishUrl = canonical.includes('/es/') ? canonical : canonical.replace(/^(https?:\/\/[^/]+)(.*)$/, '$1/es$2');
        setHreflangTag('en', canonical);
        setHreflangTag('es', spanishUrl);
      }
    }

  }, [title, description, keywords, canonical, ogTitle, ogDescription, ogImage, ogType, twitterTitle, twitterDescription, twitterImage, structuredData, noindex, nofollow, language]);

  return null;
}