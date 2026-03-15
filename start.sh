#!/bin/bash
# =====================================================
# Streamify - Start Script
# Starts both backend (port 5000) and frontend (port 3000)
# =====================================================

echo "🎬 Starting Streamify OTT Platform..."
echo ""

# Check Node.js
if ! command -v node &>/dev/null; then
  echo "❌ Node.js not found. Install from: https://nodejs.org"
  exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install backend deps
echo ""
echo "📦 Installing backend dependencies..."
cd backend && npm install
cd ..

# Install frontend deps
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend && npm install
cd ..

echo ""
echo "🚀 Launching servers..."
echo ""

# Start backend in background
cd backend && npm run dev &
BACKEND_PID=$!
echo "✅ Backend starting on http://localhost:5000 (PID: $BACKEND_PID)"

# Wait a moment then start frontend
sleep 2
cd ../frontend && npm start &
FRONTEND_PID=$!
echo "✅ Frontend starting on http://localhost:3000 (PID: $FRONTEND_PID)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎬 STREAMIFY is running!"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "   Press Ctrl+C to stop both servers"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Wait for both
wait $BACKEND_PID $FRONTEND_PID
