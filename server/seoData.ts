// Server-side SEO data for proper meta tag injection
export interface SEOData {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  structuredData?: any;
}

export function getSEODataForRoute(path: string, baseUrl: string = 'https://www.ikigain.org'): SEOData {
  // Remove language prefixes to normalize path
  const normalizedPath = path.replace(/^\/(es|fr)/, '');
  
  // Default SEO data
  const defaultSEO: SEOData = {
    title: 'Ikigai Test - Discover Your Life Purpose | Ikigain',
    description: 'Discover your Ikigai with our comprehensive personality test. Find your life purpose through Japanese philosophy and get personalized career insights.',
    keywords: 'ikigai, ikigai test, life purpose, ikigai meaning, what is ikigai, personality test, Japanese philosophy, meaning of life, purpose finder',
    canonical: `${baseUrl}${path}`,
    ogImage: `${baseUrl}/og-image.jpg`,
  };

  // Route-specific SEO data
  const routeSEOMap: Record<string, Partial<SEOData>> = {
    '/': {
      title: 'Ikigai Test - Discover Your Life Purpose | Ikigain',
      description: 'Discover your Ikigai with our comprehensive personality test. Find your life purpose through Japanese philosophy and get personalized career insights.',
    },
    '/home': {
      title: 'Ikigai Test - Discover Your Life Purpose | Ikigain',
      description: 'Discover your Ikigai with our comprehensive personality test. Find your life purpose through Japanese philosophy and get personalized career insights.',
    },
    '/about': {
      title: 'About Us - Our Story | Ikigai Test - What is Ikigai',
      description: 'Meet Sindy, founder of Ikigain. Learn how her personal journey with Japanese philosophy led to creating interactive Ikigai test tools and comprehensive life purpose discovery.',
    },
    '/what-is-ikigai': {
      title: 'What is Ikigai? Complete Guide to Japanese Life Purpose Philosophy 2025',
      description: 'Discover the authentic Japanese concept of Ikigai. Learn how this ancient philosophy can help you find your reason for being and live a more purposeful life.',
    },
    '/ikigai-personality-types': {
      title: 'Ikigai Personality Types - Find Your Purpose Profile | Ikigain',
      description: 'Explore the different Ikigai personality types. Discover which type you are and learn how to align your life with your unique purpose profile.',
    },
    '/ikigai-type-test': {
      title: 'Free Ikigai Type Test - Quick Personality Assessment | Ikigain',
      description: 'Take our quick Ikigai type test to discover your personality type. Fast, free assessment based on authentic Japanese philosophy principles.',
    },
    '/ikigai-test': {
      title: 'Ikigai Test - Comprehensive Life Purpose Assessment | Ikigain',
      description: 'Take our comprehensive Ikigai test to discover your life purpose. Get personalized insights through the Japanese philosophy of finding your reason for being.',
    },
    '/blog': {
      title: 'Ikigai Blog - Insights on Living with Purpose | Ikigain',
      description: 'Explore authentic insights on ikigai, purpose, and meaningful living. Discover practical wisdom from Japanese philosophy and modern psychology.',
    },
    '/shop': {
      title: 'Ikigai Shop - Purpose Discovery Products | Ikigain',
      description: 'Discover products designed to help you find and live your Ikigai. From assessment tools to guided resources for purposeful living.',
    },
    '/privacy': {
      title: 'Privacy Policy | Ikigain.org',
      description: 'Read our privacy policy to understand how we protect your personal information and data when using our Ikigai assessment platform.',
    },
    '/terms': {
      title: 'Terms of Service | Ikigain.org',
      description: 'Read our terms of service for using the Ikigai assessment platform and related services.',
    },
    '/positive-words': {
      title: 'Positive Words - Ikigai Word Wheel | Ikigain',
      description: 'Explore positive words organized by the Ikigai philosophy. Discover inspiring vocabulary to enhance your purpose-driven communication.',
    },
    '/ikigai-word-wheel': {
      title: 'Ikigai Word Wheel - Interactive Positive Vocabulary | Ikigain',
      description: 'Interactive word wheel featuring positive vocabulary organized by Ikigai principles. Enhance your purposeful communication skills.',
    },
  };

  // Individual personality type pages (Quick Type Test)
  const quickTypePersonalities = {
    '/ikigai-types/builder': {
      title: 'The Builder - Ikigai Personality Type | Ikigain',
      description: 'Discover The Builder personality type. Learn about their strengths, challenges, and path to finding purpose through practical creation and problem-solving.',
    },
    '/ikigai-types/explorer': {
      title: 'The Explorer - Ikigai Personality Type | Ikigain',
      description: 'Discover The Explorer personality type. Learn about their adventurous spirit, curiosity, and path to finding purpose through discovery and experience.',
    },
    '/ikigai-types/dreamer': {
      title: 'The Dreamer - Ikigai Personality Type | Ikigain',
      description: 'Discover The Dreamer personality type. Learn about their visionary nature, creativity, and path to finding purpose through imagination and inspiration.',
    },
    '/ikigai-types/achiever': {
      title: 'The Achiever - Ikigai Personality Type | Ikigain',
      description: 'Discover The Achiever personality type. Learn about their goal-oriented nature, drive, and path to finding purpose through accomplishment and success.',
    },
    '/ikigai-types/helper': {
      title: 'The Helper - Ikigai Personality Type | Ikigain',
      description: 'Discover The Helper personality type. Learn about their caring nature, empathy, and path to finding purpose through service and supporting others.',
    },
  };

  // Main Ikigai Test personality types
  const mainTestPersonalities = {
    '/ikigai-types/creative-enthusiast': {
      title: 'Creative Enthusiast - Ikigai Personality Type | Ikigain',
      description: 'Discover the Creative Enthusiast personality type. Learn about their artistic nature, innovation, and path to finding purpose through creative expression.',
    },
    '/ikigai-types/skilled-expert': {
      title: 'Skilled Expert - Ikigai Personality Type | Ikigain',
      description: 'Discover the Skilled Expert personality type. Learn about their technical mastery, precision, and path to finding purpose through specialized knowledge.',
    },
    '/ikigai-types/purpose-driven-leader': {
      title: 'Purpose-Driven Leader - Ikigai Personality Type | Ikigain',
      description: 'Discover the Purpose-Driven Leader personality type. Learn about their leadership vision, impact focus, and path to creating meaningful change.',
    },
    '/ikigai-types/career-focused-achiever': {
      title: 'Career-Focused Achiever - Ikigai Personality Type | Ikigain',
      description: 'Discover the Career-Focused Achiever personality type. Learn about their professional drive, ambition, and path to career fulfillment.',
    },
  };

  // Generate positive words pages
  const positiveWordsPages: Record<string, Partial<SEOData>> = {};
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  alphabet.forEach(letter => {
    const upperLetter = letter.toUpperCase();
    positiveWordsPages[`/positive-words-that-start-with-${letter}`] = {
      title: `Positive Words That Start With ${upperLetter} – Ikigai Word Wheel | Ikigain`,
      description: `Discover inspiring positive words beginning with ${upperLetter}. Learn their meanings, see examples, and explore how each connects to your Ikigai purpose.`,
      keywords: `positive words ${letter}, words starting with ${letter}, ikigai vocabulary, positive ${letter} words, meaningful words ${letter}`,
    };
  });

  // Combine all route SEO data
  const allRoutes = {
    ...routeSEOMap,
    ...quickTypePersonalities,
    ...mainTestPersonalities,
    ...positiveWordsPages,
  };

  // Get route-specific data or use default
  const routeData = allRoutes[normalizedPath as keyof typeof allRoutes] || {};
  
  return {
    ...defaultSEO,
    ...routeData,
    canonical: `${baseUrl}${path}`,
    ogTitle: routeData.title || defaultSEO.title,
    ogDescription: routeData.description || defaultSEO.description,
  };
}

export function generateMetaTags(seoData: SEOData): string {
  const { title, description, keywords, canonical, ogTitle, ogDescription, ogImage, structuredData } = seoData;
  
  return `
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="keywords" content="${keywords}">
    <meta name="robots" content="index, follow">
    <meta name="author" content="Ikigai Team">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="canonical" href="${canonical}">
    
    <!-- Open Graph tags -->
    <meta property="og:title" content="${ogTitle || title}">
    <meta property="og:description" content="${ogDescription || description}">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Ikigain">
    
    <!-- Twitter Card tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${ogTitle || title}">
    <meta name="twitter:description" content="${ogDescription || description}">
    <meta name="twitter:image" content="${ogImage}">
    
    <!-- Additional SEO meta tags -->
    <meta name="theme-color" content="#3B82F6">
    <meta name="application-name" content="Ikigai Test">
    <meta name="apple-mobile-web-app-title" content="Ikigai Test">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="format-detection" content="telephone=no">
    <meta name="msapplication-TileColor" content="#3B82F6">
    
    ${structuredData ? `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>` : ''}
  `.trim();
}