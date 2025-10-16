# File Copy Instructions for Next.js Migration

## Quick Start Guide

1. **Create your Next.js project** at https://replit.com/@replit/Nextjs
2. **Name it**: "ikigai-nextjs-migration"  
3. **Copy files** following this exact order

## Phase 1: Foundation Files (Copy First)

### Essential Configuration Files
```bash
# Copy these to your Next.js project root:
package.json          → Update dependencies (see NEXT-PACKAGE.json)
tsconfig.json         → Replace with NEXT-TSCONFIG.json
next.config.js        → Add this new file
.env                  → Copy your environment variables
```

### Core Database & Shared Logic
```bash
# Create lib/shared/ directory and copy:
shared/schema.ts      → lib/shared/schema.ts
shared/access-control.ts → lib/shared/access-control.ts
server/db.ts          → lib/db.ts
```

## Phase 2: Components & UI (Copy Second)

### UI Component Library (Direct Copy)
```bash
# Copy entire UI folder:
client/src/components/ui/ → components/ui/
# This includes all Shadcn components (40+ files)
```

### Custom Components (Direct Copy)
```bash
client/src/components/Navigation.tsx → components/Navigation.tsx
client/src/components/Footer.tsx → components/Footer.tsx
client/src/components/SEO.tsx → components/SEO.tsx
client/src/components/LanguageSwitcher.tsx → components/LanguageSwitcher.tsx
# ... and all other custom components
```

### Hooks & Utilities (Direct Copy)
```bash
client/src/hooks/ → hooks/
client/src/lib/ → lib/
```

## Phase 3: Pages Migration (Convert Structure)

### Homepage
```bash
client/src/pages/landing.tsx → app/page.tsx (needs conversion)
```

### Other Pages  
```bash
client/src/pages/test.tsx → app/test/page.tsx
client/src/pages/about.tsx → app/about/page.tsx
client/src/pages/what-is-ikigai.tsx → app/what-is-ikigai/page.tsx
# ... continue for all 70+ pages
```

## Phase 4: API Routes (Convert Structure)

### API Conversion
```bash
server/routes.ts → Split into multiple app/api/*/route.ts files
```

## Key Changes Needed

### 1. Import Path Updates
```typescript
// Change all imports from:
import { Component } from "@/components/Component"
// To:
import { Component } from "@/components/Component" // (stays same in Next.js)
```

### 2. Routing Changes  
```typescript
// Change from Wouter:
import { Link } from "wouter"
// To Next.js:
import Link from "next/link"
```

### 3. Translation Changes
```typescript
// Change from i18next:
import { useTranslation } from 'react-i18next'
// To next-intl:
import { useTranslations } from 'next-intl'
```

## Files Ready for Copy

The migration-files/ directory contains:
- ✅ Updated package.json for Next.js
- ✅ Proper tsconfig.json
- ✅ Next.js configuration
- ✅ Converted page examples
- ✅ Updated component examples

## Test Order

1. Copy foundation files
2. Start Next.js development server
3. Copy components
4. Copy one page at a time
5. Test each page works
6. Add API routes
7. Test full functionality

## Environment Variables

Copy these from your current .env:
```
DATABASE_URL=your_database_url
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
SESSION_SECRET=your_session_secret
```

Add Next.js specific:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

Once you create the Next.js project, I'll help you copy and convert each file systematically!