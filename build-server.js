#!/usr/bin/env node

import { build } from 'esbuild';

build({
  entryPoints: ['server/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: 'dist/index.js',
  external: [
    // Core Node.js modules that should not be bundled
    'path',
    'fs',
    'crypto',
    'stream',
    'util',
    'events',
    'buffer',
    'querystring',
    'url',
    'string_decoder',
    'os',
    'child_process',
    'net',
    'tls',
    'http',
    'https',
    'zlib',
    
    // Database and native dependencies
    'pg-native',
    'better-sqlite3',
    
    // Express and related dependencies that cause bundling issues
    'express',
    'body-parser',
    'cookie-parser',
    'express-session',
    'connect-pg-simple',
    'memorystore',
    
    // Lightning CSS and build tools
    'lightningcss',
    'lightningcss/node',
    'lightningcss-linux-x64-gnu',
    'lightningcss-linux-x64-musl',
    'lightningcss-linux-arm64-gnu',
    'lightningcss-linux-arm64-musl',
    'lightningcss-darwin-x64',
    'lightningcss-darwin-arm64',
    'lightningcss-win32-x64-msvc',
    
    // Vite and Replit plugins
    'vite',
    'vite/*',
    '@replit/vite-plugin-runtime-error-modal',
    '@replit/vite-plugin-cartographer',
    
    // ESBuild platform-specific binaries
    'esbuild-linux-64',
    'esbuild-linux-arm64',
    'esbuild-darwin-64',
    'esbuild-darwin-arm64',
    'esbuild-win32-64',
    'esbuild-win32-arm64',
    'esbuild-freebsd-64',
    'esbuild-freebsd-arm64',
    
    // WebSocket and buffer utilities
    'bufferutil',
    'utf-8-validate',
    
    // Authentication
    'openid-client',
    'openid-client/passport',
    'passport',
    
    // TypeScript and Babel
    '@babel/preset-typescript/package.json',
    
    // Other problematic dependencies
    'multer',
    'marked',
    'dompurify'
  ],
  target: 'node18',
  mainFields: ['module', 'main'],
  conditions: ['import', 'module'],
  loader: {
    '.ts': 'ts',
  },
  define: {
    'import.meta.url': 'import.meta.url',
    'process.env.NODE_ENV': '"production"'
  },
  // Handle Node.js built-ins properly for ESM
  banner: {
    js: `
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
`
  },
  // Ensure proper module resolution
  resolveExtensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  // Keep external modules as external
  packages: 'external'
}).then(() => {
  console.log('✅ Server built successfully in ESM format');
}).catch((error) => {
  console.error('❌ Server build failed:', error);
  process.exit(1);
});