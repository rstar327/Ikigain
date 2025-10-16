#!/usr/bin/env node

import { build } from 'esbuild';
import { execSync } from 'child_process';

async function buildForDeployment() {
  console.log('🚀 Building for deployment...');
  
  // Build client first
  console.log('📦 Building client...');
  try {
    execSync('npm run build:client', { stdio: 'inherit' });
    console.log('✅ Client built successfully');
  } catch (error) {
    console.error('❌ Client build failed:', error.message);
    process.exit(1);
  }

  // Build server with proper ESM configuration
  console.log('🔧 Building server...');
  try {
    await build({
      entryPoints: ['server/index.ts'],
      bundle: true,
      platform: 'node',
      format: 'esm',
      outfile: 'dist/index.js',
      external: [
        'pg-native',
        'lightningcss',
        '@replit/vite-plugin-runtime-error-modal',
        '@replit/vite-plugin-cartographer',
        'esbuild-linux-64',
        'esbuild-linux-arm64', 
        'esbuild-darwin-64',
        'esbuild-darwin-arm64',
        'esbuild-win32-64',
        'esbuild-win32-arm64',
        'esbuild-freebsd-64',
        'esbuild-freebsd-arm64',
        'bufferutil',
        'utf-8-validate',
        'vite',
        'vite/*'
      ],
      target: 'node18',
      mainFields: ['module', 'main'],
      conditions: ['import', 'module'],
      loader: {
        '.ts': 'ts',
      },
      define: {
        'import.meta.url': 'import.meta.url',
      },

    });
    console.log('✅ Server built successfully in ESM format');
  } catch (error) {
    console.error('❌ Server build failed:', error);
    process.exit(1);
  }

  console.log('🎉 Deployment build completed successfully!');
}

buildForDeployment();