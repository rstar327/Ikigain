#!/usr/bin/env node

// Simple development server without Vite plugins
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files
app.use(express.static('dist/public'));
app.use(express.static('public'));

// Basic API routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Ikigai Compass Development Server',
    timestamp: new Date().toISOString()
  });
});

// Test routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Development API is working', data: 'Hello World' });
});

// Catch all route for SPA
app.get('*', (req, res) => {
  // For development, just return a simple JSON response
  res.json({ 
    message: 'Ikigai Compass Development Server',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Development server running on http://localhost:${PORT}`);
  console.log(`📡 API health check: http://localhost:${PORT}/api/health`);
});