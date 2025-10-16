#!/usr/bin/env node

// Development server that bypasses the broken build configuration
// Based on working backup: NODE_ENV=development tsx server/index.ts

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔄 Starting Ikigai Compass Development Environment');
console.log('📁 Project directory:', __dirname);

// Set environment variables
process.env.NODE_ENV = 'development';

// Start the development server using tsx (like the working backup)
const serverProcess = spawn('npx', ['tsx', '--esm', 'server/index.ts'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development'
  }
});

serverProcess.on('error', (error) => {
  console.error('❌ Failed to start development server:', error.message);
  process.exit(1);
});

serverProcess.on('close', (code) => {
  console.log(`🔄 Development server exited with code ${code}`);
  if (code !== 0) {
    console.log('🔄 Attempting restart...');
    // Restart on failure
    setTimeout(() => {
      spawn('node', [__filename], { stdio: 'inherit' });
    }, 2000);
  }
});

// Handle shutdown gracefully
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development server...');
  serverProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down development server...');
  serverProcess.kill('SIGTERM');
  process.exit(0);
});