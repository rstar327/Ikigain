const express = require('express');
const path = require('path');

const app = express();
const PORT = 5000;

// Basic middleware
app.use(express.json());
app.use(express.static('dist/public'));

// Basic API endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Development server running' });
});

// Catch all route
app.get('*', (req, res) => {
  res.json({ 
    message: 'Ikigai Compass API Server',
    time: new Date().toISOString(),
    path: req.path 
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Development server running on http://localhost:${PORT}`);
});
