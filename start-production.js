#!/usr/bin/env node

// Production starter script for Replit deployment
// Sets proper environment variables and starts the built server

console.log('🚀 Starting production server...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT || '3000');

process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || '3000';

// Start the built server
import('./dist/index.js').catch(error => {
  console.error('❌ Failed to start production server:', error);
  process.exit(1);
});