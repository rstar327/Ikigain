#!/bin/bash

echo "🔄 Restoring Ikigai Compass Development Environment to Normal Operation"

# Kill any existing processes
pkill -f "vite|node.*server|tsx|concurrently" 2>/dev/null || true
sleep 2

# Set up the environment exactly like the working backup
export NODE_ENV=development

echo "🚀 Starting development server using working backup configuration..."

# Use tsx directly like the working backup (NODE_ENV=development tsx server/index.ts)
NODE_ENV=development npx tsx server/index.ts

echo "✅ Development server restored to normal operation"
echo "📱 Your application should now be running normally"