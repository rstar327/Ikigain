#!/usr/bin/env node

import { build } from 'esbuild';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildForDeployment() {
  console.log('🚀 Starting deployment build process...');
  
  try {
    // Build client first
    console.log('📦 Building client application...');
    execSync('npm run build:client', { stdio: 'inherit' });
    console.log('✅ Client build completed successfully');

    // Build server with comprehensive ESM configuration
    console.log('🔧 Building server with ESM format...');
    await build({
      entryPoints: [resolve(__dirname, 'server/index.ts')],
      bundle: true,
      platform: 'node',
      format: 'esm',
      outfile: resolve(__dirname, 'dist/index.js'),
      external: [
        // Database and native dependencies
        'pg-native',
        'better-sqlite3',
        
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
        'openid-client/passport',
        
        // TypeScript and Babel
        '@babel/preset-typescript/package.json'
      ],
      target: 'node18',
      mainFields: ['module', 'main'],
      conditions: ['import', 'module'],
      loader: {
        '.ts': 'ts',
        '.tsx': 'tsx',
        '.js': 'js',
        '.jsx': 'jsx'
      },
      define: {
        'import.meta.url': 'import.meta.url',
        'process.env.NODE_ENV': '"production"'
      },
      // Enable top-level await and proper module resolution
      format: 'esm',
      resolveExtensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      sourcemap: true,
      minify: true,
      treeShaking: true,
      // Handle Node.js built-ins properly
      banner: {
        js: `
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
`
      }
    });
    
    console.log('✅ Server build completed successfully in ESM format');
    console.log('🎉 Deployment build process finished!');
    
  } catch (error) {
    console.error('❌ Deployment build failed:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the build
buildForDeployment();