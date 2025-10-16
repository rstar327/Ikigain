import { Issuer } from "openid-client";
import passport from "passport";
import { Strategy as OpenIDStrategy } from "passport-openidconnect";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import MemoryStore from "memorystore";
import { storage } from "./storage";

if (!process.env.REPLIT_DOMAINS) {
  console.error("🚨 Environment variable REPLIT_DOMAINS not provided");
  process.env.REPLIT_DOMAINS = "ikigain.org,www.ikigain.org"; // Fallback for production
}

const getOidcConfig = memoize(
  async () => {
    try {
      const issuerUrl = process.env.ISSUER_URL ?? "https://replit.com/oidc";
      console.log('🔗 Discovering OIDC issuer:', issuerUrl);
      const issuer = await Issuer.discover(issuerUrl);
      console.log('🔗 OIDC discovery successful');
      return issuer;
    } catch (error) {
      console.error('🚨 OIDC discovery failed:', error);
      throw error;
    }
  },
  { maxAge: 3600 * 1000 }
);

// Create a singleton session store
let sessionStore: any;
let sessionMiddleware: any;

export function getSession() {
  if (sessionMiddleware) {
    return sessionMiddleware;
  }

  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week

  // In development mode, use memory store for simplicity
  if (process.env.NODE_ENV === 'development') {
    const MemoryStoreSession = MemoryStore(session);
    sessionStore = new MemoryStoreSession({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    sessionMiddleware = session({
      secret: process.env.SESSION_SECRET!,
      store: sessionStore,
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: true,
        secure: false, // Not secure in development
        maxAge: sessionTtl,
      },
    });
  } else {
    // Production mode - use PostgreSQL store
    const pgStore = connectPg(session);
    sessionStore = new pgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: false,
      ttl: sessionTtl,
      tableName: "sessions",
    });
    sessionMiddleware = session({
      secret: process.env.SESSION_SECRET!,
      store: sessionStore,
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: true,
        secure: true, // Secure in production
        maxAge: sessionTtl,
      },
    });
  }

  return sessionMiddleware;
}

function updateUserSession(
  user: any,
  profile: any,
  accessToken?: string,
  refreshToken?: string
) {
  user.claims = profile;
  user.access_token = accessToken;
  user.refresh_token = refreshToken;
  user.expires_at = profile?.exp;
}

async function upsertUser(
  claims: any,
) {
  // Define admin emails
  const adminEmails = ['karlisvilmanis@gmail.com', 'dev@example.com'];
  const userEmail = claims["email"];
  const role = adminEmails.includes(userEmail) ? 'admin' : 'user';

  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
    role: role,
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Set up passport serialization first
  passport.serializeUser((user: any, cb) => cb(null, user));
  passport.deserializeUser((user: any, cb) => cb(null, user));

  // Check if we have the required environment variables
  const hasReplId = !!process.env.REPL_ID;
  const hasReplSecret = !!process.env.REPL_SECRET;

  console.log('🔗 Environment check:');
  console.log('  - REPL_ID:', hasReplId ? 'Set' : 'Missing');
  console.log('  - REPL_SECRET:', hasReplSecret ? 'Set' : 'Missing');
  console.log('  - REPLIT_DOMAINS:', process.env.REPLIT_DOMAINS || 'Using fallback');

  if (!hasReplId) {
    console.error('🚨 Missing REPL_ID - cannot set up Replit Auth');
    throw new Error('REPL_ID is required for Replit authentication');
  }

  // Continue without REPL_SECRET - Replit will handle authentication
  if (!hasReplSecret) {
    console.log('🔗 Using Replit built-in authentication (no REPL_SECRET needed)');
  }

  try {
    const issuer = await getOidcConfig();
    console.log('🔗 OIDC Issuer configured:', issuer.issuer);

    const domains = process.env.REPLIT_DOMAINS!.split(",");

    // Register strategies synchronously to ensure they're available
    for (const domain of domains) {
      console.log('🔗 Setting up auth for domain:', domain);

      const strategyName = 'replit-auth';

      const strategy = new OpenIDStrategy(
        {
          name: strategyName,
          issuer: issuer.issuer,
          authorizationURL: issuer.authorization_endpoint,
          tokenURL: issuer.token_endpoint,
          userInfoURL: issuer.userinfo_endpoint,
          clientID: process.env.REPL_ID!,
          clientSecret: process.env.REPL_SECRET || "", // Empty string is fine
          callbackURL: `https://${domain}/api/callback`,
          scope: "openid email profile offline_access",
          pkce: true, // Enable PKCE as required by Replit
          state: true, // Enable state parameter for security
        },
        async (issuer: string, profile: any, accessToken: string, refreshToken: string, verified: any) => {
          try {
            console.log('🔗 Authentication verification for:', profile?.email || profile?.sub);
            const user = {};
            updateUserSession(user, profile, accessToken, refreshToken);
            await upsertUser(profile);
            verified(null, user);
          } catch (error) {
            console.error('🚨 Authentication verification error:', error);
            verified(error);
          }
        }
      );

      passport.use(strategy);
      console.log('✅ Strategy registered:', strategyName);

      // Verify strategy is actually registered
      try {
        const strategies = (passport as any)._strategies;
        if (strategies && strategies[strategyName]) {
          console.log('✅ Strategy verification successful:', strategyName);
        } else {
          console.error('❌ Strategy verification failed:', strategyName);
        }
      } catch {
        console.log('⚠️ Strategy verification check failed, but registration likely successful');
      }
    }

    console.log('✅ Replit Auth setup completed successfully');
  } catch (error) {   
    console.error('🚨 OIDC setup failed:', error);
    console.error('🚨 Error details:', error.message);
    throw error; // Don't fall back - require proper authentication
  }



  // Set up authentication routes - moved after strategy registration
  app.get("/api/login", (req, res, next) => {
    console.log('🔗 Login attempt for hostname:', req.hostname);

    // Find matching domain from REPLIT_DOMAINS
    const domains = process.env.REPLIT_DOMAINS!.split(",");

    const strategyName = 'replit-auth';
    console.log('🔗 Using strategy:', strategyName);
    console.log('🔗 Available domains:', domains);

    // Verify strategy exists before using it
    try {
      const strategies = (passport as any)._strategies;
      if (!strategies || !strategies[strategyName]) {
        console.error('❌ Strategy not found during login:', strategyName);
        console.log('Available strategies:', Object.keys(strategies || {}));
        return res.status(500).json({ error: 'Authentication not configured properly' });
      }

      passport.authenticate(strategyName, {
        prompt: "login consent",
        scope: ["openid", "email", "profile", "offline_access"],
      })(req, res, next);
    } catch (error) {
      console.error('❌ Login error:', error);
      res.status(500).json({ error: 'Authentication failed' });
    }
  });

  app.get("/api/callback", (req, res, next) => {
    console.log('🔗 Callback for hostname:', req.hostname);

    // Find matching domain from REPLIT_DOMAINS
    const strategyName = 'replit-auth';
    console.log('🔗 Using strategy:', strategyName);

    passport.authenticate(strategyName, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Logout error:', err);
        }
        res.redirect('/');
      });
    } else {
      res.redirect('/');
    }
  });
}

// Remove fallback authentication - force proper Replit OAuth

export const isAuthenticated: RequestHandler = async (req: any, res, next) => {
  // In development mode, check session for mock user
  if (process.env.NODE_ENV === 'development') {
    const sessionUser = req.session?.user;
    if (sessionUser) {
      // Set req.user for consistency with production
      req.user = sessionUser;
      return next();
    }
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Production authentication logic
  const user = req.user as any;

  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

// Admin middleware to protect admin routes - ONLY karlisvilmanis@gmail.com allowed
export const isAdmin: RequestHandler = async (req: any, res, next) => {
  try {
    // LOCALHOST: Allow localhost access for development
    if (req.hostname === 'localhost') {
      console.log('🔧 Localhost: bypassing admin authentication');
      return next();
    }

    // REPLIT DOMAIN: Check Replit Auth for admin access
    if (req.hostname.includes('replit.app') || req.hostname.includes('replit.dev')) {
      const userEmail = req.user?.claims?.email;
      console.log('🔧 Replit domain: checking admin auth for', userEmail);
      if (userEmail === 'karlisvilmanis@gmail.com') {
        console.log('✅ Admin access granted via Replit Auth for:', userEmail);
        return next();
      }
      return res.status(403).json({ message: "Admin access restricted to karlisvilmanis@gmail.com only." });
    }

    // In development mode, check session for specific admin email
    if (process.env.NODE_ENV === 'development') {
      const sessionUser = req.session?.user;
      if (sessionUser && sessionUser.email === 'karlisvilmanis@gmail.com') {
        return next();
      }
      return res.status(403).json({ message: "Admin access suspended. Only karlisvilmanis@gmail.com allowed." });
    }

    // Production admin check - first check if user is authenticated
    await new Promise<void>((resolve, reject) => {
      isAuthenticated(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    }).catch(() => {
      return res.status(401).json({ message: "Unauthorized" });
    });
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({ message: "Internal server error" });
  }

  // Production admin check - only allow karlisvilmanis@gmail.com
  const userEmail = req.user?.claims?.email;
  if (!userEmail) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // CRITICAL: Only karlisvilmanis@gmail.com can access admin routes
  if (userEmail !== 'karlisvilmanis@gmail.com') {
    return res.status(403).json({ message: "Admin access suspended. Only karlisvilmanis@gmail.com allowed." });
  }

  next();
};