#!/usr/bin/env node
import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildServer() {
  try {
    console.log('🔨 Building server with ESM format...');
    
    await build({
      entryPoints: [join(__dirname, 'server/index.ts')],
      bundle: true,
      platform: 'node',
      target: 'node18',
      format: 'esm',
      outfile: join(__dirname, 'dist/index.js'),
      external: [
        'pg-native',
        'lightningcss',
        'esbuild',
        '@esbuild/linux-x64',
        '@esbuild/win32-x64',
        '@esbuild/darwin-x64',
        '@esbuild/darwin-arm64'
      ],
      banner: {
        js: `
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
        `.trim()
      },
      define: {
        'import.meta.dirname': '__dirname',
        'process.env.NODE_ENV': process.env.NODE_ENV ? `"${process.env.NODE_ENV}"` : '"production"'
      },
      minify: process.env.NODE_ENV === 'production',
      sourcemap: process.env.NODE_ENV !== 'production',
      logLevel: 'info'
    });
    
    console.log('✅ Server build completed successfully');
  } catch (error) {
    console.error('❌ Server build failed:', error);
    process.exit(1);
  }
}

buildServer();