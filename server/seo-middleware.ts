import { Request, Response, NextFunction } from 'express';

// Route-specific SEO configurations
interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  type?: 'website' | 'article';
}

const routeSEOMap: Record<string, SEOConfig> = {
  '/': {
    title: 'Ikigai Test - Discover Your Life Purpose | Ikigain',
    description: 'Discover your Ikigai with our comprehensive personality test. Find your life purpose through Japanese philosophy and get personalized career insights.',
    keywords: 'ikigai test, life purpose, Japanese philosophy, personality test, career guidance, purpose finder',
    ogImage: '/og-home.jpg'
  },
  '/test': {
    title: 'Ikigai Test - Find Your Life Purpose | Ikigain',
    description: 'Take our comprehensive Ikigai test to discover your life purpose. Get personalized insights through the Japanese philosophy of finding your reason for being.',
    keywords: 'ikigai test, personality assessment, life purpose test, Japanese philosophy, career guidance',
    ogImage: '/og-test.jpg'
  },
  '/blog': {
    title: 'Ikigai Blog - Insights on Living with Purpose | Ikigain',
    description: 'Explore authentic insights on ikigai, purpose, and meaningful living. Discover practical wisdom from Japanese philosophy and modern psychology.',
    keywords: 'ikigai blog, life purpose articles, Japanese philosophy, meaningful living, personal development',
    ogImage: '/og-blog.jpg'
  },
  '/about': {
    title: 'About Us - Our Story | Ikigain',
    description: 'Meet Sindy, founder of Ikigain. Learn how her personal journey with Japanese philosophy led to creating interactive Ikigai test tools and comprehensive life purpose discovery.',
    keywords: 'about ikigain, founder story, Japanese philosophy, life purpose mission',
    ogImage: '/og-about.jpg'
  },
  '/what-is-ikigai': {
    title: 'What is Ikigai? - The Japanese Secret to Life Purpose | Ikigain',
    description: 'Discover the authentic Japanese concept of Ikigai. Learn how this ancient philosophy can help you find your reason for being and live a more purposeful life.',
    keywords: 'what is ikigai, Japanese philosophy, life purpose, reason for being, ikigai meaning',
    ogImage: '/og-what-is-ikigai.jpg'
  },
  '/ikigai-types/builder': {
    title: 'The Builder - Ikigai Personality Type | Ikigain',
    description: 'Discover the Builder Ikigai type: practical, action-oriented individuals who find purpose through creating tangible value and building lasting impact.',
    keywords: 'ikigai builder, practical purpose, action-oriented, tangible impact',
    ogImage: '/og-builder-type.jpg'
  },
  '/ikigai-types/dreamer': {
    title: 'The Dreamer - Ikigai Personality Type | Ikigain',
    description: 'Explore the Dreamer Ikigai type: visionary souls who find purpose through imagination, creativity, and inspiring others with their unique perspective.',
    keywords: 'ikigai dreamer, visionary purpose, creativity, imagination',
    ogImage: '/og-dreamer-type.jpg'
  },
  '/ikigai-types/explorer': {
    title: 'The Explorer - Ikigai Personality Type | Ikigain',
    description: 'Understand the Explorer Ikigai type: curious adventurers who find purpose through discovery, learning, and expanding their horizons.',
    keywords: 'ikigai explorer, curious purpose, discovery, adventure',
    ogImage: '/og-explorer-type.jpg'
  },
  '/ikigai-types/achiever': {
    title: 'The Achiever - Ikigai Personality Type | Ikigain',
    description: 'Learn about the Achiever Ikigai type: goal-driven individuals who find purpose through excellence, success, and meaningful accomplishments.',
    keywords: 'ikigai achiever, goal-driven purpose, excellence, success',
    ogImage: '/og-achiever-type.jpg'
  },
  '/ikigai-types/helper': {
    title: 'The Helper - Ikigai Personality Type | Ikigain',
    description: 'Discover the Helper Ikigai type: compassionate souls who find purpose through service, supporting others, and making a positive difference.',
    keywords: 'ikigai helper, service purpose, compassion, helping others',
    ogImage: '/og-helper-type.jpg'
  }
};

function getSEOForPath(path: string): SEOConfig {
  // Remove language prefixes and normalize path
  const cleanPath = path.replace(/^\/(es|fr)/, '') || '/';
  
  // Check for exact matches first
  if (routeSEOMap[cleanPath]) {
    return routeSEOMap[cleanPath];
  }
  
  // Check for pattern matches
  if (cleanPath.startsWith('/ikigai-types/')) {
    return {
      title: 'Ikigai Personality Type | Ikigain',
      description: 'Discover your Ikigai personality type and learn how to find your unique path to purpose and fulfillment through Japanese philosophy.',
      keywords: 'ikigai personality types, purpose profiles, life purpose types, Japanese philosophy',
      ogImage: '/og-personality-types.jpg'
    };
  }
  
  if (cleanPath.startsWith('/blog/')) {
    return {
      title: 'Blog Article - Ikigai Insights | Ikigain',
      description: 'Read our latest insights on ikigai, life purpose, and personal development through Japanese philosophy.',
      keywords: 'ikigai article, life purpose, personal development, Japanese philosophy',
      ogImage: '/og-blog-post.jpg',
      type: 'article'
    };
  }
  
  // Default fallback
  return routeSEOMap['/'];
}

function generateCanonicalURL(path: string): string {
  const baseURL = 'https://www.ikigain.org';
  return `${baseURL}${path}`;
}

function generateMetaTags(seo: SEOConfig, path: string): string {
  const canonical = generateCanonicalURL(path);
  const fullImageURL = seo.ogImage ? `https://www.ikigain.org${seo.ogImage}` : 'https://www.ikigain.org/og-default.jpg';
  
  return `
    <title>${seo.title}</title>
    <meta name="description" content="${seo.description}" />
    ${seo.keywords ? `<meta name="keywords" content="${seo.keywords}" />` : ''}
    <link rel="canonical" href="${canonical}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${seo.type || 'website'}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${seo.title}" />
    <meta property="og:description" content="${seo.description}" />
    <meta property="og:image" content="${fullImageURL}" />
    <meta property="og:site_name" content="Ikigain - Discover Your Life Purpose" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="${canonical}" />
    <meta property="twitter:title" content="${seo.title}" />
    <meta property="twitter:description" content="${seo.description}" />
    <meta property="twitter:image" content="${fullImageURL}" />
    
    <!-- Additional SEO -->
    <meta name="robots" content="index, follow" />
    <meta name="author" content="Ikigai Team" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  `.trim();
}

export function seoMiddleware(req: Request, res: Response, next: NextFunction) {
  // Only process GET requests for HTML pages
  if (req.method !== 'GET' || req.path.startsWith('/api/') || req.path.includes('.')) {
    return next();
  }
  
  // Check if this is a request that needs SEO handling (from any crawler or link preview system)
  const userAgent = req.headers['user-agent'] || '';
  const isCrawler = /bot|crawler|spider|crawling|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram|discord|slackbot|pinterest|google|yahoo|bing|duckduckgo|baidu|yandex|archiver|indexer|preview|unfurl|embed|parser|scraper|validator|checker|test|curl|wget|http|fetch|postman/i.test(userAgent);
  
  // Also handle specific link preview patterns
  const isLinkPreview = req.headers['accept']?.includes('text/html') && 
                       (req.headers['user-agent']?.toLowerCase().includes('preview') ||
                        req.headers['user-agent']?.toLowerCase().includes('unfurl') ||
                        req.headers['user-agent']?.toLowerCase().includes('embed'));
  
  if (isCrawler || isLinkPreview) {
    // Get SEO config for this route
    const seoConfig = getSEOForPath(req.path);
    const canonical = generateCanonicalURL(req.path);
    const metaTags = generateMetaTags(seoConfig, req.path);
    
    // Generate and send optimized HTML for crawlers
    const crawlerHTML = generateCrawlerHTML(seoConfig, canonical, metaTags);
    
    const requestType = isCrawler ? 'crawler' : 'link preview';
    console.log(`🔗 Serving SEO HTML for ${requestType}: ${userAgent.substring(0, 50)}... -> ${req.path}`);
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 24 hour cache
    return res.send(crawlerHTML);
  }
  
  // For regular users, store SEO data for potential use
  const seoConfig = getSEOForPath(req.path);
  const metaTags = generateMetaTags(seoConfig, req.path);
  
  res.locals.seo = {
    config: seoConfig,
    metaTags,
    canonical: generateCanonicalURL(req.path)
  };
  
  next();
}

function generateCrawlerHTML(seoConfig: SEOConfig, canonical: string, metaTags: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${metaTags}
    
    <!-- Additional crawler-friendly tags -->
    <meta name="robots" content="index, follow">
    <meta name="author" content="Ikigai Team">
    <meta property="fb:app_id" content="your-facebook-app-id">
    
    <!-- Structured data for rich snippets -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Ikigain - Ikigai Test Platform",
      "description": "${seoConfig.description}",
      "url": "${canonical}",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
    </script>
    
    <style>
      body { 
        font-family: system-ui, -apple-system, sans-serif;
        margin: 0;
        padding: 40px 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        text-align: center;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .container {
        max-width: 600px;
        background: rgba(255, 255, 255, 0.1);
        padding: 40px;
        border-radius: 20px;
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
      }
      h1 { font-size: 2.5em; margin-bottom: 20px; }
      p { font-size: 1.2em; line-height: 1.6; margin-bottom: 30px; }
      .cta { 
        background: #ff6b6b;
        color: white;
        padding: 15px 30px;
        border: none;
        border-radius: 50px;
        font-size: 1.1em;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
        transition: transform 0.2s;
      }
      .cta:hover { transform: scale(1.05); }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧭 Ikigain</h1>
        <p>${seoConfig.description}</p>
        <a href="${canonical}" class="cta">Discover Your Ikigai →</a>
    </div>
    
    <!-- Redirect to full app after a delay for crawlers that execute JS -->
    <script>
        setTimeout(() => {
            window.location.href = '${canonical}';
        }, 2000);
    </script>
</body>
</html>`;
}