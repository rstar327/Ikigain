# Next.js Migration Checklist - File Copy Guide

## Current Project Structure Analysis

### Core Files to Copy:
```
Current Structure:                Next.js Target:
├── client/src/                  → /app/ and /components/
│   ├── pages/ (70+ files)       → /app/ (converted to route.tsx)
│   ├── components/ (80+ files)  → /components/ (direct copy)
│   ├── hooks/ (6 files)         → /hooks/ (direct copy)
│   ├── lib/ (20+ files)         → /lib/ (direct copy)
│   └── i18n/ (translation files)→ /lib/i18n/ (adapt for next-intl)
├── shared/ (2 files)            → /lib/shared/ (direct copy)
├── server/ (10 files)           → /app/api/ (convert routes)
├── public/ (assets)             → /public/ (direct copy)
└── package.json                 → Update dependencies
```

## Step 1: Create Next.js Project

### 1.1 Fork Replit's Next.js Template
1. Go to: https://replit.com/@replit/Nextjs
2. Click "Fork" or "Use Template"
3. Rename to: "ikigai-nextjs-migration"

### 1.2 Basic Next.js Structure
```
ikigai-nextjs-migration/
├── app/                    # Next.js 13+ App Router
│   ├── page.tsx           # Homepage (was client/src/pages/landing.tsx)
│   ├── layout.tsx         # Root layout
│   └── api/               # API routes (was server/routes.ts)
├── components/            # React components (copy from client/src/components/)
├── lib/                   # Utilities (copy from client/src/lib/ + shared/)
├── hooks/                 # Custom hooks (copy from client/src/hooks/)
├── public/                # Static assets
└── package.json           # Dependencies
```

## Step 2: File Migration Priority Order

### Priority 1: Core Infrastructure (Week 1)
1. **Database & Shared Logic**
   - Copy `shared/schema.ts` → `lib/shared/schema.ts`
   - Copy `shared/access-control.ts` → `lib/shared/access-control.ts`
   - Copy `server/db.ts` → `lib/db.ts`

2. **Authentication System**
   - Copy `server/replitAuth.ts` → `lib/auth.ts` (adapt)
   - Copy `client/src/hooks/useAuth.ts` → `hooks/useAuth.ts`

3. **Essential Utilities**
   - Copy `client/src/lib/queryClient.ts` → `lib/queryClient.ts`
   - Copy `client/src/lib/utils.ts` → `lib/utils.ts`

### Priority 2: UI Components (Week 1)
1. **Component Library**
   - Copy entire `client/src/components/ui/` → `components/ui/`
   - Copy `client/src/components/Navigation.tsx` → `components/Navigation.tsx`
   - Copy `client/src/components/Footer.tsx` → `components/Footer.tsx`

2. **Custom Components**
   - Copy all custom components from `client/src/components/`
   - Update import paths to use Next.js aliases

### Priority 3: Page Components (Week 2)
1. **Core Pages**
   - `client/src/pages/landing.tsx` → `app/page.tsx`
   - `client/src/pages/test.tsx` → `app/test/page.tsx`
   - `client/src/pages/what-is-ikigai.tsx` → `app/what-is-ikigai/page.tsx`

2. **Personality Type Pages**
   - `client/src/pages/ikigai-types/` → `app/ikigai-types/[type]/page.tsx`

3. **Blog System**
   - `client/src/pages/blog.tsx` → `app/blog/page.tsx`
   - `client/src/pages/blog-post.tsx` → `app/blog/[slug]/page.tsx`

### Priority 4: API Routes (Week 2)
1. **Authentication APIs**
   - Convert `server/routes.ts` auth routes → `app/api/auth/*/route.ts`

2. **Test System APIs**
   - Convert test session routes → `app/api/test-sessions/route.ts`
   - Convert results routes → `app/api/test-results/[id]/route.ts`

3. **Payment APIs**
   - Convert Stripe routes → `app/api/create-payment-intent/route.ts`

## Step 3: Configuration Files

### 3.1 Update package.json Dependencies
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@tanstack/react-query": "^5.0.0",
    "drizzle-orm": "^0.29.0",
    "@neondatabase/serverless": "^0.10.4",
    "stripe": "^14.0.0",
    "next-intl": "^3.0.0",
    // Keep all existing dependencies
  }
}
```

### 3.2 Next.js Configuration
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['storage.googleapis.com'],
  },
};

module.exports = nextConfig;
```

### 3.3 TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/hooks/*": ["./hooks/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Step 4: Key File Conversions

### 4.1 Page Component Conversion Example
```typescript
// Before: client/src/pages/landing.tsx
import { useTranslation } from 'react-i18next';

export default function Landing() {
  const { t } = useTranslation('landing');
  return (
    <div>
      <h1>{t('hero.title')}</h1>
    </div>
  );
}

// After: app/page.tsx
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('landing');
  return {
    title: t('seo.title'),
    description: t('seo.description'),
    canonical: 'https://www.ikigain.org/',
  };
}

export default async function Page() {
  const t = await getTranslations('landing');
  return (
    <div>
      <h1>{t('hero.title')}</h1>
    </div>
  );
}
```

### 4.2 API Route Conversion Example
```typescript
// Before: server/routes.ts
app.post('/api/test-sessions', async (req, res) => {
  // Logic here
});

// After: app/api/test-sessions/route.ts
export async function POST(request: Request) {
  // Same logic, different request/response handling
}
```

## Step 5: Translation System Migration

### 5.1 From i18next to next-intl
```typescript
// Before: client/src/i18n/config.ts
import i18n from 'i18next';

// After: lib/i18n.ts (next-intl)
import { getRequestConfig } from 'next-intl/server';
```

### 5.2 Translation Files
- Copy `public/locales/` → `messages/`
- Convert JSON structure for next-intl format

## Step 6: Environment Variables

### 6.1 Copy Environment Configuration
```bash
# Copy from current project
DATABASE_URL=
STRIPE_SECRET_KEY=
STRIPE_PUBLIC_KEY=
SESSION_SECRET=
# Add Next.js specific
NEXTAUTH_URL=
NEXTAUTH_SECRET=
```

## Estimated Timeline

| Week | Tasks | Files Count |
|------|-------|-------------|
| 1 | Infrastructure + UI Components | ~100 files |
| 2 | Pages + API Routes | ~80 files |
| 3 | Testing + Debugging | All files |
| 4 | SEO + Deployment | Final polish |

## Success Metrics

### Before Going Live:
- [ ] All pages load correctly
- [ ] API routes functional
- [ ] Authentication working
- [ ] Payments processing
- [ ] SEO metadata present
- [ ] Canonical URLs working

This checklist ensures systematic migration with minimal risk and maximum compatibility.