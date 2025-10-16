#!/usr/bin/env node

/**
 * Build-Time Static HTML Generation Script
 * Generates unique HTML files for each route with proper canonical URLs
 * Following SEO-Implementation.md Phase 1 plan
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define all routes that need static HTML generation
const routes = [
  // Main pages
  { path: '/', title: 'Ikigai Test - Discover Your Life Purpose | Ikigain', description: 'Discover your Ikigai with our comprehensive personality test. Get personalized insights into your life purpose through our scientifically-backed assessment.' },
  { path: '/what-is-ikigai', title: 'What is Ikigai? Complete Guide to Japanese Life Purpose Philosophy 2025', description: 'Discover the authentic Japanese concept of Ikigai - your reason for being. Complete guide to finding life purpose through the intersection of passion, mission, vocation, and profession.' },
  { path: '/about', title: 'About Ikigain - Your Journey to Life Purpose Discovery', description: 'Learn about Ikigain founders and our mission to help millions discover their life purpose through authentic Japanese Ikigai philosophy.' },
  { path: '/shop', title: 'Ikigai Shop - Premium Life Purpose Resources | Ikigain', description: 'Discover premium Ikigai resources, books, and tools to deepen your journey toward finding your life purpose. Professional development materials available.' },
  { path: '/blog', title: 'Ikigai Blog - Life Purpose Insights & Personal Development', description: 'Expert insights on Ikigai, life purpose discovery, and personal development. Research-backed articles to guide your journey toward meaningful living.' },
  { path: '/privacy', title: 'Privacy Policy | Ikigain', description: 'Privacy policy for Ikigain.org - how we protect your personal information during your Ikigai discovery journey.' },
  { path: '/terms', title: 'Terms of Service | Ikigain', description: 'Terms of service for using Ikigain.org platform and our Ikigai personality assessment tools.' },
  
  // Test pages
  { path: '/test', title: 'Ikigai Personality Test - Free Life Purpose Assessment | Ikigain', description: 'Take our comprehensive Ikigai personality test to discover your life purpose. Free assessment reveals your unique path to meaningful living.' },
  { path: '/type-test', title: 'Free Ikigai Type Test - Quick Personality Assessment | Ikigain', description: 'Quick 5-minute Ikigai personality type test. Discover if you\'re a Builder, Explorer, Dreamer, Achiever, or Helper.' },
  { path: '/ikigai-test', title: 'Complete Ikigai Test - Professional Life Purpose Assessment', description: 'Professional Ikigai assessment with detailed career guidance and personal development insights. Discover your authentic life purpose.' },
  { path: '/ikigai-type-test', title: 'Ikigai Personality Type Test - Find Your Purpose Type', description: 'Scientific Ikigai personality type assessment. Understand your unique approach to finding meaning and purpose in life.' },
  
  // Personality type pages (Quick test types)
  { path: '/ikigai-types/builder', title: 'The Builder - Ikigai Personality Type | Ikigain', description: 'Discover The Builder Ikigai personality type. Learn about your practical, action-oriented approach to creating meaningful impact.' },
  { path: '/ikigai-types/explorer', title: 'The Explorer - Ikigai Personality Type | Ikigain', description: 'Discover The Explorer Ikigai personality type. Learn about your adventurous, discovery-focused approach to finding purpose.' },
  { path: '/ikigai-types/dreamer', title: 'The Dreamer - Ikigai Personality Type | Ikigain', description: 'Discover The Dreamer Ikigai personality type. Learn about your visionary, imaginative approach to creating meaningful change.' },
  { path: '/ikigai-types/achiever', title: 'The Achiever - Ikigai Personality Type | Ikigain', description: 'Discover The Achiever Ikigai personality type. Learn about your goal-oriented, success-driven approach to purposeful living.' },
  { path: '/ikigai-types/helper', title: 'The Helper - Ikigai Personality Type | Ikigain', description: 'Discover The Helper Ikigai personality type. Learn about your service-oriented, compassionate approach to making a difference.' },
  
  // Main test personality types
  { path: '/ikigai-types/creative-enthusiast', title: 'Creative Enthusiast - Ikigai Personality Type | Ikigain', description: 'Discover the Creative Enthusiast Ikigai personality type. Learn about your artistic, innovative approach to finding life purpose.' },
  { path: '/ikigai-types/skilled-expert', title: 'Skilled Expert - Ikigai Personality Type | Ikigain', description: 'Discover the Skilled Expert Ikigai personality type. Learn about your mastery-focused, expertise-driven approach to purposeful work.' },
  { path: '/ikigai-types/purpose-driven-leader', title: 'Purpose-Driven Leader - Ikigai Personality Type | Ikigain', description: 'Discover the Purpose-Driven Leader Ikigai personality type. Learn about your mission-focused, leadership approach to creating impact.' },
  { path: '/ikigai-types/career-focused-achiever', title: 'Career-Focused Achiever - Ikigai Personality Type | Ikigain', description: 'Discover the Career-Focused Achiever Ikigai personality type. Learn about your success-oriented, professional growth approach to purpose.' },
  
  // Positive words pages (A-Z)
  ...Array.from({ length: 26 }, (_, i) => {
    const letter = String.fromCharCode(65 + i).toLowerCase();
    return {
      path: `/positive-words-that-start-with-${letter}`,
      title: `Positive Words That Start With ${letter.toUpperCase()} - Ikigai Inspiration | Ikigain`,
      description: `Discover uplifting positive words that start with ${letter.toUpperCase()}. Connect each word to your Ikigai journey and personal growth with meanings and examples.`
    };
  })
];

// Add Spanish and French routes
const allRoutes = [
  ...routes,
  // Spanish routes
  ...routes.map(route => ({
    ...route,
    path: `/es${route.path === '/' ? '' : route.path}`,
    title: route.title + ' (Español)',
    description: route.description + ' Disponible en español.'
  })),
  // French routes
  ...routes.map(route => ({
    ...route,
    path: `/fr${route.path === '/' ? '' : route.path}`,
    title: route.title + ' (Français)',
    description: route.description + ' Disponible en français.'
  }))
];

// Read the built HTML template from dist/public to use proper React app assets
const getBuiltHTMLTemplate = () => {
  const builtHtmlPath = path.join(__dirname, '../dist/public/index.html');
  if (fs.existsSync(builtHtmlPath)) {
    console.log('📄 Using built React app HTML template');
    return fs.readFileSync(builtHtmlPath, 'utf-8');
  }
  
  console.log('⚠️  Built HTML not found, using fallback template');
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{TITLE}}</title>
    <meta name="description" content="{{DESCRIPTION}}" />
    <link rel="canonical" href="{{CANONICAL_URL}}" id="canonical-url" />
    
    <!-- Open Graph -->
    <meta property="og:title" content="{{TITLE}}" />
    <meta property="og:description" content="{{DESCRIPTION}}" />
    <meta property="og:url" content="{{CANONICAL_URL}}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Ikigain" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{{TITLE}}" />
    <meta name="twitter:description" content="{{DESCRIPTION}}" />
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  </head>
  <body>
    <div id="root">
      <div class="loading-spinner"></div>
    </div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
};

// Generate customized HTML for each route
const getCustomizedHTML = (route) => {
  const template = getBuiltHTMLTemplate();
  const canonicalUrl = `https://www.ikigain.org${route.path}`;
  
  return template
    .replace(/<title>.*?<\/title>/i, `<title>${route.title}</title>`)
    .replace(/name="description" content=".*?"/i, `name="description" content="${route.description}"`)
    .replace(/rel="canonical" href=".*?"/i, `rel="canonical" href="${canonicalUrl}"`)
    .replace(/property="og:title" content=".*?"/i, `property="og:title" content="${route.title}"`)
    .replace(/property="og:description" content=".*?"/i, `property="og:description" content="${route.description}"`)
    .replace(/property="og:url" content=".*?"/i, `property="og:url" content="${canonicalUrl}"`)
    .replace(/name="twitter:title" content=".*?"/i, `name="twitter:title" content="${route.title}"`)
    .replace(/name="twitter:description" content=".*?"/i, `name="twitter:description" content="${route.description}"`);
};

async function generateStaticPages() {
  console.log('🔨 Starting static HTML generation for SEO...');
  
  // Create dist/static directory
  const staticDir = path.join(__dirname, '../dist/static');
  if (!fs.existsSync(staticDir)) {
    fs.mkdirSync(staticDir, { recursive: true });
  }

  let generated = 0;
  
  for (const route of allRoutes) {
    try {
      // Generate HTML content using built template
      const html = getCustomizedHTML(route);
      
      // Create file path
      let filePath;
      if (route.path === '/' || route.path === '/es' || route.path === '/fr') {
        filePath = path.join(staticDir, route.path === '/' ? 'index.html' : `${route.path.slice(1)}.html`);
      } else {
        const pathSegments = route.path.split('/').filter(Boolean);
        const dirPath = path.join(staticDir, ...pathSegments.slice(0, -1));
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
        filePath = path.join(staticDir, ...pathSegments) + '.html';
      }
      
      // Write HTML file
      fs.writeFileSync(filePath, html);
      generated++;
      
      if (generated % 20 === 0) {
        console.log(`📄 Generated ${generated} pages...`);
      }
    } catch (error) {
      console.error(`❌ Error generating ${route.path}:`, error.message);
    }
  }
  
  console.log(`✅ Successfully generated ${generated} static pages`);
  console.log(`📁 Files saved to: ${staticDir}`);
  console.log('🎯 Each page now has unique canonical URL and SEO metadata');
}

// Run the generator
generateStaticPages().catch(console.error);