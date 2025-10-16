import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

// Routes that have SEO-optimized HTML files
const seoRoutes = new Set([
  '/',
  '/test',
  '/blog',
  '/about',
  '/what-is-ikigai',
  '/ikigai-types/builder',
  '/ikigai-types/dreamer',
  '/ikigai-types/explorer',
  '/ikigai-types/achiever',
  '/ikigai-types/helper'
]);

export function serveSEOOptimizedPages(req: Request, res: Response, next: NextFunction) {
  // Only handle GET requests
  if (req.method !== 'GET') {
    return next();
  }
  
  // Check if this is a request from any crawler or link preview system
  const userAgent = req.headers['user-agent'] || '';
  const isCrawler = /bot|crawler|spider|crawling|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram|discord|slackbot|pinterest|google|yahoo|bing|duckduckgo|baidu|yandex|archiver|indexer|preview|unfurl|embed|parser|scraper|validator|checker|test|curl|wget|http|fetch|postman/i.test(userAgent);
  
  // Also serve SEO content for specific patterns that indicate link preview requests
  const isLinkPreview = req.headers['accept']?.includes('text/html') && 
                       (req.headers['user-agent']?.toLowerCase().includes('preview') ||
                        req.headers['user-agent']?.toLowerCase().includes('unfurl') ||
                        req.headers['user-agent']?.toLowerCase().includes('embed'));
  
  if (!isCrawler && !isLinkPreview) {
    return next();
  }
  
  // Check if we have a SEO-optimized version for this route
  if (!seoRoutes.has(req.path)) {
    return next();
  }
  
  // Generate filename for the SEO page
  const filename = req.path === '/' ? 'index.html' : `${req.path.replace(/\//g, '_')}.html`;
  const seoFilePath = path.join(process.cwd(), 'public', 'seo', filename);
  
  // Check if the SEO file exists
  if (!fs.existsSync(seoFilePath)) {
    console.log(`⚠️ SEO file not found: ${seoFilePath}`);
    return next();
  }
  
  try {
    const seoHTML = fs.readFileSync(seoFilePath, 'utf-8');
    
    const requestType = isCrawler ? 'crawler' : 'link preview';
    console.log(`🔗 Serving SEO HTML to ${requestType}: ${userAgent.substring(0, 50)}... -> ${req.path}`);
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 24 hour cache
    return res.send(seoHTML);
  } catch (error) {
    console.error(`❌ Error serving SEO file for ${req.path}:`, error);
    return next();
  }
}

// Export the list of SEO routes for reference
export { seoRoutes };