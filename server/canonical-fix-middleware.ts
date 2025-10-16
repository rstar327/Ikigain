import { Request, Response, NextFunction } from 'express';

/**
 * Canonical URL Fix Middleware
 * Ensures consistent canonical URLs for all pages to resolve ahrefs.com crawling issues
 */

export function canonicalFixMiddleware(req: Request, res: Response, next: NextFunction) {
  // Only handle GET requests for HTML pages
  // Exclude API routes, static files, and authentication routes
  if (req.method !== 'GET' || 
      req.path.startsWith('/api/') || 
      req.path.startsWith('/auth/') || 
      req.path.includes('.')) {
    return next();
  }

  // Force HTTPS and www subdomain in canonical URLs
  const protocol = 'https';
  const host = 'www.ikigain.org';
  const canonicalURL = `${protocol}://${host}${req.path}`;

  // Add canonical URL header for crawlers to reference
  res.setHeader('X-Canonical-URL', canonicalURL);
  
  // Set Link header with canonical URL (HTTP Link header)
  res.setHeader('Link', `<${canonicalURL}>; rel="canonical"`);
  
  console.log(`🔗 Canonical Fix: ${req.path} -> ${canonicalURL}`);
  
  next();
}

/**
 * Enhanced canonical URL generation that ensures consistency
 */
export function generateCanonicalURL(path: string): string {
  // Always use HTTPS and www subdomain
  const baseURL = 'https://www.ikigain.org';
  
  // Clean the path
  let cleanPath = path;
  
  // Remove trailing slashes except for root
  if (cleanPath !== '/' && cleanPath.endsWith('/')) {
    cleanPath = cleanPath.slice(0, -1);
  }
  
  // Ensure path starts with /
  if (!cleanPath.startsWith('/')) {
    cleanPath = '/' + cleanPath;
  }
  
  return `${baseURL}${cleanPath}`;
}

/**
 * Route-specific canonical URL mapping
 * This ensures every page has a consistent canonical URL
 */
export const canonicalRoutes: Record<string, string> = {
  '/': 'https://www.ikigain.org/',
  '/test': 'https://www.ikigain.org/test',
  '/blog': 'https://www.ikigain.org/blog',
  '/about': 'https://www.ikigain.org/about',
  '/what-is-ikigai': 'https://www.ikigain.org/what-is-ikigai',
  '/privacy': 'https://www.ikigain.org/privacy',
  '/terms': 'https://www.ikigain.org/terms',
  '/shop': 'https://www.ikigain.org/shop',
  '/ikigai-types/builder': 'https://www.ikigain.org/ikigai-types/builder',
  '/ikigai-types/dreamer': 'https://www.ikigain.org/ikigai-types/dreamer',
  '/ikigai-types/explorer': 'https://www.ikigain.org/ikigai-types/explorer',
  '/ikigai-types/achiever': 'https://www.ikigain.org/ikigai-types/achiever',
  '/ikigai-types/helper': 'https://www.ikigain.org/ikigai-types/helper',
  '/ikigai-types/creative-enthusiast': 'https://www.ikigain.org/ikigai-types/creative-enthusiast',
  '/ikigai-types/skilled-expert': 'https://www.ikigain.org/ikigai-types/skilled-expert',
  '/ikigai-types/purpose-driven-leader': 'https://www.ikigain.org/ikigai-types/purpose-driven-leader',
  '/ikigai-types/career-focused-achiever': 'https://www.ikigain.org/ikigai-types/career-focused-achiever'
};

/**
 * Get canonical URL for a given route
 */
export function getCanonicalForRoute(path: string): string {
  // Check if we have a specific mapping
  if (canonicalRoutes[path]) {
    return canonicalRoutes[path];
  }
  
  // Generate canonical URL for dynamic routes
  return generateCanonicalURL(path);
}