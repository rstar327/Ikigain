import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.static('dist/public'));
app.use(express.static('public'));

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Development server running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/*', (req, res) => {
  res.json({ 
    message: 'API endpoint', 
    path: req.path,
    development: true
  });
});

app.get('*', (req, res) => {
  res.json({ 
    message: 'Ikigai Compass Development Server',
    path: req.path
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Development server running on http://localhost:${PORT}`);
});
