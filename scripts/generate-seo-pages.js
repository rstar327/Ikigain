#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SEO configuration for all routes
const seoRoutes = [
  {
    path: '/',
    title: 'Ikigai Test - Discover Your Life Purpose | Ikigain',
    description: 'Discover your Ikigai with our comprehensive personality test. Find your life purpose through Japanese philosophy and get personalized career insights.',
    keywords: 'ikigai test, life purpose, Japanese philosophy, personality test, career guidance, purpose finder',
    ogImage: '/og-home.jpg'
  },
  {
    path: '/test',
    title: 'Ikigai Test - Find Your Life Purpose | Ikigain',
    description: 'Take our comprehensive Ikigai test to discover your life purpose. Get personalized insights through the Japanese philosophy of finding your reason for being.',
    keywords: 'ikigai test, personality assessment, life purpose test, Japanese philosophy, career guidance',
    ogImage: '/og-test.jpg'
  },
  {
    path: '/blog',
    title: 'Ikigai Blog - Insights on Living with Purpose | Ikigain',
    description: 'Explore authentic insights on ikigai, purpose, and meaningful living. Discover practical wisdom from Japanese philosophy and modern psychology.',
    keywords: 'ikigai blog, life purpose articles, Japanese philosophy, meaningful living, personal development',
    ogImage: '/og-blog.jpg'
  },
  {
    path: '/about',
    title: 'About Us - Our Story | Ikigain',
    description: 'Meet Sindy, founder of Ikigain. Learn how her personal journey with Japanese philosophy led to creating interactive Ikigai test tools and comprehensive life purpose discovery.',
    keywords: 'about ikigain, founder story, Japanese philosophy, life purpose mission',
    ogImage: '/og-about.jpg'
  },
  {
    path: '/what-is-ikigai',
    title: 'What is Ikigai? - The Japanese Secret to Life Purpose | Ikigain',
    description: 'Discover the authentic Japanese concept of Ikigai. Learn how this ancient philosophy can help you find your reason for being and live a more purposeful life.',
    keywords: 'what is ikigai, Japanese philosophy, life purpose, reason for being, ikigai meaning',
    ogImage: '/og-what-is-ikigai.jpg'
  },
  {
    path: '/ikigai-types/builder',
    title: 'The Builder - Ikigai Personality Type | Ikigain',
    description: 'Discover the Builder Ikigai type: practical, action-oriented individuals who find purpose through creating tangible value and building lasting impact.',
    keywords: 'ikigai builder, practical purpose, action-oriented, tangible impact',
    ogImage: '/og-builder-type.jpg'
  },
  {
    path: '/ikigai-types/dreamer',
    title: 'The Dreamer - Ikigai Personality Type | Ikigain',
    description: 'Explore the Dreamer Ikigai type: visionary souls who find purpose through imagination, creativity, and inspiring others with their unique perspective.',
    keywords: 'ikigai dreamer, visionary purpose, creativity, imagination',
    ogImage: '/og-dreamer-type.jpg'
  },
  {
    path: '/ikigai-types/explorer',
    title: 'The Explorer - Ikigai Personality Type | Ikigain',
    description: 'Understand the Explorer Ikigai type: curious adventurers who find purpose through discovery, learning, and expanding their horizons.',
    keywords: 'ikigai explorer, curious purpose, discovery, adventure',
    ogImage: '/og-explorer-type.jpg'
  },
  {
    path: '/ikigai-types/achiever',
    title: 'The Achiever - Ikigai Personality Type | Ikigain',
    description: 'Learn about the Achiever Ikigai type: goal-driven individuals who find purpose through excellence, success, and meaningful accomplishments.',
    keywords: 'ikigai achiever, goal-driven purpose, excellence, success',
    ogImage: '/og-achiever-type.jpg'
  },
  {
    path: '/ikigai-types/helper',
    title: 'The Helper - Ikigai Personality Type | Ikigain',
    description: 'Discover the Helper Ikigai type: compassionate souls who find purpose through service, supporting others, and making a positive difference.',
    keywords: 'ikigai helper, service purpose, compassion, helping others',
    ogImage: '/og-helper-type.jpg'
  }
];

function generateMetaTags(route) {
  const canonical = `https://www.ikigain.org${route.path}`;
  const ogImageUrl = `https://www.ikigain.org${route.ogImage}`;
  
  return `
    <title>${route.title}</title>
    <meta name="description" content="${route.description}" />
    <meta name="keywords" content="${route.keywords}" />
    <link rel="canonical" href="${canonical}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${route.title}" />
    <meta property="og:description" content="${route.description}" />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta property="og:site_name" content="Ikigain - Discover Your Life Purpose" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="${canonical}" />
    <meta property="twitter:title" content="${route.title}" />
    <meta property="twitter:description" content="${route.description}" />
    <meta property="twitter:image" content="${ogImageUrl}" />
    
    <!-- Additional SEO -->
    <meta name="robots" content="index, follow" />
    <meta name="author" content="Ikigai Team" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  `.trim();
}

function generateSEOHTML(route) {
  const metaTags = generateMetaTags(route);
  
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
      "description": "${route.description}",
      "url": "https://www.ikigain.org${route.path}",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
    </script>
    
    <!-- Redirect to full React app -->
    <script>
      // Immediately redirect to the React app
      window.location.href = 'https://www.ikigain.org${route.path}';
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
        <p>${route.description}</p>
        <a href="https://www.ikigain.org${route.path}" class="cta">Discover Your Ikigai →</a>
        <p style="margin-top: 20px; font-size: 0.9em; opacity: 0.8;">
          Redirecting to the full app...
        </p>
    </div>
</body>
</html>`;
}

// Generate SEO files
function generateSEOFiles() {
  const seoDir = path.join(__dirname, '..', 'public', 'seo');
  
  // Create SEO directory if it doesn't exist
  if (!fs.existsSync(seoDir)) {
    fs.mkdirSync(seoDir, { recursive: true });
  }
  
  console.log('🔍 Generating SEO-optimized HTML files...');
  
  seoRoutes.forEach(route => {
    const filename = route.path === '/' ? 'index.html' : `${route.path.replace(/\//g, '_')}.html`;
    const filepath = path.join(seoDir, filename);
    const html = generateSEOHTML(route);
    
    fs.writeFileSync(filepath, html);
    console.log(`✅ Generated: ${filename} for ${route.path}`);
  });
  
  console.log(`🎉 Generated ${seoRoutes.length} SEO-optimized HTML files in /public/seo/`);
  console.log('📌 These files can be served to social media crawlers for optimal sharing previews.');
}

// Run the generator
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSEOFiles();
}

export { generateSEOFiles, seoRoutes };