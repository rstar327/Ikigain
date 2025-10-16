import { Request, Response, NextFunction } from 'express';
import { getSEODataForRoute, generateMetaTags } from './seoData';
import fs from 'fs';
import path from 'path';

let htmlTemplate: string | null = null;

// Load the HTML template
function getHtmlTemplate(): string {
  if (!htmlTemplate) {
    try {
      htmlTemplate = fs.readFileSync(path.join(process.cwd(), 'client/index.html'), 'utf-8');
    } catch (error) {
      console.error('Error loading HTML template:', error);
      htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{TITLE}}</title>
    {{META_TAGS}}
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;
    }
  }
  return htmlTemplate;
}

export function seoMiddleware(req: Request, res: Response, next: NextFunction) {
  // Only apply SEO for HTML requests to main pages
  const seoEnabledPaths = [
    '/',
    '/what-is-ikigai',
    '/about',
    '/ikigai-test',
    '/blog',
    '/shop',
    '/privacy',
    '/terms',
  ];
  
  const shouldApplySEO = seoEnabledPaths.includes(req.path) ||
    req.path.match(/\/positive-words-that-start-with-[a-z]$/) ||
    req.path.match(/\/ikigai-types\//) ||
    req.path.match(/\/blog\//) ||
    req.path.match(/\/es\//) ||
    req.path.match(/\/fr\//);
  
  console.log(`🔍 SEO Middleware: ${req.path}, shouldApplySEO: ${shouldApplySEO}`);
  
  if (!shouldApplySEO || !req.accepts('html')) {
    return next();
  }

  try {
    const seoData = getSEODataForRoute(req.path);
    const metaTags = generateMetaTags(seoData);
    
    let html = getHtmlTemplate();
    
    // Replace placeholders with actual SEO data
    html = html.replace('{{TITLE}}', seoData.title);
    html = html.replace('{{META_TAGS}}', metaTags);
    
    // Replace specific elements directly
    const canonicalUrl = getCanonicalUrlForRoute(req.path);
    
    // Replace title
    html = html.replace(/<title>.*?<\/title>/, `<title>${seoData.title}</title>`);
    
    // Replace description meta tag
    html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${seoData.description}">`);
    
    // Replace canonical URL
    html = html.replace(/<link rel="canonical" href="[^"]*"[^>]*>/, `<link rel="canonical" href="${canonicalUrl}">`);
    
    console.log(`✅ SEO Applied: ${req.path} -> ${seoData.title} -> ${canonicalUrl}`);
    
    res.status(200).set({ "Content-Type": "text/html" }).send(html);
  } catch (error) {
    console.error('SEO middleware error:', error);
    next();
  }
}

function getCanonicalUrlForRoute(path: string): string {
  const baseUrl = "https://www.ikigain.org";
  
  // Handle specific routes
  if (path.includes('/ikigai-test')) {
    return `${baseUrl}/ikigai-test`;
  } else if (path.includes('/what-is-ikigai')) {
    return `${baseUrl}/what-is-ikigai`;
  } else if (path.includes('/about')) {
    return `${baseUrl}/about`;
  } else if (path.includes('/blog')) {
    return `${baseUrl}/blog`;
  } else if (path.includes('/shop')) {
    return `${baseUrl}/shop`;
  } else if (path.includes('/privacy')) {
    return `${baseUrl}/privacy`;
  } else if (path.includes('/terms')) {
    return `${baseUrl}/terms`;
  } else if (path.includes('/ikigai-types/')) {
    return `${baseUrl}${path}`;
  } else if (path.includes('/positive-words-that-start-with-')) {
    return `${baseUrl}${path}`;
  } else if (path.includes('/es/') || path.includes('/fr/')) {
    return `${baseUrl}${path}`;
  } else if (path === '/' || path === '') {
    return `${baseUrl}/`;
  }
  
  return `${baseUrl}/`;
}