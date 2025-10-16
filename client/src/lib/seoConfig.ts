export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  structuredData?: any;
  noindex?: boolean;
}

export interface RouteConfig extends SEOConfig {
  path: string;
  matchType: 'exact' | 'starts' | 'includes';
}

// Comprehensive SEO configuration for all routes
export const routeSEOConfig: RouteConfig[] = [
  // Home/Landing
  {
    path: '/',
    matchType: 'exact',
    title: 'Ikigai Test - Discover Your Life Purpose | Ikigain',
    description: 'Discover your Ikigai with our comprehensive personality test. Find your life purpose through Japanese philosophy and get personalized career insights.',
    keywords: 'ikigai test, life purpose, Japanese philosophy, personality test, career guidance, purpose finder',
    ogImage: '/og-home.jpg'
  },
  
  // Blog routes
  {
    path: '/blog',
    matchType: 'exact',
    title: 'Ikigai Blog - Insights on Living with Purpose | Ikigain',
    description: 'Explore authentic insights on ikigai, purpose, and meaningful living. Discover practical wisdom from Japanese philosophy and modern psychology.',
    keywords: 'ikigai blog, life purpose articles, Japanese philosophy, meaningful living, personal development',
    ogImage: '/og-blog.jpg'
  },
  {
    path: '/blog/',
    matchType: 'starts',
    title: 'Blog Article - Ikigai Insights | Ikigain',
    description: 'Read our latest insights on ikigai, life purpose, and personal development through Japanese philosophy.',
    keywords: 'ikigai article, life purpose, personal development, Japanese philosophy',
    ogImage: '/og-blog-post.jpg'
  },
  
  // Test routes
  {
    path: '/test',
    matchType: 'exact',
    title: 'Ikigai Test - Find Your Life Purpose | Ikigain',
    description: 'Take our comprehensive Ikigai test to discover your life purpose. Get personalized insights through the Japanese philosophy of finding your reason for being.',
    keywords: 'ikigai test, personality assessment, life purpose test, Japanese philosophy, career guidance',
    ogImage: '/og-test.jpg'
  },
  {
    path: '/ikigai-test',
    matchType: 'exact',
    title: 'Interactive Ikigai Assessment | Ikigain',
    description: 'Complete our interactive Ikigai assessment to uncover your unique purpose and passion. Based on authentic Japanese philosophy principles.',
    keywords: 'ikigai assessment, interactive test, life purpose, Japanese philosophy, self discovery',
    ogImage: '/og-ikigai-test.jpg'
  },
  {
    path: '/type-test',
    matchType: 'exact',
    title: 'Ikigai Type Test - Discover Your Personality | Ikigain',
    description: 'Take our Ikigai type test to discover your unique personality pattern and how it connects to your life purpose.',
    keywords: 'ikigai types, personality test, life purpose types, Japanese philosophy, self assessment',
    ogImage: '/og-type-test.jpg'
  },
  
  // Results and Dashboard
  {
    path: '/results',
    matchType: 'exact',
    title: 'Your Ikigai Results - Life Purpose Insights | Ikigain',
    description: 'Discover your personalized Ikigai results and learn how to apply them to find greater purpose and fulfillment in life.',
    keywords: 'ikigai results, life purpose insights, personal development, career guidance',
    ogImage: '/og-results.jpg'
  },
  {
    path: '/premium-results',
    matchType: 'exact',
    title: 'Premium Ikigai Analysis - Detailed Life Purpose Guide | Ikigain',
    description: 'Access your comprehensive Ikigai analysis with detailed insights, career recommendations, and actionable steps toward your purpose.',
    keywords: 'premium ikigai, detailed analysis, career guidance, life purpose guide',
    ogImage: '/og-premium.jpg'
  },
  {
    path: '/dashboard',
    matchType: 'starts',
    title: 'Your Ikigai Dashboard - Personal Insights | Ikigain',
    description: 'Access your personal Ikigai dashboard with saved results, progress tracking, and personalized recommendations.',
    keywords: 'ikigai dashboard, personal insights, progress tracking, life purpose journey',
    ogImage: '/og-dashboard.jpg'
  },
  
  // About and Information
  {
    path: '/about',
    matchType: 'exact',
    title: 'About Us - Our Story | Ikigain',
    description: 'Meet Sindy, founder of Ikigain. Learn how her personal journey with Japanese philosophy led to creating interactive Ikigai test tools and comprehensive life purpose discovery.',
    keywords: 'about ikigain, founder story, Japanese philosophy, life purpose mission',
    ogImage: '/og-about.jpg'
  },
  {
    path: '/what-is-ikigai',
    matchType: 'exact',
    title: 'What is Ikigai? - The Japanese Secret to Life Purpose | Ikigain',
    description: 'Discover the authentic Japanese concept of Ikigai. Learn how this ancient philosophy can help you find your reason for being and live a more purposeful life.',
    keywords: 'what is ikigai, Japanese philosophy, life purpose, reason for being, ikigai meaning',
    ogImage: '/og-what-is-ikigai.jpg'
  },
  
  // Personality Types
  {
    path: '/personality-types',
    matchType: 'exact',
    title: 'Ikigai Personality Types - Find Your Purpose Profile | Ikigain',
    description: 'Explore the different Ikigai personality types and discover which one aligns with your unique path to purpose and fulfillment.',
    keywords: 'ikigai personality types, purpose profiles, life purpose types, Japanese philosophy',
    ogImage: '/og-personality-types.jpg'
  },
  {
    path: '/ikigai-types/builder',
    matchType: 'exact',
    title: 'The Builder - Ikigai Personality Type | Ikigain',
    description: 'Discover the Builder Ikigai type: practical, action-oriented individuals who find purpose through creating tangible value and building lasting impact.',
    keywords: 'ikigai builder, practical purpose, action-oriented, tangible impact',
    ogImage: '/og-builder-type.jpg'
  },
  {
    path: '/ikigai-types/dreamer',
    matchType: 'exact',
    title: 'The Dreamer - Ikigai Personality Type | Ikigain',
    description: 'Explore the Dreamer Ikigai type: visionary souls who find purpose through imagination, creativity, and inspiring others with their unique perspective.',
    keywords: 'ikigai dreamer, visionary purpose, creativity, imagination',
    ogImage: '/og-dreamer-type.jpg'
  },
  {
    path: '/ikigai-types/explorer',
    matchType: 'exact',
    title: 'The Explorer - Ikigai Personality Type | Ikigain',
    description: 'Understand the Explorer Ikigai type: curious adventurers who find purpose through discovery, learning, and expanding their horizons.',
    keywords: 'ikigai explorer, curious purpose, discovery, adventure',
    ogImage: '/og-explorer-type.jpg'
  },
  {
    path: '/ikigai-types/achiever',
    matchType: 'exact',
    title: 'The Achiever - Ikigai Personality Type | Ikigain',
    description: 'Learn about the Achiever Ikigai type: goal-driven individuals who find purpose through excellence, success, and meaningful accomplishments.',
    keywords: 'ikigai achiever, goal-driven purpose, excellence, success',
    ogImage: '/og-achiever-type.jpg'
  },
  {
    path: '/ikigai-types/helper',
    matchType: 'exact',
    title: 'The Helper - Ikigai Personality Type | Ikigain',
    description: 'Discover the Helper Ikigai type: compassionate souls who find purpose through service, supporting others, and making a positive difference.',
    keywords: 'ikigai helper, service purpose, compassion, helping others',
    ogImage: '/og-helper-type.jpg'
  },
  {
    path: '/ikigai-types/creative-enthusiast',
    matchType: 'exact',
    title: 'Creative Enthusiast - Ikigai Personality Type | Ikigain',
    description: 'Explore the Creative Enthusiast Ikigai type: passionate artists who find purpose through creative expression and inspiring others.',
    keywords: 'ikigai creative, artistic purpose, creative expression, inspiration',
    ogImage: '/og-creative-type.jpg'
  },
  {
    path: '/ikigai-types/skilled-expert',
    matchType: 'exact',
    title: 'Skilled Expert - Ikigai Personality Type | Ikigain',
    description: 'Understand the Skilled Expert Ikigai type: masters of their craft who find purpose through expertise, knowledge sharing, and professional excellence.',
    keywords: 'ikigai expert, skilled purpose, expertise, mastery',
    ogImage: '/og-expert-type.jpg'
  },
  {
    path: '/ikigai-types/purpose-driven-leader',
    matchType: 'exact',
    title: 'Purpose-Driven Leader - Ikigai Personality Type | Ikigain',
    description: 'Learn about the Purpose-Driven Leader Ikigai type: natural leaders who find purpose through guiding others and creating meaningful change.',
    keywords: 'ikigai leader, leadership purpose, guiding others, meaningful change',
    ogImage: '/og-leader-type.jpg'
  },
  {
    path: '/ikigai-types/career-focused-achiever',
    matchType: 'exact',
    title: 'Career-Focused Achiever - Ikigai Personality Type | Ikigain',
    description: 'Discover the Career-Focused Achiever Ikigai type: ambitious professionals who find purpose through career excellence and professional growth.',
    keywords: 'ikigai career, professional purpose, career excellence, ambitious',
    ogImage: '/og-career-type.jpg'
  },
  
  // Shop and Commerce
  {
    path: '/shop',
    matchType: 'starts',
    title: 'Ikigai Shop - Purpose-Driven Products | Ikigain',
    description: 'Explore our collection of Ikigai-inspired products designed to support your journey of purpose and personal development.',
    keywords: 'ikigai shop, purpose products, personal development, Japanese philosophy products',
    ogImage: '/og-shop.jpg'
  },
  
  // Admin and Special Pages
  {
    path: '/admin',
    matchType: 'starts',
    title: 'Admin Dashboard | Ikigain',
    description: 'Administrative access for Ikigain platform management.',
    keywords: 'admin, dashboard, management',
    noindex: true
  },
  {
    path: '/checkout',
    matchType: 'starts',
    title: 'Checkout - Complete Your Purchase | Ikigain',
    description: 'Complete your purchase securely and begin your enhanced Ikigai journey.',
    keywords: 'checkout, purchase, secure payment',
    noindex: true
  },
  {
    path: '/privacy',
    matchType: 'exact',
    title: 'Privacy Policy | Ikigain',
    description: 'Read our privacy policy to understand how we protect your personal information and data when using our Ikigai assessment platform.',
    keywords: 'privacy policy, data protection, user privacy'
  },
  {
    path: '/terms',
    matchType: 'exact',
    title: 'Terms of Service | Ikigain',
    description: 'Review our terms of service for using the Ikigain platform and taking our Ikigai assessments.',
    keywords: 'terms of service, user agreement, platform terms'
  },
  
  // Positive Words Pages
  {
    path: '/positive-words-that-start-with-',
    matchType: 'starts',
    title: 'Positive Words - Ikigai Word Wheel | Ikigain',
    description: 'Discover inspiring positive words and their meanings. Explore how each connects to your Ikigai purpose and personal growth.',
    keywords: 'positive words, inspiration, ikigai words, personal growth'
  }
];

// Function to get SEO config for current route
export function getSEOConfigForRoute(pathname: string): SEOConfig {
  // Clean the pathname
  const cleanPath = pathname.toLowerCase().trim();
  
  // Find matching route config
  for (const config of routeSEOConfig) {
    const { path, matchType, ...seoConfig } = config;
    
    switch (matchType) {
      case 'exact':
        if (cleanPath === path) {
          return seoConfig;
        }
        break;
      case 'starts':
        if (cleanPath.startsWith(path)) {
          return seoConfig;
        }
        break;
      case 'includes':
        if (cleanPath.includes(path)) {
          return seoConfig;
        }
        break;
    }
  }
  
  // Default fallback
  return {
    title: 'Ikigai Test - Discover Your Life Purpose | Ikigain',
    description: 'Discover your Ikigai with our comprehensive personality test. Find your life purpose through Japanese philosophy and get personalized career insights.',
    keywords: 'ikigai test, life purpose, Japanese philosophy, personality test, career guidance'
  };
}

// Function to generate canonical URL
export function getCanonicalURL(pathname: string, language: string = 'en'): string {
  const baseURL = 'https://www.ikigain.org';
  
  // Clean the pathname
  let cleanPath = pathname.toLowerCase().trim();
  
  // Remove trailing slash except for root
  if (cleanPath !== '/' && cleanPath.endsWith('/')) {
    cleanPath = cleanPath.slice(0, -1);
  }
  
  // Handle language prefixes
  if (language === 'es' && !cleanPath.startsWith('/es')) {
    cleanPath = `/es${cleanPath}`;
  } else if (language === 'en' && cleanPath.startsWith('/es')) {
    cleanPath = cleanPath.replace(/^\/es/, '') || '/';
  }
  
  return `${baseURL}${cleanPath}`;
}

// Enhanced structured data generators
export function generateWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Website",
    "name": "Ikigain - Ikigai Test Platform",
    "description": "Discover your life purpose through authentic Japanese Ikigai philosophy with our comprehensive personality test and career guidance platform.",
    "url": "https://www.ikigain.org",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.ikigain.org/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Ikigain",
      "url": "https://www.ikigain.org"
    }
  };
}

export function generateBreadcrumbStructuredData(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const itemListElement = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.ikigain.org"
    }
  ];
  
  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const name = segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    itemListElement.push({
      "@type": "ListItem",
      "position": index + 2,
      "name": name,
      "item": `https://www.ikigain.org${currentPath}`
    });
  });
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": itemListElement
  };
}