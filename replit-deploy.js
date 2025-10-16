#!/usr/bin/env node

import { build } from 'esbuild';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function replitDeploy() {
  console.log('🚀 Replit Deployment Build Starting...');
  
  try {
    // Build client
    console.log('📦 Building client for deployment...');
    execSync('npm run build:client', { stdio: 'inherit' });
    console.log('✅ Client build completed');

    // Build server with Replit-specific optimizations
    console.log('🔧 Building server for Replit deployment...');
    await build({
      entryPoints: [resolve(__dirname, 'server/index.ts')],
      bundle: true,
      platform: 'node',
      format: 'esm',
      outfile: resolve(__dirname, 'dist/index.js'),
      
      // Comprehensive externals to prevent bundling issues
      external: [
        // All Node.js built-ins - critical for Replit deployment
        'path', 'fs', 'crypto', 'stream', 'util', 'events', 'buffer', 
        'querystring', 'url', 'string_decoder', 'os', 'child_process',
        'net', 'tls', 'http', 'https', 'zlib', 'dns', 'readline',
        
        // Express framework - must be external to prevent bundling conflicts
        'express', 'body-parser', 'cookie-parser', 'express-session',
        'connect-pg-simple', 'memorystore',
        
        // Database dependencies
        'pg', 'pg-native', 'better-sqlite3', '@neondatabase/serverless',
        
        // Authentication and security
        'openid-client', 'passport', 'crypto',
        
        // File handling
        'multer', 'marked', 'dompurify',
        
        // Lightning CSS platform dependencies
        'lightningcss', 'lightningcss/node',
        'lightningcss-linux-x64-gnu', 'lightningcss-linux-x64-musl',
        'lightningcss-linux-arm64-gnu', 'lightningcss-linux-arm64-musl',
        'lightningcss-darwin-x64', 'lightningcss-darwin-arm64',
        'lightningcss-win32-x64-msvc',
        
        // Build tools that should not be bundled
        'vite', 'vite/*', 'esbuild', 'tsx',
        '@replit/vite-plugin-runtime-error-modal',
        '@replit/vite-plugin-cartographer',
        
        // ESBuild platform binaries
        'esbuild-linux-64', 'esbuild-linux-arm64',
        'esbuild-darwin-64', 'esbuild-darwin-arm64',
        'esbuild-win32-64', 'esbuild-win32-arm64',
        'esbuild-freebsd-64', 'esbuild-freebsd-arm64',
        
        // WebSocket utilities
        'bufferutil', 'utf-8-validate', 'ws',
        
        // TypeScript and Babel
        '@babel/preset-typescript', '@babel/preset-typescript/package.json'
      ],
      
      target: 'node18',
      mainFields: ['module', 'main'],
      conditions: ['import', 'module'],
      
      loader: {
        '.ts': 'ts',
        '.tsx': 'tsx'
      },
      
      define: {
        'import.meta.url': 'import.meta.url',
        'process.env.NODE_ENV': '"production"'
      },
      
      // Critical ESM compatibility banner
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
      
      resolveExtensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      packages: 'external',
      sourcemap: false, // Disable for deployment
      minify: false,    // Disable minification to prevent issues
      treeShaking: true
    });
    
    console.log('✅ Server build completed for Replit deployment');
    console.log('🎉 Replit deployment build finished successfully!');
    console.log('');
    console.log('📋 Deployment Summary:');
    console.log('  • Client assets: dist/public/');
    console.log('  • Server bundle: dist/index.js (ESM format)');
    console.log('  • All Node.js modules externalized');
    console.log('  • Express dependencies kept external');
    console.log('  • ESM compatibility ensured');
    
  } catch (error) {
    console.error('❌ Replit deployment build failed:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
}

replitDeploy();