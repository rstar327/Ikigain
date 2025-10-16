#!/bin/bash

echo "🚀 Starting Ikigai Compass Development Environment"

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "vite|node.*server|tsx|concurrently" 2>/dev/null || true
sleep 2

# Start development server (simple Express server)
echo "🖥️  Starting development server on port 5000..."
cat > temp-server.js << 'EOF'
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
EOF

node temp-server.js > server.log 2>&1 &
SERVER_PID=$!
echo "Server PID: $SERVER_PID"

# Start client with Vite
echo "🌐 Starting client on port 3000..."
cd client
npx vite --port 3000 --host 0.0.0.0 > ../client.log 2>&1 &
CLIENT_PID=$!
cd ..
echo "Client PID: $CLIENT_PID"

# Wait for services to start
sleep 5

# Test services
echo "🔍 Testing services..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Client (port 3000) is running"
else
    echo "❌ Client (port 3000) failed to start"
fi

if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✅ Server (port 5000) is running"
else
    echo "❌ Server (port 5000) failed to start"
fi

echo ""
echo "🎉 Development environment is ready!"
echo "📱 Client: http://localhost:3000"
echo "🖥️  Server: http://localhost:5000"
echo ""
echo "To stop: pkill -f \"vite|node.*temp-server\""