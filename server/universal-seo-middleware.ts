import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

// SEO configuration for all routes
const seoConfig: Record<string, { title: string; description: string; keywords: string }> = {
  '/': {
    title: 'Ikigai Test - Discover Your Life Purpose | Ikigain',
    description: 'Discover your Ikigai with our comprehensive personality test. Find your life purpose through Japanese philosophy and get personalized career insights.',
    keywords: 'ikigai test, life purpose, Japanese philosophy, personality test, career guidance, purpose finder'
  },
  '/test': {
    title: 'Ikigai Test - Find Your Life Purpose | Ikigain',
    description: 'Take our comprehensive Ikigai test to discover your life purpose. Get personalized insights through the Japanese philosophy of finding your reason for being.',
    keywords: 'ikigai test, personality assessment, life purpose test, Japanese philosophy, career guidance'
  },
  '/blog': {
    title: 'Ikigai Blog - Insights on Living with Purpose | Ikigain',
    description: 'Explore authentic insights on ikigai, purpose, and meaningful living. Discover practical wisdom from Japanese philosophy and modern psychology.',
    keywords: 'ikigai blog, life purpose articles, Japanese philosophy, meaningful living, personal development'
  },
  '/about': {
    title: 'About Us - Our Story | Ikigain',
    description: 'Meet Sindy, founder of Ikigain. Learn how her journey with Japanese philosophy led to creating interactive Ikigai test tools.',
    keywords: 'about ikigain, founder story, Japanese philosophy, life purpose mission'
  },
  '/what-is-ikigai': {
    title: 'What is Ikigai? - The Japanese Secret to Life Purpose | Ikigain',
    description: 'Discover the authentic Japanese concept of Ikigai. Learn how this ancient philosophy can help you find your reason for being and live a more purposeful life.',
    keywords: 'what is ikigai, Japanese philosophy, life purpose, reason for being, ikigai meaning'
  },
  '/ikigai-types/builder': {
    title: 'The Builder - Ikigai Personality Type | Ikigain',
    description: 'Discover the Builder Ikigai type: practical, action-oriented individuals who find purpose through creating tangible value and building lasting impact.',
    keywords: 'ikigai builder, practical purpose, action-oriented, tangible impact'
  },
  '/ikigai-types/dreamer': {
    title: 'The Dreamer - Ikigai Personality Type | Ikigain',
    description: 'Explore the Dreamer Ikigai type: visionary souls who find purpose through imagination, creativity, and inspiring others with their unique perspective.',
    keywords: 'ikigai dreamer, visionary purpose, creativity, imagination'
  },
  '/ikigai-types/explorer': {
    title: 'The Explorer - Ikigai Personality Type | Ikigain',
    description: 'Understand the Explorer Ikigai type: curious adventurers who find purpose through discovery, learning, and expanding their horizons.',
    keywords: 'ikigai explorer, curious purpose, discovery, adventure'
  },
  '/ikigai-types/achiever': {
    title: 'The Achiever - Ikigai Personality Type | Ikigain',
    description: 'Learn about the Achiever Ikigai type: goal-driven individuals who find purpose through excellence, success, and meaningful accomplishments.',
    keywords: 'ikigai achiever, goal-driven purpose, excellence, success'
  },
  '/ikigai-types/helper': {
    title: 'The Helper - Ikigai Personality Type | Ikigain',
    description: 'Discover the Helper Ikigai type: compassionate souls who find purpose through service, supporting others, and making a positive difference.',
    keywords: 'ikigai helper, service purpose, compassion, helping others'
  }
};

function generateMetaTags(config: { title: string; description: string; keywords: string }, path: string): string {
  // Ensure consistent canonical URL format - always include trailing slash for root
  const canonical = path === '/' ? 'https://www.ikigain.org/' : `https://www.ikigain.org${path}`;
  const ogImage = `https://www.ikigain.org/og${path === '/' ? '-home' : path.replace(/\//g, '-')}.jpg`;
  
  return `
    <title>${config.title}</title>
    <meta name="description" content="${config.description}" />
    <meta name="keywords" content="${config.keywords}" />
    <link rel="canonical" href="${canonical}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${config.title}" />
    <meta property="og:description" content="${config.description}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:site_name" content="Ikigain - Discover Your Life Purpose" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="${canonical}" />
    <meta property="twitter:title" content="${config.title}" />
    <meta property="twitter:description" content="${config.description}" />
    <meta property="twitter:image" content="${ogImage}" />
    
    <!-- Additional SEO -->
    <meta name="robots" content="index, follow" />
    <meta name="author" content="Ikigai Team" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  `.trim();
}

function generateUniversalSEOHTML(config: { title: string; description: string; keywords: string }, path: string): string {
  // Ensure consistent canonical URL format - always include trailing slash for root
  const canonical = path === '/' ? 'https://www.ikigain.org/' : `https://www.ikigain.org${path}`;
  const metaTags = generateMetaTags(config, path);
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    ${metaTags}
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Ikigain - Ikigai Test Platform",
      "description": "${config.description}",
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
    
    <!-- Redirect to full React app after meta tags are read -->
    <script>
      // Small delay to ensure crawlers can read meta tags
      setTimeout(() => {
        if (typeof window !== 'undefined' && !navigator.userAgent.match(/bot|crawler|spider|crawling|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram|discord|slackbot|pinterest|google|yahoo|bing|duckduckgo|baidu|yandex|archiver|indexer|preview|unfurl|embed|parser|scraper|validator|checker|test|curl|wget|http|fetch|postman/i)) {
          window.location.href = '${canonical}';
        }
      }, 100);
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
        <p>${config.description}</p>
        <a href="${canonical}" class="cta">Discover Your Ikigai →</a>
        <p style="margin-top: 20px; font-size: 0.9em; opacity: 0.8;">
          Loading full application...
        </p>
    </div>
</body>
</html>`;
}

export function universalSEOMiddleware(req: Request, res: Response, next: NextFunction) {
  // Only handle GET requests for HTML pages
  // Exclude API routes, static files, and authentication routes
  if (req.method !== 'GET' || 
      req.path.startsWith('/api/') || 
      req.path.startsWith('/auth/') || 
      req.path.includes('.')) {
    return next();
  }
  
  // Check if this needs SEO optimization (any crawler, tool, or link preview system)
  const userAgent = req.headers['user-agent'] || '';
  const needsSEO = /bot|crawler|spider|crawling|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram|discord|slackbot|pinterest|google|yahoo|bing|duckduckgo|baidu|yandex|archiver|indexer|preview|unfurl|embed|parser|scraper|validator|checker|test|curl|wget|http|fetch|postman|insomnia|httpie/i.test(userAgent);
  
  // Also serve SEO content for specific Accept headers that indicate link preview requests
  const isLinkPreview = req.headers['accept']?.includes('text/html') && 
                       (req.headers['user-agent']?.toLowerCase().includes('preview') ||
                        req.headers['user-agent']?.toLowerCase().includes('unfurl') ||
                        req.headers['user-agent']?.toLowerCase().includes('embed') ||
                        req.headers['user-agent']?.toLowerCase().includes('share'));
  
  if (!needsSEO && !isLinkPreview) {
    return next();
  }
  
  // Get SEO config for this route
  const routeConfig = seoConfig[req.path] || seoConfig['/'];
  
  // Generate and serve SEO-optimized HTML
  const seoHTML = generateUniversalSEOHTML(routeConfig, req.path);
  
  const requestType = needsSEO ? 'crawler/tool' : 'link preview';
  console.log(`🔗 Universal SEO: Serving optimized HTML to ${requestType}: ${userAgent.substring(0, 50)}... -> ${req.path}`);
  
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400'); // 24 hour cache
  return res.send(seoHTML);
}

export { seoConfig };