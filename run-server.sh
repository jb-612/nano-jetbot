#!/bin/bash

# Simple server script for running the built application
# This script starts a local HTTP server to run the dashboard

PORT=${1:-3000}
DIR="dist"

if [ ! -d "$DIR" ]; then
    echo "Error: $DIR directory not found!"
    echo "Please run 'npm run build' first to create the build."
    exit 1
fi

echo "Starting server on http://localhost:$PORT"
echo "Press Ctrl+C to stop the server"
echo ""

# Try different server commands based on what's available
if command -v python3 &> /dev/null; then
    cd "$DIR" && python3 -m http.server "$PORT"
elif command -v python &> /dev/null; then
    cd "$DIR" && python -m SimpleHTTPServer "$PORT"
elif command -v npx &> /dev/null; then
    cd "$DIR" && npx serve -p "$PORT"
else
    echo "Error: No suitable server found!"
    echo "Please install Python 3 or Node.js to run this server."
    exit 1
fi

