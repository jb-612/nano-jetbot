#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
FRONTEND_DIR="$PROJECT_ROOT/ai-maturity-dashboard-source"
BACKEND_DIR="$PROJECT_ROOT/server"

echo "=== Nano JetBot Dev Servers ==="

# Check dependencies
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
  echo "Installing frontend dependencies..."
  (cd "$FRONTEND_DIR" && npm install)
fi

if [ ! -d "$BACKEND_DIR/node_modules" ]; then
  echo "Installing backend dependencies..."
  (cd "$BACKEND_DIR" && npm install)
fi

# Start backend in background
echo "Starting backend on port 4000..."
(cd "$BACKEND_DIR" && npx tsx watch src/index.ts) &
BACKEND_PID=$!

# Start frontend in background
echo "Starting frontend on port 5173..."
(cd "$FRONTEND_DIR" && npm run dev) &
FRONTEND_PID=$!

echo ""
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:4000"
echo ""
echo "Press Ctrl+C to stop both servers."

# Trap to kill both on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

wait
