#!/bin/bash

echo "🚀 Starting Ikigai Compass Development Environment"
echo "=================================================="

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "vite\|index.mjs\|tsx" 2>/dev/null || true

# Start simple development server
echo "🖥️  Starting development server on port 5000..."
node simple-server.js > server.log 2>&1 &
SERVER_PID=$!

# Start client in background
echo "🌐 Starting client on port 3000..."
cd client && npx vite --port 3000 --host 0.0.0.0 > ../client.log 2>&1 &
CLIENT_PID=$!
cd ..

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 3

# Check if services are running
if curl -s http://localhost:5000 > /dev/null; then
    echo "✅ Server running on http://localhost:5000"
else
    echo "⚠️  Server may not be responding yet"
fi

if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Client running on http://localhost:3000"
else
    echo "⚠️  Client may not be responding yet"
fi

echo ""
echo "🎉 Development environment started!"
echo "   📖 Client: http://localhost:3000"
echo "   🔧 Server: http://localhost:5000"
echo "   📄 Logs: server.log, client.log"
echo ""
echo "Press Ctrl+C to stop both services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $SERVER_PID $CLIENT_PID 2>/dev/null
    exit 0
}

trap cleanup INT

# Keep script running
wait