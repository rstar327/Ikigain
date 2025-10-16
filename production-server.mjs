#!/usr/bin/env node
// Production server wrapper with proper path resolution
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set production environment variables
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || '3000';

// Create symlink for package.json if needed (some bundled dependencies expect it)
const rootPackagePath = join(__dirname, 'package.json');
const distPackagePath = join(__dirname, 'dist', 'root-package.json');

if (!fs.existsSync(rootPackagePath) && fs.existsSync(distPackagePath)) {
  try {
    await fs.promises.copyFile(distPackagePath, rootPackagePath);
    console.log('📦 Copied package.json for dependency compatibility');
  } catch (error) {
    console.warn('⚠️ Could not copy package.json:', error.message);
  }
}

// Check if built files exist
const serverFile = join(__dirname, 'dist', 'index.js');
const publicDir = join(__dirname, 'dist', 'public');

if (!fs.existsSync(serverFile)) {
  console.error('❌ Server build not found. Run: node build-deploy.mjs');
  process.exit(1);
}

if (!fs.existsSync(publicDir)) {
  console.error('❌ Client build not found. Run: node build-deploy.mjs');
  process.exit(1);
}

console.log('🚀 Starting Ikigai Compass production server...');
console.log(`📍 Port: ${process.env.PORT}`);
console.log(`📁 Serving static files from: ${publicDir}`);

// Import and start the server
try {
  const serverModule = await import('./dist/index.js');
  console.log('✅ Server started successfully');
} catch (error) {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
}