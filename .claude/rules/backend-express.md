---
paths:
  - "server/**/*.ts"
---

# Backend Express Rules

## Architecture

Follow Controller → Service → Repository layering:

- **Controllers**: Parse HTTP request, call service, format response. No business logic.
- **Services**: Business logic and orchestration. No Express imports.
- **Repositories**: Data access layer. Currently mock data, designed to swap for real JetBot connection.

## Routes

- All routes defined in `server/src/routes/` using Express Router
- Routes compose controllers with middleware
- Auth middleware (`X-API-Key`) applied at the router level

## Middleware

- `auth.middleware.ts` — API key validation
- `error.middleware.ts` — Catch-all error handler, returns `ApiError` format
- `logger.middleware.ts` — Request/response logging

## Types

- Shared interfaces in `server/src/types/`
- `ApiResponse<T>` envelope for all success responses
- `ApiError` for all error responses
- `WsMessage<T>` for WebSocket frames

## WebSocket

- Telemetry gateway at `/ws` delivers frames at 5Hz
- Client messages use `WsClientMessage` type (subscribe/unsubscribe/ping)
- Handle connection lifecycle (open, close, error)

## EventBus

- Typed EventBus in `server/src/events/` for service decoupling
- Services emit events, other services subscribe
- Prefer EventBus over direct service-to-service calls for loose coupling
