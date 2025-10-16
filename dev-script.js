#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Ikigai Compass Development Environment');

// Build server first using our ESM configuration
console.log('🔨 Building server...');
const buildProcess = spawn('node', ['build-server.js'], { stdio: 'inherit' });

buildProcess.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ Server build failed');
    process.exit(1);
  }
  
  console.log('✅ Server built successfully');
  
  // Start server
  console.log('🖥️  Starting server...');
  const server = spawn('node', ['dist/index.js'], { 
    stdio: ['inherit', 'inherit', 'inherit'],
    env: { ...process.env, NODE_ENV: 'development' }
  });
  
  // Start client
  console.log('🌐 Starting client...');
  const client = spawn('npx', ['vite'], { 
    cwd: path.join(process.cwd(), 'client'),
    stdio: ['inherit', 'inherit', 'inherit']
  });
  
  // Handle cleanup
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down development environment...');
    server.kill();
    client.kill();
    process.exit(0);
  });
  
  server.on('close', (code) => {
    if (code !== 0) {
      console.log('Server exited with code', code);
    }
    client.kill();
  });
  
  client.on('close', (code) => {
    if (code !== 0) {
      console.log('Client exited with code', code);
    }
    server.kill();
  });
});