# Robot Digital Twin - Sidecar Project Plan

## Project Overview

A new sidecar module for the DOX AI Dashboard that creates an interactive CGI representation of an **NVIDIA Jetson Nano JetBot** robot. The solution is a **Single Page Application (SPA)** with all layers (frontend + backend) running in a **single Docker container**, with fully decoupled classes and services.

### Core Capabilities

1. **3D Interactive Viewer** - Rotate, zoom, pan the robot model with OrbitControls
2. **Part Interaction** - Click any part to inspect; detach/reattach wheels, antennas, camera, battery, etc.
3. **Part Detail Panel** - Materials, conductivity, resistance, function, criticality for every component
4. **Connectivity Mock Screen** - WiFi, battery, latency, IP config, connection logs
5. **Remote Control Panel** - Virtual joystick, camera feed, telemetry gauges, emergency stop
6. **API Documentation** - Interactive Swagger-like docs with try-it-out panels and WebSocket tester

---

## Robot Components (NVIDIA Jetson Nano JetBot)

| # | Part | Category | Criticality | Removable |
|---|------|----------|-------------|-----------|
| 1 | Chassis / Cart | Structural | Critical | No |
| 2 | Left Drive Wheel | Locomotion | High | Yes |
| 3 | Right Drive Wheel | Locomotion | High | Yes |
| 4 | Left WiFi Antenna | Communication | Medium | Yes |
| 5 | Right WiFi Antenna | Communication | Low | Yes |
| 6 | NVIDIA Jetson Nano Board | Compute | Critical | Yes |
| 7 | CSI Camera Module | Sensor | Critical | Yes |
| 8 | Li-Ion Battery Pack | Power | Critical | Yes |
| 9 | Motor Driver Board (PCA9685) | Electrical | Critical | Yes |
| 10 | Front Caster Ball | Structural | High | Yes |
| 11 | Wiring Harness | Wiring | Critical | Yes |

---

## Technology Stack

### Frontend (Existing + New)
- **React 19** + TypeScript 5.9 + Vite 7
- **Tailwind CSS 4** (dark/light mode via `class` strategy)
- **React Router DOM 7** (flat routes inside MainLayout)
- **Lucide React** (icons)
- **Three.js** via `@react-three/fiber` + `@react-three/drei` (3D rendering)
- **@react-three/postprocessing** (selection outlines)
- **Zustand 5** (state management)
- **maath** (animation easing)

### Backend (New)
- **Express.js 5** (REST API server)
- **ws** (WebSocket for real-time telemetry)
- **TypeScript** with ESM modules
- In-memory repositories (mock data, no database)

### Infrastructure
- **Single Docker container** (multi-stage build)
- **docker-compose.yml** for easy startup
- Node.js serves both API and static frontend assets

---

## Architecture Overview

```
+--------------------------------------------------+
|  Docker Container (node:22-alpine)               |
|                                                  |
|  Express Server (:4000)                          |
|  +--------------------------------------------+ |
|  | /api/robot/*   REST endpoints              | |
|  | /ws/telemetry  WebSocket real-time stream  | |
|  | /*             Static frontend (Vite dist) | |
|  +--------------------------------------------+ |
|                                                  |
|  Service Layer (fully decoupled)                 |
|  +--------------------------------------------+ |
|  | Controllers -> Services -> Repositories    | |
|  | EventBus for real-time decoupling          | |
|  +--------------------------------------------+ |
+--------------------------------------------------+
```

### Backend Layer Architecture

```
HTTP Request
     |
  [auth.middleware]  -- validates X-API-Key header
     |
  [logger.middleware]
     |
  [robot.routes]  --------> [RobotController]
                                |       |       |
                      [RobotService] [TelemetryService] [CameraService]
                          |       |              |
               [RobotStateRepo] [PartsRepo]     |
                                                |
                      [eventBus] <--------------+
                          |
                   [TelemetryGateway]  ----> WebSocket clients
```

### Part Dependency Graph

```
                            +---------+
                            | chassis |  (non-removable root)
                            +---------+
                           /  |  |  |  \
                          /   |  |  |   \
               +---------+ +--+--+--+-+  +---------------+
               | caster  | | battery  |  | wiring        |
               |  ball   | |  pack    |  |  harness      |
               +---------+ +----------+  +---------------+
                              |    |        |    |    |
                              v    v        v    v    v
                     +---------+  +--------+
                     | jetson  |  | motor  |
                     |  nano   |<-| driver |
                     +---------+  +--------+
                    /   |    \       |    \
                   v    v     v      v     v
            +------+ +------+ +-------+ +-------+
            |camera| |ant-L | |wheel-L| |wheel-R|
            |module| +------+ +-------+ +-------+
            +------+ |ant-R |
                      +------+
```

---

## Directory Structure

```
dox-ai-dashboard/
  Dockerfile                              (NEW)
  docker-compose.yml                      (NEW)
  .dockerignore                           (NEW)

  ai-maturity-dashboard-source/           (existing frontend)
    package.json                          (MODIFY - add 3D + state deps)
    vite.config.ts                        (MODIFY - add dev proxy to :4000)
    src/
      App.tsx                             (MODIFY - add robot routes)

      types/
        index.ts                          (existing)
        robot.ts                          (NEW - shared frontend types)

      models/                             (NEW - pure domain models)
        robot-part.ts                     (part entity, criticality, dimensions)
        material.ts                       (conductivity, thermal, resistance)
        dependency-graph.ts               (graph edges, impact analysis types)
        robot-assembly.ts                 (assembly state, actions)

      data/                               (NEW - mock data)
        robot-parts.data.ts               (all 11 parts with realistic specs)
        materials.data.ts                 (10 materials with real S/m, W/mK values)
        dependency-graph.data.ts          (22 dependency edges)
        robotEndpoints.ts                 (API endpoint definitions for docs page)

      stores/
        robotStore.ts                     (NEW - Zustand store)

      services/                           (NEW - pure function services)
        robot-parts.service.ts            (lookup, filter, search, aggregate)
        dependency-graph.service.ts       (BFS impact, topological sort)
        assembly-state.service.ts         (reducer, validation)
        api.ts                            (REST client wrapper)
        websocket.ts                      (WebSocket client singleton)

      hooks/
        use-robot-assembly.ts             (NEW - useReducer wrapper)
        use-part-selection.ts             (NEW - selection/hover state)
        useRobotStatus.ts                 (NEW - polls GET /api/robot/status)
        useRobotTelemetry.ts              (NEW - WebSocket telemetry)
        useRobotControl.ts                (NEW - move/servo commands)
        useGamepad.ts                     (NEW - keyboard WASD listener)

      components/
        Layout/
          MainLayout.tsx                  (existing - no change)
          Sidebar.tsx                     (MODIFY - add Robot nav section)
          RobotLayout.tsx                 (NEW - sub-tab wrapper)

        Robot3D/                          (NEW - Three.js components)
          RobotViewer.tsx                 (Canvas wrapper + Suspense)
          SceneSetup.tsx                  (camera, lights, environment, ground)
          JetBotModel.tsx                 (top-level assembly)
          RobotPart.tsx                   (generic interactive wrapper)
          PostProcessing.tsx              (outline effects)
          parts/
            ChassisGroup.tsx              (two-tier platform + standoffs)
            WheelAssembly.tsx             (rim + tire, parameterized side)
            CasterBall.tsx                (metal ball + bracket)
            JetsonNano.tsx                (PCB + heatsink + ports)
            Antenna.tsx                   (rod + cap, parameterized side)
            CameraModule.tsx              (body + lens + ribbon cable)
            BatteryPack.tsx               (housing + LED)
            MotorDriverBoard.tsx          (PCB + capacitors + terminals)
            Wiring.tsx                    (decorative cable runs)
          hooks/
            useThemeInCanvas.ts           (MutationObserver bridge)
            usePartAnimation.ts           (damp3 easing)
            useCameraFocus.ts             (fly-to selected part)

        RobotUI/                          (NEW - 2D HTML panels)
          PartInfoPanel.tsx               (right sidebar detail view)
          PartToolbar.tsx                 (bottom action bar)
          PartBadge.tsx                   (category color badge)
          CriticalityBadge.tsx            (Critical/High/Medium/Low)

        Robot/                            (NEW - connectivity/control components)
          Connectivity/
            ConnectionForm.tsx            (IP/port/API key form)
            StatusIndicatorGrid.tsx       (4-card grid)
            StatusIndicator.tsx           (single metric card)
            ConnectionLog.tsx             (terminal-style log)
            QuickActions.tsx              (action buttons)
          Control/
            VirtualJoystick.tsx           (WASD + touch joystick)
            CameraFeed.tsx                (mock camera stream area)
            TelemetryGaugeGrid.tsx        (gauge container)
            TelemetryGauge.tsx            (radial gauge, SVG-based)
            CommandHistory.tsx            (scrollable command log)
            EmergencyStop.tsx             (large red stop button)
          Api/
            ApiDocLayout.tsx              (two-column swagger layout)
            EndpointCard.tsx              (collapsible endpoint section)
            TryItPanel.tsx                (request/response builder)
            CodeBlock.tsx                 (syntax-highlighted block)
            WebSocketTester.tsx           (WS connect/send/receive)

      pages/
        Home.tsx                          (MODIFY - add Robot card)
        MaturityDashboard.tsx             (existing)
        MaturityKPIs.tsx                  (existing)
        RobotViewer.tsx                   (NEW - /robot/viewer)
        RobotConnectivity.tsx             (NEW - /robot/connectivity)
        RobotControl.tsx                  (NEW - /robot/control)
        RobotApi.tsx                      (NEW - /robot/api)

  server/                                 (NEW - entire backend)
    package.json
    tsconfig.json
    src/
      index.ts                            (entry point)
      app.ts                              (Express app factory)
      config.ts                           (env config)
      types/
        robot.types.ts                    (canonical backend types)
        api.types.ts                      (request/response shapes)
      controllers/
        robot.controller.ts               (thin HTTP layer)
      services/
        robot.service.ts                  (business logic)
        telemetry.service.ts              (real-time mock generation)
        camera.service.ts                 (camera mock logic)
      repositories/
        robot-state.repository.ts         (in-memory state)
        parts.repository.ts               (parts data store)
      middleware/
        auth.middleware.ts                (mock API key validation)
        error.middleware.ts               (centralized error handler)
        logger.middleware.ts              (request logging)
      websocket/
        telemetry.gateway.ts              (WebSocket server)
      events/
        event-bus.ts                      (typed EventEmitter)
      routes/
        robot.routes.ts                   (Express Router + DI composition)
      mock-data/
        initial-state.ts                  (seed data)
```

---

## API Contract

| Method | Endpoint | Body | Response | Purpose |
|--------|----------|------|----------|---------|
| `GET` | `/api/robot/status` | -- | `ApiResponse<RobotStatus>` | Connection, battery, WiFi, system info |
| `POST` | `/api/robot/move` | `MoveCommand` | `ApiResponse<MoveResult>` | Directional movement |
| `POST` | `/api/robot/camera` | `CameraCommand` | `ApiResponse<CameraResult>` | Capture or toggle stream |
| `GET` | `/api/robot/telemetry` | -- | `ApiResponse<TelemetryFrame>` | Latest sensor snapshot |
| `POST` | `/api/robot/servo` | `ServoCommand` | `ApiResponse<ServoResult>` | Individual actuator control |
| `GET` | `/api/robot/parts` | -- | `ApiResponse<RobotPart[]>` | All parts inventory |
| `PUT` | `/api/robot/parts/:id` | `Partial<RobotPart>` | `ApiResponse<RobotPart>` | Update part config |
| `WS` | `/ws/telemetry` | `WsClientMessage` | `WsMessage<TelemetryFrame>` | Real-time 5Hz stream |

All REST responses use `ApiResponse<T>` envelope. All requests require `X-API-Key` header.

---

## UI Pages Layout

### Page 1: Robot 3D Viewer (`/robot/viewer`)

```
+----RobotLayout (tabs)----------------------------------------------+
| +--ViewerToolbar-------------------------------------------------+ |
| | [Reset View] [Wireframe] [Exploded View]              [Zoom]  | |
| +----------------------------------------------------------------+ |
| +--Left 70%------------------+ +--Right 30%--------------------+ | |
| |                             | | Part name + icon              | | |
| |   Three.js Canvas           | | Description                  | | |
| |   (OrbitControls)           | | Materials table               | | |
| |   Click part -> select      | | Conductivity & Resistance    | | |
| |   Double-click -> detach    | | Function description         | | |
| |                             | | CriticalityBadge             | | |
| |                             | | Connected parts links        | | |
| |                             | | [Detach/Attach] button       | | |
| +-----------------------------+ +--------------------------------+ | |
| +--PartChipBar (horizontal scroll)------------------------------+ | |
| | [Chassis] [Wheel L] [Wheel R] [Antenna L] [Jetson] [Camera]  | | |
| +----------------------------------------------------------------+ | |
+---------------------------------------------------------------------+
```

### Page 2: Connectivity (`/robot/connectivity`)

```
+----RobotLayout (tabs)----------------------------------------------+
| +--Left 50%------------------+ +--Right 50%--------------------+ | |
| | ConnectionForm              | | StatusIndicatorGrid          | | |
| |   IP: [192.168.1.100]      | |   [WiFi: -42dBm]  [Batt:87%]| | |
| |   Port: [8080]             | |   [Latency: 15ms] [Up: 1h]  | | |
| |   API Key: [***]           | |                              | | |
| |   [Connect] [Disconnect]   | |                              | | |
| +-----------------------------+ +--------------------------------+ | |
| +--ConnectionLog (terminal)-------------------------------------+ | |
| | > 10:23:01 Connected to 192.168.1.100:8080                   | | |
| | > 10:23:02 Handshake complete, API v2.1                      | | |
| +----------------------------------------------------------------+ | |
| +--QuickActions-------------------------------------------------+ | |
| | [Restart] [Firmware Update] [Diagnostics] [Export Logs]       | | |
| +----------------------------------------------------------------+ | |
+---------------------------------------------------------------------+
```

### Page 3: Control (`/robot/control`)

```
+----RobotLayout (tabs)----------------------------------------------+
| +--EMERGENCY STOP (full width)----------------------------------+ | |
| |              [!!!  EMERGENCY STOP  !!!]                       | | |
| +----------------------------------------------------------------+ | |
| +--Left 60%------------------+ +--Right 40%--------------------+ | |
| | CameraFeed (16:9 mock)     | | TelemetryGauges              | | |
| |                             | |  [Speed] [Direction]          | | |
| +-----------------------------+ |  [Battery] [Temperature]      | | |
| | VirtualJoystick (WASD)      | +--------------------------------+ | |
| |      [W]                    | | CommandHistory                | | |
| |   [A][S][D]                 | |  > 10:24 move forward 50%    | | |
| |   Speed: [====>---] 60%    | |  > 10:25 stop                | | |
| +-----------------------------+ +--------------------------------+ | |
+---------------------------------------------------------------------+
```

### Page 4: API Docs (`/robot/api`)

```
+----RobotLayout (tabs)----------------------------------------------+
| +--Nav 20%---+ +--Content 80%-----------------------------------+ | |
| | Endpoints  | | GET /api/robot/status                          | | |
| |  > status  | |   Description: Returns robot connection info   | | |
| |  > move    | |   +--TryItPanel------------------------------+ | | |
| |  > camera  | |   | Headers: X-API-Key: [___]               | | | |
| |  > telemetr| |   | [Send Request]                           | | | |
| |  > servo   | |   | Response: { "success": true, ... }      | | | |
| |  > parts   | |   +------------------------------------------+ | | |
| |  > WS      | |                                                | | |
| +-------------+ | WebSocketTester                                | | |
|                 |   [ws://...] [Connect] [Message log]           | | |
|                 +------------------------------------------------+ | |
+---------------------------------------------------------------------+
```

---

## 3D Model Strategy

**Approach: Programmatic geometry (not GLTF files)**

Rationale:
- Zero external asset pipeline (no Blender, no .glb hosting)
- Every part is a discrete React component - trivially clickable, removable, animatable
- Small bundle - geometry generates at runtime
- JetBot shapes (boxes, cylinders, tori) are well suited to procedural construction
- Future upgrade path to GLTF without changing interaction/animation layer

### Part Geometry Specifications

| Part | Geometry | Color | Material Properties |
|------|----------|-------|-------------------|
| Chassis | RoundedBox 4x0.4x5 | #22c55e (green) | roughness:0.7, metalness:0.1 |
| Wheels | Cylinder (rim) + Torus (tire) | White + #333 | rim: 0.3/0.6, tire: 0.9/0.0 |
| Caster | Sphere r=0.25 | #9ca3af (metallic) | roughness:0.2, metalness:0.8 |
| Jetson | Box 3x0.2x2.8 + heatsink block | #065f46 (dark PCB) | roughness:0.6, metalness:0.3 |
| Antennas | Thin cylinder h=3.5 | #1e293b (black) | roughness:0.4, metalness:0.5 |
| Camera | Box + Cylinder (lens) | #1e40af (blue PCB) | roughness:0.6, metalness:0.3 |
| Battery | RoundedBox 2.5x0.8x3 | #1e293b (dark) | roughness:0.5, metalness:0.2 |
| Motor Driver | Box 1.5x0.1x1.0 | #7c3aed (purple) | roughness:0.6, metalness:0.3 |
| Wiring | TubeGeometry curves | Red/Black/Yellow | roughness:0.8, metalness:0.1 |

### Scene Setup
- Camera: PerspectiveCamera FOV 45, position [6, 5, 8]
- Lights: Key directional (shadow), fill directional, rim point, ambient
- Environment: `<Environment preset="studio" />` for PBR reflections
- Ground: Plane with grid overlay, theme-reactive color
- Controls: OrbitControls with damping, constrained polar angles

### Interaction System
- Click part -> select -> show detail panel
- Double-click -> toggle attach/detach with spring animation
- Hover -> emissive glow (blue #3b82f6, intensity 0.15)
- Selected -> outline post-processing effect
- Detached -> animate to offset position with `maath/easing.damp3`
- "Explode All" -> staggered detach sequence (50ms between parts)

---

## Part Detail Data Model

Each part includes:

```typescript
interface RobotPart {
  id: string;
  name: string;
  description: string;
  category: 'structural' | 'compute' | 'power' | 'locomotion' | 'sensor' | 'communication' | 'electrical' | 'wiring';
  functionDescription: string;
  materialIds: string[];                    // references Material lookup
  electricalResistance: { valueOhms: number; isOnElectricalPath: boolean };
  criticality: 'critical' | 'high' | 'medium' | 'low';
  weightGrams: number;
  dimensions: { lengthMm: number; widthMm: number; heightMm: number };
  connectedPartIds: string[];               // physical adjacency
  dependsOnPartIds: string[];               // functional dependency
  isRemovable: boolean;
  meshRef: { filePath: string; format: string };
}

interface Material {
  id: string;
  name: string;
  electricalConductivity: { valueSiemensPerMeter: number; classification: 'conductor' | 'semiconductor' | 'insulator' };
  thermalConductivity: { valueWattsPerMeterKelvin: number; classification: 'high' | 'medium' | 'low' };
  densityKgPerM3: number;
}
```

### Materials Database (10 materials with real values)

| Material | Electrical (S/m) | Thermal (W/mK) | Class |
|----------|-----------------|-----------------|-------|
| Copper | 5.96e7 | 401 | Conductor |
| Aluminum 6061 | 2.5e7 | 167 | Conductor |
| Silicon (doped) | 1e3 | 149 | Semiconductor |
| PLA Plastic | 1e-14 | 0.13 | Insulator |
| FR-4 PCB | 1e-12 | 0.25 | Insulator |
| Rubber (SBR) | 1e-13 | 0.16 | Insulator |
| Stainless Steel 304 | 1.4e6 | 16.2 | Conductor |
| Li-Ion Casing | 1e-10 | 3.0 | Insulator |
| PVC Insulation | 1e-14 | 0.19 | Insulator |
| Optical Glass BK7 | 1e-12 | 1.114 | Insulator |

---

## New Dependencies

### Frontend (add to existing package.json)

```
Production:
  three              ^0.170.0    3D rendering engine
  @react-three/fiber ^9.0.0      React reconciler for Three.js
  @react-three/drei  ^10.0.0     Helpers (OrbitControls, Environment, etc.)
  @react-three/postprocessing ^3.0.0  Outline/selection effects
  zustand            ^5.0.0      State management (~1KB)
  maath              ^0.10.0     Math utilities for animation easing

Dev:
  @types/three       ^0.170.0    TypeScript types
```

### Backend (new server/package.json)

```
Production:
  express            ^5.1.0      HTTP server
  ws                 ^8.18.0     WebSocket server
  uuid               ^11.1.0     Request ID generation

Dev:
  @types/express     ^5.0.0
  @types/ws          ^8.5.13
  @types/uuid        ^10.0.0
  @types/node        ^22.0.0
  tsx                ^4.19.0     Dev server with watch
  typescript         ~5.9.3
```

---

## Feature Breakdown & Task List

### PHASE 1: Foundation & Infrastructure [9 tasks]

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 1.1 | Install frontend 3D + state deps | `package.json` | - |
| 1.2 | Create domain model types | `src/models/*.ts` (4 files) | - |
| 1.3 | Create materials mock data | `src/data/materials.data.ts` | 1.2 |
| 1.4 | Create robot parts mock data | `src/data/robot-parts.data.ts` | 1.2, 1.3 |
| 1.5 | Create dependency graph data | `src/data/dependency-graph.data.ts` | 1.2 |
| 1.6 | Create Zustand robot store | `src/stores/robotStore.ts` | 1.2 |
| 1.7 | Create service layer (3 services) | `src/services/*.service.ts` | 1.2, 1.4, 1.5 |
| 1.8 | Create React hooks (assembly + selection) | `src/hooks/use-*.ts` | 1.6, 1.7 |
| 1.9 | Create RobotLayout + modify Sidebar + routes | Layout files + `App.tsx` | 1.1 |

### PHASE 2: 3D Viewer [14 tasks]

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 2.1 | Create RobotViewer canvas wrapper | `Robot3D/RobotViewer.tsx` | 1.1 |
| 2.2 | Create SceneSetup (camera, lights, ground) | `Robot3D/SceneSetup.tsx` | 2.1 |
| 2.3 | Create useThemeInCanvas hook | `Robot3D/hooks/useThemeInCanvas.ts` | 2.1 |
| 2.4 | Create usePartAnimation hook | `Robot3D/hooks/usePartAnimation.ts` | 1.1 |
| 2.5 | Create RobotPart generic wrapper | `Robot3D/RobotPart.tsx` | 2.4, 1.6 |
| 2.6 | Build ChassisGroup geometry | `Robot3D/parts/ChassisGroup.tsx` | 2.5 |
| 2.7 | Build WheelAssembly geometry | `Robot3D/parts/WheelAssembly.tsx` | 2.5 |
| 2.8 | Build CasterBall geometry | `Robot3D/parts/CasterBall.tsx` | 2.5 |
| 2.9 | Build JetsonNano geometry | `Robot3D/parts/JetsonNano.tsx` | 2.5 |
| 2.10 | Build Antenna geometry | `Robot3D/parts/Antenna.tsx` | 2.5 |
| 2.11 | Build CameraModule geometry | `Robot3D/parts/CameraModule.tsx` | 2.5 |
| 2.12 | Build BatteryPack + MotorDriver + Wiring | `Robot3D/parts/*.tsx` (3 files) | 2.5 |
| 2.13 | Create JetBotModel assembly | `Robot3D/JetBotModel.tsx` | 2.6-2.12 |
| 2.14 | Create PostProcessing (outline effects) | `Robot3D/PostProcessing.tsx` | 2.13 |

### PHASE 3: Part Detail UI [5 tasks]

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 3.1 | Create CriticalityBadge component | `RobotUI/CriticalityBadge.tsx` | 1.2 |
| 3.2 | Create PartMaterialsTable | `RobotUI/PartInfoPanel.tsx` (sub) | 1.3 |
| 3.3 | Create PartInfoPanel (full detail sidebar) | `RobotUI/PartInfoPanel.tsx` | 3.1, 3.2, 1.4 |
| 3.4 | Create PartToolbar (bottom bar) | `RobotUI/PartToolbar.tsx` | 1.6 |
| 3.5 | Assemble RobotViewer page | `pages/RobotViewer.tsx` | 2.14, 3.3, 3.4 |

### PHASE 4: Backend Server [10 tasks]

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 4.1 | Create server package.json + tsconfig | `server/package.json`, `server/tsconfig.json` | - |
| 4.2 | Create server types | `server/src/types/*.ts` (2 files) | - |
| 4.3 | Create config + event bus | `server/src/config.ts`, `server/src/events/event-bus.ts` | 4.1 |
| 4.4 | Create mock seed data | `server/src/mock-data/initial-state.ts` | 4.2 |
| 4.5 | Create repositories (2 files) | `server/src/repositories/*.ts` | 4.4 |
| 4.6 | Create services (3 files) | `server/src/services/*.ts` | 4.5, 4.3 |
| 4.7 | Create middleware (3 files) | `server/src/middleware/*.ts` | 4.3 |
| 4.8 | Create controller + routes | `server/src/controllers/`, `server/src/routes/` | 4.6, 4.7 |
| 4.9 | Create WebSocket gateway | `server/src/websocket/telemetry.gateway.ts` | 4.3 |
| 4.10 | Create entry point + app factory | `server/src/index.ts`, `server/src/app.ts` | 4.8, 4.9 |

### PHASE 5: Connectivity Page [5 tasks]

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 5.1 | Create API client + WebSocket client | `src/services/api.ts`, `src/services/websocket.ts` | 4.10 |
| 5.2 | Modify vite.config.ts (dev proxy) | `vite.config.ts` | 4.10 |
| 5.3 | Create connectivity components (5 files) | `Robot/Connectivity/*.tsx` | 5.1 |
| 5.4 | Create useRobotStatus + useConnectionStatus hooks | `src/hooks/useRobot*.ts` | 5.1 |
| 5.5 | Assemble RobotConnectivity page | `pages/RobotConnectivity.tsx` | 5.3, 5.4 |

### PHASE 6: Control Page [6 tasks]

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 6.1 | Create useGamepad hook (WASD keyboard) | `src/hooks/useGamepad.ts` | - |
| 6.2 | Create VirtualJoystick (keyboard + touch) | `Robot/Control/VirtualJoystick.tsx` | 6.1 |
| 6.3 | Create CameraFeed mock | `Robot/Control/CameraFeed.tsx` | - |
| 6.4 | Create TelemetryGauge (reuse DonutChart SVG) | `Robot/Control/TelemetryGauge*.tsx` | - |
| 6.5 | Create EmergencyStop + CommandHistory | `Robot/Control/*.tsx` | - |
| 6.6 | Assemble RobotControl page | `pages/RobotControl.tsx` | 6.2-6.5, 5.1 |

### PHASE 7: API Docs Page [4 tasks]

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 7.1 | Create CodeBlock component | `Robot/Api/CodeBlock.tsx` | - |
| 7.2 | Create EndpointCard + TryItPanel | `Robot/Api/EndpointCard.tsx`, `TryItPanel.tsx` | 7.1, 5.1 |
| 7.3 | Create WebSocketTester | `Robot/Api/WebSocketTester.tsx` | 5.1 |
| 7.4 | Assemble RobotApi page | `pages/RobotApi.tsx` | 7.2, 7.3 |

### PHASE 8: Docker & Polish [5 tasks]

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 8.1 | Create Dockerfile (multi-stage) | `Dockerfile` | 4.10 |
| 8.2 | Create docker-compose.yml | `docker-compose.yml` | 8.1 |
| 8.3 | Create .dockerignore | `.dockerignore` | - |
| 8.4 | Responsive design pass (all pages) | Various | 3.5, 5.5, 6.6, 7.4 |
| 8.5 | Accessibility audit (ARIA, keyboard, focus) | Various | 8.4 |

---

## Total: 8 phases, 58 tasks

### Parallelization Opportunities

These task groups can be worked on **in parallel** by different developers:

- **Stream A (3D)**: Phases 1.1-1.2, then Phase 2 (3D viewer + parts)
- **Stream B (Data)**: Phases 1.3-1.5, 1.7 (data + services - pure TypeScript, no React)
- **Stream C (Backend)**: Phase 4 (entire server - independent project)
- **Stream D (UI)**: Phase 1.9 (layout/routing), then Phases 5-7 (connectivity, control, API pages)
- **Stream E (Infra)**: Phase 8.1-8.3 (Docker)

### Key Architectural Decisions

1. **Programmatic 3D geometry** over GLTF - zero asset pipeline, every part a React component
2. **Zustand** over React Context - avoids re-rendering entire Canvas tree on state change
3. **Pure function services** - tree-shakeable, testable without React, consistent with functional style
4. **`useReducer` pattern** - assembly state complex enough to warrant, defined outside React as pure reducer
5. **Express in same container** - single Docker image serves API + static frontend
6. **EventBus for real-time** - services never call each other directly; typed events for decoupling
7. **`maath/easing.damp3`** for animation - simpler than spring physics, no overshoot, predictable
8. **MutationObserver** for theme bridge - cleanest way to react to Tailwind dark class in R3F canvas
