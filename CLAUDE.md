# Nano JetBot - Robot Digital Twin

NVIDIA Jetson Nano JetBot web dashboard with interactive 3D viewer, real-time telemetry via WebSocket, and robot control panel. All 3D geometry is procedural (no external model files).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript 5.9 + Vite 7 |
| 3D | React Three Fiber 9 + Drei 10 + Three.js (procedural geometry) |
| State | Zustand 5 |
| Styling | Tailwind CSS 4 |
| Backend | Express 5 + TypeScript + ws (WebSocket) |
| Animation | maath (damp3 easing) |

## Quick Start

```bash
# Frontend dev server (port 5173, proxies /api and /ws to backend)
cd ai-maturity-dashboard-source && npm install && npm run dev

# Backend dev server (port 4000)
cd server && npm install && npx tsx watch src/index.ts

# Type check
cd ai-maturity-dashboard-source && npx tsc --noEmit

# Lint
cd ai-maturity-dashboard-source && npm run lint

# Build frontend
cd ai-maturity-dashboard-source && npm run build
```

## Project Structure

```
nano-jetbot/
  ai-maturity-dashboard-source/   # Frontend SPA
    src/
      components/                  # React components (Robot3D/, RobotUI/, Robot/)
      hooks/                       # useRobotStatus, useGamepad, useRobotTelemetry, etc.
      pages/                       # RobotViewer, RobotConnectivity, RobotControl, RobotApi
      services/                    # api.ts (REST client), websocket.ts (WS client)
      stores/                      # Zustand stores (robotStore.ts)
      models/                      # Domain models (robot-part, material, dependency-graph)
      data/                        # Mock data (parts, materials, dependency edges)
      types/                       # Shared TypeScript types
  server/                          # Express API server
    src/
      controllers/                 # HTTP request handlers
      services/                    # Business logic (robot, telemetry, camera)
      repositories/                # In-memory data stores (mock data, no DB)
      routes/                      # Express route definitions
      middleware/                   # Auth (X-API-Key), error handling, logging
      websocket/                   # Telemetry gateway (5Hz real-time stream)
      events/                      # Typed EventBus for service decoupling
      types/                       # Backend TypeScript interfaces
  dist/                            # Pre-built static files
```

## Architecture

- **Frontend** proxies `/api/*` and `/ws` to backend via Vite dev server (see `vite.config.ts`)
- **Backend** serves mock data from in-memory repositories -- no database
- **Auth** via `X-API-Key` header (default: `dev-key-12345`)
- **Real-time** telemetry delivered over WebSocket at `/ws` (5Hz frames)
- **3D viewer** uses procedural Three.js geometry -- no .glb/.gltf files
- **Backend layering**: controller -> service -> repository (with EventBus for decoupling)

## API Endpoints (port 4000)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/status | Robot connection status |
| GET | /api/telemetry | Latest telemetry frame |
| POST | /api/move | Movement command |
| POST | /api/camera | Camera control |
| POST | /api/servo | Servo control |
| GET | /api/parts | List all robot parts |
| PUT | /api/parts/:id | Update a part |
| WS | /ws | Real-time telemetry stream |

All REST responses use `ApiResponse<T>` envelope.

## Key Conventions

- **TypeScript strict mode** -- no `any` types
- **Functional React components** with hooks only
- **3D via R3F declarative JSX** -- never imperative Three.js in components
- **One component per file**, PascalCase naming
- **Hooks** return `{ data, loading, error }` pattern
- **Centralized API client** in `services/api.ts` with typed responses
- **Zustand** for assembly state (attach/detach parts) -- avoids re-rendering Canvas tree
- **maath/easing.damp3** for all part animations (no spring physics)

## 3D Viewer Notes

- All 11 JetBot parts are individual React components under `components/Robot3D/parts/`
- Click to select, double-click to detach/reattach, hover for emissive glow
- Post-processing outline effect on selected parts
- Theme bridging via MutationObserver on Tailwind dark class
- Scene: PerspectiveCamera FOV 45, OrbitControls with damping, studio Environment preset

## Robot Parts (11 components)

Chassis, Left/Right Drive Wheels, Left/Right WiFi Antennas, Jetson Nano Board, CSI Camera, Battery Pack, Motor Driver (PCA9685), Front Caster Ball, Wiring Harness. Each has materials data with real electrical/thermal conductivity values.

## Non-Negotiable Rules

1. TypeScript strict mode everywhere -- no `any`
2. All React components must be functional with hooks
3. 3D components use React Three Fiber JSX, not imperative Three.js
4. Backend follows controller -> service -> repository layering
5. All API responses use typed interfaces from `types/`
6. Procedural geometry only -- no external 3D model files
