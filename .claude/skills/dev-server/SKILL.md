---
name: dev-server
description: Start frontend and backend dev servers concurrently
allowed-tools: Bash
---

# Start Dev Servers

Starts both the Vite frontend dev server and the Express backend dev server concurrently.

## Usage

```
/dev-server
```

## What It Does

1. Checks that dependencies are installed in both directories
2. Starts the backend server (`npx tsx watch src/index.ts`) on port 4000
3. Starts the frontend server (`npm run dev`) on port 5173
4. Reports the URLs when both are ready

## Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend (Vite) | 5173 | http://localhost:5173 |
| Backend (Express) | 4000 | http://localhost:4000 |

## Script

Run the start script:

```bash
bash .claude/skills/dev-server/scripts/start-dev.sh
```
