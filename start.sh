#!/bin/bash

echo "🚀 Starting Lie-Ability Game..."

# Check if port 3000 is already in use and kill existing processes
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "🔄 Port 3000 is in use. Stopping existing server..."
    kill $(lsof -ti:3000) 2>/dev/null || true
    sleep 2
fi

# Build the Svelte frontend first
echo "📦 Building Svelte frontend..."
cd svelte && npm run build && cd ..

# Start the server in the background
echo "🎮 Starting game server..."
cd /Users/robfalk/lie-ability-game && node src/server.js &
SERVER_PID=$!

# Wait a moment for the server to start
sleep 3

# Get the server URL (defaulting to localhost if we can't detect the IP)
SERVER_URL="http://localhost:3000"

echo "🌐 Server running at: $SERVER_URL"
echo "🖥️  Host interface: $SERVER_URL/host"
echo "📱 Player interface: $SERVER_URL/player"

# Try to open the host interface in the default browser
if command -v open &> /dev/null; then
    # macOS
    echo "🌐 Opening host interface in browser..."
    open "$SERVER_URL/host"
elif command -v xdg-open &> /dev/null; then
    # Linux
    echo "🌐 Opening host interface in browser..."
    xdg-open "$SERVER_URL/host"
elif command -v start &> /dev/null; then
    # Windows
    echo "🌐 Opening host interface in browser..."
    start "$SERVER_URL/host"
else
    echo "📋 Please open your browser and go to: $SERVER_URL/host"
fi

echo ""
echo "✅ Game is ready\! Press Ctrl+C to stop the server."

# Function to cleanup on exit
cleanup() {
    echo "🛑 Shutting down server..."
    kill $SERVER_PID 2>/dev/null || true
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for the server process
wait $SERVER_PID