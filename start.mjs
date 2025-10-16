#!/usr/bin/env node

// Simple production startup script - no bundling, just run server directly
import { cpSync, existsSync } from 'fs';
import { execSync } from 'child_process';

console.log('🚀 Starting Ikigai Compass in production mode...');

// Set production environment
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || '3000';

// Copy client build files to server/public if they exist
if (existsSync('./dist/public')) {
  console.log('📁 Copying client files to server/public...');
  cpSync('./dist/public', './server/public', { recursive: true });
  console.log('✅ Client files copied successfully');
}

// Start server with tsx (no bundling)
console.log('🔧 Starting server directly with tsx...');
try {
  execSync('tsx server/index.ts', { stdio: 'inherit' });
} catch (error) {
  console.log('⚠️ tsx not found, trying with node --loader...');
  execSync('node --loader tsx/esm server/index.ts', { stdio: 'inherit' });
}