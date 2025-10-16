import { Request, Response, NextFunction } from 'express';
import { Application } from 'express';

interface ReplitUser {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar?: string;
}

export function setupReplitAuth(app: Application) {
  console.log('🔗 Setting up Replit Auth (Built-in)');
  
  // Replit Auth middleware - checks for authenticated user
  const replitAuthMiddleware = (req: any, res: Response, next: NextFunction) => {
    // In Replit environment, check for authenticated user
    const replitUser = (req as any).user;
    
    if (replitUser) {
      console.log('🔗 Replit user authenticated:', replitUser.username || replitUser.email);
      req.user = {
        id: replitUser.id,
        username: replitUser.username,
        email: replitUser.email,
        name: replitUser.name || replitUser.username,
        avatar: replitUser.avatar
      };
      return next();
    }
    
    // Check session for existing authentication
    if (req.session?.user) {
      req.user = req.session.user;
      return next();
    }
    
    return res.status(401).json({ message: "Unauthorized" });
  };

  // Login endpoint - redirects to Replit OAuth
  app.get("/api/login", (req: Request, res: Response) => {
    console.log('🔗 Login attempt - redirecting to Replit OAuth');
    
    // Use the proper Replit domain for callback
    const host = req.get('host');
    const isLocalhost = host?.includes('localhost');
    const callbackUrl = isLocalhost 
      ? `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}/api/callback`
      : `https://${host}/api/callback`;
    
    const replitOAuthUrl = `https://replit.com/auth/oauth2/authorize?client_id=${process.env.REPL_ID}&response_type=code&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=openid email profile`;
    
    console.log('🔗 Redirecting to:', replitOAuthUrl);
    console.log('🔗 Callback URL:', callbackUrl);
    res.redirect(replitOAuthUrl);
  });

  // Callback endpoint - handles OAuth callback
  app.get("/api/callback", async (req: Request, res: Response) => {
    console.log('🔗 OAuth callback received');
    const { code } = req.query;
    
    if (!code) {
      console.error('🚨 No authorization code received');
      return res.redirect('/api/login');
    }

    try {
      // Use the proper Replit domain for callback
      const host = req.get('host');
      const isLocalhost = host?.includes('localhost');
      const callbackUrl = isLocalhost 
        ? `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}/api/callback`
        : `https://${host}/api/callback`;

      // Exchange code for token
      const tokenResponse = await fetch('https://replit.com/auth/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.REPL_ID!,
          client_secret: process.env.REPL_SECRET || '',
          code: code as string,
          grant_type: 'authorization_code',
          redirect_uri: callbackUrl
        })
      });

      if (!tokenResponse.ok) {
        console.error('🚨 Token exchange failed:', tokenResponse.status);
        return res.redirect('/api/login');
      }

      const tokenData = await tokenResponse.json();
      
      // Get user info
      const userResponse = await fetch('https://replit.com/api/user', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      });

      if (!userResponse.ok) {
        console.error('🚨 User info fetch failed:', userResponse.status);
        return res.redirect('/api/login');
      }

      const userData = await userResponse.json();
      
      // Store user in session
      const user: ReplitUser = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        name: userData.name || userData.username,
        avatar: userData.avatar
      };

      (req.session as any).user = user;
      console.log('✅ User authenticated successfully:', user.username);
      
      res.redirect('/');
    } catch (error) {
      console.error('🚨 Authentication error:', error);
      res.redirect('/api/login');
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

  console.log('✅ Replit Auth routes configured');
  
  return replitAuthMiddleware;
}

export const isAuthenticated = (req: any, res: Response, next: NextFunction) => {
  if (req.session?.user) {
    req.user = req.session.user;
    return next();
  }
  
  return res.status(401).json({ message: "Unauthorized" });
};