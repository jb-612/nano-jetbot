---
name: api-endpoint
description: Scaffold a new Express API endpoint with TDD
allowed-tools: Write, Edit, Bash
---

# Scaffold API Endpoint

Creates a new Express API endpoint following the Controller → Service → Repository pattern with a test file.

## Usage

```
/api-endpoint resource-name
```

## What It Creates

For `/api-endpoint diagnostics`:

```
server/src/
├── types/diagnostics.ts           # Request/response types
├── services/diagnosticsService.ts # Business logic
├── controllers/diagnosticsController.ts # HTTP handler
├── routes/diagnosticsRoutes.ts    # Route definitions
└── __tests__/diagnostics.test.ts  # Integration test
```

## Implementation Order

1. **Types**: Define request/response interfaces in `types/`
2. **Test**: Write a failing test first (RED)
3. **Service**: Business logic, no Express imports
4. **Controller**: HTTP request/response handling only
5. **Route**: Wire up with `express.Router()`
6. **Register**: Add route to `src/index.ts`
7. **Verify**: Run test to confirm GREEN

## Conventions

- Use `ApiResponse<T>` envelope for all responses
- Validate inputs in the controller layer
- Services throw typed errors, controllers catch and map to HTTP status codes
- Route files export a configured Router instance
