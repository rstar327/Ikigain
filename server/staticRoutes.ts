/**
 * Static Route Handler for SEO-optimized pages
 * Serves pre-generated HTML files with unique canonical URLs
 * Falls back to React app for dynamic routes
 */

import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';

const staticDir = path.join(process.cwd(), 'dist/static');

/**
 * Middleware to serve static HTML files for SEO
 * Priority: Static HTML -> React App fallback
 */
export function serveStaticFirst(req: Request, res: Response, next: NextFunction) {
  // Skip if this is an API route or asset request
  if (req.path.startsWith('/api/') || 
      req.path.startsWith('/src/') || 
      req.path.startsWith('/@') ||
      req.path.includes('.') && !req.path.endsWith('.html')) {
    return next();
  }

  // Determine static file path
  let staticFilePath: string;
  
  if (req.path === '/') {
    staticFilePath = path.join(staticDir, 'index.html');
  } else if (req.path === '/es') {
    staticFilePath = path.join(staticDir, 'es.html');
  } else if (req.path === '/fr') {
    staticFilePath = path.join(staticDir, 'fr.html');
  } else {
    // Convert URL path to file path
    const pathSegments = req.path.split('/').filter(Boolean);
    staticFilePath = path.join(staticDir, ...pathSegments) + '.html';
  }

  // Check if static file exists
  if (fs.existsSync(staticFilePath)) {
    try {
      const html = fs.readFileSync(staticFilePath, 'utf-8');
      
      // Set proper headers for SEO
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour cache
      
      console.log(`📄 Serving static HTML: ${req.path} → ${path.basename(staticFilePath)}`);
      return res.send(html);
    } catch (error) {
      console.error(`❌ Error serving static file ${staticFilePath}:`, error);
    }
  }

  // Fall back to React app
  next();
}

/**
 * Get all available static routes for debugging
 */
export function getAvailableStaticRoutes(): string[] {
  const routes: string[] = [];
  
  function scanDirectory(dir: string, basePath = '') {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        scanDirectory(itemPath, `${basePath}/${item}`);
      } else if (item.endsWith('.html')) {
        const routePath = item === 'index.html' 
          ? basePath || '/'
          : `${basePath}/${item.replace('.html', '')}`;
        routes.push(routePath);
      }
    }
  }
  
  scanDirectory(staticDir);
  return routes.sort();
}

/**
 * Debug endpoint to list all static routes
 */
export function debugStaticRoutes(req: Request, res: Response) {
  const routes = getAvailableStaticRoutes();
  
  res.json({
    message: 'Available static routes for SEO',
    totalRoutes: routes.length,
    routes: routes,
    staticDirectory: staticDir,
    directoryExists: fs.existsSync(staticDir)
  });
}