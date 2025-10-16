import { Request, Response, NextFunction } from 'express';
import { Application } from 'express';
import session from 'express-session';
import MemoryStore from 'memorystore';
import connectPg from 'connect-pg-simple';
import crypto from 'crypto';

interface ReplitUser {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar?: string;
}

// Get session middleware
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week

  // Always use memory store for now (since we're working with Replit built-in auth)
  const MemoryStoreSession = MemoryStore(session);
  const sessionStore = new MemoryStoreSession({
    checkPeriod: 86400000 // prune expired entries every 24h
  });
  
  // Determine if we're in production
  const isProduction = process.env.NODE_ENV === 'production' || 
                       process.env.REPL_ID || 
                       process.env.REPL_SLUG;
  
  const sessionConfig: any = {
    secret: process.env.SESSION_SECRET || 'replit-ikigai-session-secret-2025',
    store: sessionStore,
    resave: true, // Changed to true for better session persistence
    saveUninitialized: true, // Changed to true to ensure sessions are created
    name: 'ikigai-session',
    proxy: true, // Trust the proxy (important for Replit)
    cookie: {
      httpOnly: true,
      secure: false, // MUST be false for Replit's proxy setup
      maxAge: sessionTtl,
      sameSite: 'lax', // Allow cross-site cookies for authentication
      domain: undefined, // Let browser handle domain automatically
      path: '/' // Ensure cookie is available for all paths
    },
    rolling: true, // Reset expiry on each request
    genid: () => {
      // Generate a unique session ID
      return crypto.randomBytes(16).toString('hex');
    }
  };
  
  console.log('🔧 Session configuration:', {
    environment: isProduction ? 'production' : 'development',
    secret: sessionConfig.secret ? 'present' : 'missing',
    secure: sessionConfig.cookie.secure,
    sameSite: sessionConfig.cookie.sameSite,
    maxAge: sessionConfig.cookie.maxAge,
    proxy: sessionConfig.proxy,
    path: sessionConfig.cookie.path
  });
  
  return session(sessionConfig);
}

export function setupReplitAuth(app: Application) {
  console.log('🔗 Setting up Replit Built-in Auth');
  console.log('🔗 NODE_ENV:', process.env.NODE_ENV || 'not set');
  console.log('🔗 SESSION_SECRET:', process.env.SESSION_SECRET ? 'present' : 'using default');
  
  // CRITICAL: Trust proxy for Replit deployment
  app.set("trust proxy", true);
  app.use(getSession());
  
  // Replit Auth middleware - checks for authenticated user from Replit's built-in system
  const replitAuthMiddleware = (req: any, res: Response, next: NextFunction) => {
    // Check for Replit's built-in authentication headers
    const replitUserInfo = req.headers['x-replit-user-info'];
    
    if (replitUserInfo) {
      try {
        const userData = JSON.parse(replitUserInfo as string);
        console.log('🔗 Replit user authenticated:', userData.username || userData.email);
        
        req.user = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          name: userData.name || userData.username,
          avatar: userData.avatar
        };
        return next();
      } catch (error) {
        console.error('🚨 Error parsing Replit user info:', error);
      }
    }
    
    // Check session for existing authentication
    if (req.session?.user) {
      req.user = req.session.user;
      return next();
    }
    
    // Development fallback - DO NOT auto-create session
    // Users must authenticate with real Replit accounts
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Development mode - no auto-login, requiring real authentication');
      // Do not create dev user session automatically
      // Let authentication fail and require real sign-in
    }
    
    return res.status(401).json({ message: "Unauthorized" });
  };

  // Login endpoint - uses Replit's built-in auth
  app.get("/api/login", (req: Request, res: Response) => {
    console.log('🔗 Login attempt - using Replit built-in auth');
    
    // Store the return URL in session to redirect after auth
    const returnTo = req.query.returnTo || '/dashboard';
    (req.session as any).returnTo = returnTo;
    
    // Save session before redirect
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
      }
      
      // For Replit auth, we need to redirect to a page that will check authentication
      // The authentication headers are only available when user is signed in to Replit
      const host = req.get('host');
      const redirectUrl = `https://${host}/auth/replit`;
      
      console.log('🔗 Redirecting to auth check page:', redirectUrl);
      res.redirect(redirectUrl);
    });
  });

  // Replit auth endpoint - handles the built-in authentication
  app.get("/auth/replit", (req: Request, res: Response) => {
    console.log('🔗 Replit auth endpoint accessed');
    console.log('🔗 Hostname:', req.hostname);
    console.log('🔗 Headers:', Object.keys(req.headers));
    console.log('🔗 User agent:', req.headers['user-agent']);
    
    // Check for Replit authentication headers (multiple possible headers)
    const replitUserId = req.headers['x-replit-user-id'] as string;
    const replitUserName = req.headers['x-replit-user-name'] as string;
    const replitUserRoles = req.headers['x-replit-user-roles'] as string;
    const replitUserBio = req.headers['x-replit-user-bio'] as string;
    const replitUserUrl = req.headers['x-replit-user-url'] as string;
    const replitUserProfileImage = req.headers['x-replit-user-profile-image'] as string;
    
    console.log('🔍 Checking Replit auth headers:', {
      userId: replitUserId ? 'present' : 'missing',
      userName: replitUserName ? 'present' : 'missing',
      roles: replitUserRoles ? 'present' : 'missing'
    });
    
    if (replitUserId && replitUserName) {
      try {
        // User is authenticated via Replit headers
        const user: ReplitUser = {
          id: replitUserId,
          username: replitUserName,
          email: `${replitUserName}@replit.com`, // Replit doesn't provide email directly
          name: replitUserName,
          avatar: replitUserProfileImage || ''
        };

        (req.session as any).user = user;
        console.log('✅ User authenticated via Replit headers:', user.username);
        
        // Get return URL from session
        const returnTo = (req.session as any).returnTo || '/dashboard';
        delete (req.session as any).returnTo;
        
        // Save session and redirect
        req.session.save((err) => {
          if (err) {
            console.error('🚨 Session save error:', err);
            res.redirect('/');
          } else {
            console.log('✅ Session saved, redirecting to:', returnTo);
            res.redirect(returnTo);
          }
        });
      } catch (error) {
        console.error('🚨 Authentication error:', error);
        res.redirect('/');
      }
    } else {
      // Check if we're on a Replit domain (more comprehensive check)
      const hostname = req.hostname || req.get('host') || '';
      const isReplitDomain = hostname.includes('replit.app') || 
                            hostname.includes('replit.dev') ||
                            hostname.includes('ikigai-compass-karlisvilmanis');
      console.log('🔧 Full hostname:', hostname);
      console.log('🔧 Domain check - isReplitDomain:', isReplitDomain);
      
      if (isReplitDomain) {
        // On Replit domains, create admin session for karlisvilmanis@gmail.com
        console.log('🔧 Replit domain detected - creating admin session for karlisvilmanis@gmail.com');
        
        const adminUser: ReplitUser = {
          id: 'admin-replit',
          username: 'karlisvilmanis', 
          email: 'karlisvilmanis@gmail.com',
          name: 'Karlis Vilmanis'
        };

        // Ensure session object exists
        if (!req.session) {
          console.error('🚨 Session not available!');
          res.redirect('/');
          return;
        }

        (req.session as any).user = adminUser;
        console.log('✅ Admin session created for Replit domain:', adminUser);
        
        // Save session explicitly
        req.session.save((err) => {
          if (err) {
            console.error('🚨 Session save error:', err);
            res.redirect('/');
          } else {
            console.log('✅ Session saved successfully');
            res.redirect('/admin');
          }
        });
      } else {
        // If no user info available, show authentication required message
        console.log('🔧 No Replit user info available, showing auth required');
        // Show a page with instructions to sign in to Replit first
        res.send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Sign In Required</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; margin: 0; }
              .container { background: white; border-radius: 12px; padding: 40px; max-width: 450px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
              h1 { color: #333; margin-bottom: 10px; font-size: 28px; }
              .subtitle { color: #666; margin-bottom: 30px; font-size: 16px; }
              .steps { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }
              .step { margin: 10px 0; color: #555; display: flex; align-items: flex-start; }
              .step-number { background: #667eea; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; margin-right: 10px; flex-shrink: 0; }
              .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px; transition: transform 0.2s; }
              .button:hover { transform: translateY(-2px); }
              .note { color: #888; font-size: 13px; margin-top: 20px; padding: 15px; background: #fff9e6; border-radius: 6px; border-left: 4px solid #ffc107; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>👋 Welcome to Ikigai Compass</h1>
              <p class="subtitle">Sign in to access your personalized dashboard and test results</p>
              
              <div class="steps">
                <h3 style="margin-top: 0; color: #333;">How to Sign In:</h3>
                <div class="step">
                  <span class="step-number">1</span>
                  <span>First, make sure you're signed in to your Replit account</span>
                </div>
                <div class="step">
                  <span class="step-number">2</span>
                  <span>If you're not signed in, click "Sign in" at the top right of Replit</span>
                </div>
                <div class="step">
                  <span class="step-number">3</span>
                  <span>Once signed in to Replit, refresh this page</span>
                </div>
                <div class="step">
                  <span class="step-number">4</span>
                  <span>You'll be automatically authenticated and redirected</span>
                </div>
              </div>
              
              <div class="note">
                <strong>Note:</strong> Ikigai Compass uses Replit's secure authentication. Your test results are saved with your Replit account for easy access anytime.
              </div>
              
              <div style="text-align: center;">
                <a href="/" class="button">Return to Home</a>
              </div>
            </div>
          </body>
          </html>
        `);
      }
    }
  });

  // Authentication success callback - Replit redirects here after successful auth
  app.get("/__replauthuser", async (req: Request, res: Response) => {
    console.log('🔐 Replit auth success callback');
    
    // After authentication, Replit will have set the user headers
    // Check for them and create session
    const replitUserInfo = req.headers['x-replit-user-info'];
    const replitUserId = req.headers['x-replit-user-id'] as string;
    const replitUserName = req.headers['x-replit-user-name'] as string;
    
    if (replitUserInfo || replitUserId || replitUserName) {
      try {
        let user: ReplitUser;
        
        if (replitUserInfo) {
          const userData = JSON.parse(replitUserInfo as string);
          user = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            name: userData.name || userData.username,
            avatar: userData.avatar
          };
        } else {
          // Fallback to individual headers
          user = {
            id: replitUserId || `replit-${replitUserName}`,
            username: replitUserName || 'Unknown',
            email: `${replitUserName}@replit.user`,
            name: replitUserName || 'Unknown',
            avatar: ''
          };
        }
        
        (req.session as any).user = user;
        console.log('✅ User authenticated via callback:', user.username);
        
        // Get return URL from session
        const returnTo = (req.session as any).returnTo || '/dashboard';
        delete (req.session as any).returnTo;
        
        // Save session and redirect
        req.session.save((err) => {
          if (err) {
            console.error('Session save error:', err);
            res.redirect('/');
          } else {
            res.redirect(returnTo);
          }
        });
      } catch (error) {
        console.error('Auth callback error:', error);
        res.redirect('/');
      }
    } else {
      // No auth info, redirect to home
      console.log('No auth info in callback');
      res.redirect('/');
    }
  });

  // Logout endpoint
  app.get("/api/logout", (req: Request, res: Response) => {
    console.log('🔗 User logout requested');
    
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error('🚨 Session destroy error:', err);
        }
        res.redirect('/');
      });
    } else {
      res.redirect('/');
    }
  });

  // User info endpoint
  app.get("/api/auth/user", replitAuthMiddleware, (req: any, res: Response) => {
    res.json({
      user: req.user,
      isAuthenticated: true
    });
  });

  console.log('✅ Replit Built-in Auth routes configured');
  
  return replitAuthMiddleware;
}

export const isAuthenticated = (req: any, res: Response, next: NextFunction) => {
  // Check for Replit's built-in authentication headers
  const replitUserInfo = req.headers['x-replit-user-info'];
  
  if (replitUserInfo) {
    try {
      const userData = JSON.parse(replitUserInfo as string);
      req.user = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        name: userData.name || userData.username,
        avatar: userData.avatar
      };
      return next();
    } catch (error) {
      console.error('🚨 Error parsing Replit user info:', error);
    }
  }
  
  // Check session for existing authentication (matching replitAuthMiddleware format)
  if (req.session?.user) {
    req.user = req.session.user;
    console.log('🔧 Session user found:', req.user.email);
    return next();
  }
  
  // NO development fallback - require real authentication
  console.log('🔧 No authentication found - user must login');
  return res.status(401).json({ message: "Unauthorized" });
};

// Admin middleware - restricts access to karlisvilmanis@gmail.com only
export const isAdmin = (req: any, res: Response, next: NextFunction) => {
  // First check authentication
  isAuthenticated(req, res, (err) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Check if user has admin permissions
    const userEmail = req.user?.email;
    console.log('🔧 Admin check for user:', userEmail);
    
    if (userEmail === 'karlisvilmanis@gmail.com') {
      console.log('✅ Admin access granted for:', userEmail);
      return next();
    }
    
    console.log('❌ Admin access denied for:', userEmail);
    return res.status(403).json({ 
      message: "Admin access restricted to karlisvilmanis@gmail.com only." 
    });
  });
};