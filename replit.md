# Ikigai Compass - Multilingual Personality & Career Platform

## Overview
Ikigai Compass is a sophisticated TypeScript web application designed to help users discover their Ikigai through an advanced, interactive multilingual personality and career exploration platform. The project aims to provide an engaging and insightful experience, leveraging AI for recommendations and offering comprehensive tools for self-discovery. It is deployed and running in production with enhanced video content integration for increased credibility and user engagement.

## Recent Changes (August 13, 2025)
- Fixed authentication redirect loops in dashboard
- Corrected test results URL routing to use `/test-results/{sessionId}` format
- Fixed API endpoint to properly fetch and display test scores with actual data
- Added Home and Logout navigation buttons to dashboard
- Verified all user scenarios including anonymous testing, registration, and premium purchases
- Confirmed premium tier features are properly displaying based on purchase level
- **COMPLETED: Digital Product Download System** - Full end-to-end PDF download system with secure tokens, download limits, and payment processing
- **UPDATED: Digital Product Pricing** - Restored PDF price to $9.99 with 33% discount from $14.99
- **FINAL: Real Product Integration** - Replaced test PDF with authentic 3.5MB Ikigai Cards E version containing all 35 cards and complete content
- **VERIFIED: Complete Purchase Flow** - Tested and confirmed working: shop → checkout → payment → success → download with real PDF file
- **FIXED: Video Integration on Shop Page** - Successfully implemented .mov video serving with proper Express static middleware, removed poster images to show actual video content, confirmed videos display and play correctly
- **RESOLVED: Production Authentication System** - Successfully fixed authentication issues by resolving session middleware conflicts, correcting bcrypt password hash format, and ensuring proper session initialization. Users can now login successfully at ikigain.org with credentials (kav@wemarket.dk/testtest) and access dashboard with full test history and results displayed correctly.

## User Preferences
*Document user preferences and communication style here*

## System Architecture

### UI/UX Decisions
The platform utilizes React with interactive data visualization, Tailwind CSS for responsive design, and Framer Motion for engaging interactions. It supports internationalization with i18next for Spanish, English, and French, ensuring a broad reach. The design prioritizes a visually appealing and intuitive user experience.

### Technical Implementations
The project is built with a TypeScript full-stack, employing React for the frontend and Express for the backend. Data persistence is managed with PostgreSQL via Drizzle ORM. Key features include an AI-powered recommendation engine, comprehensive static site generation, and enhanced SEO optimization.

### Feature Specifications
- **Multilingual Support:** Implemented via i18next (Spanish, English, French).
- **Personality & Career Exploration:** Core functionality driven by interactive assessments and AI recommendations.
- **Data Visualization:** Interactive charts and graphs to present user insights.
- **User Authentication:** Hybrid email/password authentication system supporting natural test-first user flow. Users can take tests anonymously, provide email for results, and optionally create accounts later to access saved results across devices. System automatically links previous test sessions and purchases to new accounts via email matching. Admin access restricted to karlisvilmanis@gmail.com only.
- **Premium Tiers:** Three-tier premium system - Roadmap ($2.95) with career guidance, Personality ($4.95) with deep insights, and Blueprint ($9.95) with complete life planning. Each tier unlocks progressively more features including additional career matches, personality analysis, and development roadmaps.
- **Digital Product Sales:** Complete e-commerce system for digital products with Stripe payment processing, secure download tokens, and automated delivery. Features shop page with Physical Cards and Digital Edition tabs, $9.99 pricing for Ikigai Cards Digital Edition (3.5MB authentic PDF with 35 cards and preview images).
- **SEO Optimization:** Dynamic and static SEO solutions including universal link preview, canonical URL management, and route-specific meta tags for social media and search engines.
- **Video Integration:** Professional video content serving with .mov/.mp4 format support using attached_assets static middleware, video controls with streaming support, and optimized Express server configuration with proper MIME types (video/quicktime) and range request support for smooth video playback.

### System Design Choices
- **Frontend (React + Vite):** Located in `client/src/`, responsible for the multilingual UI, interactive charts, and responsive design.
- **Backend (Express + TypeScript):** Located in `server/`, providing RESTful API services, authentication, and database operations.
- **Database (PostgreSQL + Drizzle):** Manages user data, test sessions, and blog content with schema defined in `shared/schema.ts`.
- **Build System:** Utilizes `tsx` and Vite for development, with an optimized ESM-based build for production deployments, ensuring efficient and robust performance.
- **Modular Design:** Clear separation of concerns between frontend, backend, and shared schema.
- **Universal SEO Middleware:** A key architectural decision to serve optimized HTML to various crawlers (social media, search engines, general preview systems) while providing the full React app to regular users.

## External Dependencies

- **TypeScript:** Primary programming language for full-stack development.
- **React:** Frontend library for building user interfaces.
- **Vite:** Frontend build tool.
- **Tailwind CSS:** Utility-first CSS framework for styling.
- **Framer Motion:** Animation library for React.
- **i18next:** Internationalization framework for multilingual support.
- **Drizzle ORM:** TypeScript ORM for PostgreSQL database interactions.
- **PostgreSQL:** Relational database for data storage.
- **Express.js:** Backend web application framework.
- **Stripe:** Payment processing for premium tier assignments.
- **Google Analytics GA4:** For website analytics and tracking.
- **Replit Authentication:** Integrated for user authentication.
- **Externalized Node.js Built-ins & Dependencies:** `lightningcss`, `esbuild`, `vite` (dev tools), `pg-native`, `bufferutil`, `utf-8-validate` are externalized to optimize production builds.
- **Video Processing:** FFmpeg integration for video format conversion (.mov to .mp4), thumbnail extraction, and file size optimization (41MB to 6.7MB compression achieved).