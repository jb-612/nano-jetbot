@echo off
REM Simple server script for Windows
REM This script starts a local HTTP server to run the dashboard

set PORT=%1
if "%PORT%"=="" set PORT=3000

if not exist "dist" (
    echo Error: dist directory not found!
    echo Please run 'npm run build' first to create the build.
    pause
    exit /b 1
)

echo Starting server on http://localhost:%PORT%
echo Press Ctrl+C to stop the server
echo.

cd dist

REM Try Python first, then npx serve
python -m http.server %PORT% 2>nul
if errorlevel 1 (
    npx serve -p %PORT%
)

cd ..

