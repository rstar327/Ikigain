import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { serveSEOOptimizedPages } from './seo-routes';
import { universalSEOMiddleware } from './universal-seo-middleware';
import { canonicalFixMiddleware } from './canonical-fix-middleware';

// Ensure NODE_ENV is set for proper environment detection
const NODE_ENV = process.env.NODE_ENV || 'development';
if (NODE_ENV === 'development' && !process.env.NODE_ENV) {
  console.log('🔧 NODE_ENV not set, defaulting to development');
}

const app = express();

// Security headers for HTTPS
app.use((req, res, next) => {
  if (NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from public directory (for translation files and media)
app.use(express.static('public', {
  setHeaders: (res, path) => {
    // Set proper MIME types for video files
    if (path.endsWith('.mov')) {
      res.setHeader('Content-Type', 'video/quicktime');
    } else if (path.endsWith('.mp4')) {
      res.setHeader('Content-Type', 'video/mp4');
    }
    // Enable range requests for video streaming
    res.setHeader('Accept-Ranges', 'bytes');
  }
}));

// Serve attached assets with proper video support
app.use('/attached_assets', express.static('attached_assets', {
  setHeaders: (res, path) => {
    // Set proper MIME types for video files
    if (path.endsWith('.mov')) {
      res.setHeader('Content-Type', 'video/quicktime');
    } else if (path.endsWith('.mp4')) {
      res.setHeader('Content-Type', 'video/mp4');
    } else if (path.endsWith('.webm')) {
      res.setHeader('Content-Type', 'video/webm');
    }
    // Enable range requests for video streaming
    res.setHeader('Accept-Ranges', 'bytes');
    // Add cache control for media files
    res.setHeader('Cache-Control', 'public, max-age=86400');
  }
}));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Add canonical URL fix middleware first - ensures proper canonical headers
  app.use(canonicalFixMiddleware);
  
  // Add universal SEO middleware - works in all environments for any link preview/crawler
  app.use(universalSEOMiddleware);
  
  // Add legacy SEO optimization middleware for production static files
  app.use(serveSEOOptimizedPages);
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Deployment-ready port configuration
  // Priority: PORT env var -> 3000 for production -> 5000 for development
  const port = process.env.PORT || (NODE_ENV === 'production' ? 3000 : 5000);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
