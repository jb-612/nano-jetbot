# Testing Standards

## Framework

- Frontend: Vitest + React Testing Library
- Backend: Vitest
- Type checking: `npx tsc --noEmit`

## Conventions

- Test files alongside source or in `__tests__/` directories
- Naming: `describe('ComponentName')` / `it('should ...')`
- Test behavior, not implementation details
- Mock external dependencies (API calls, WebSocket), not internal modules

## TDD Protocol

1. **RED**: Write a failing test first
2. **GREEN**: Write minimal code to make the test pass
3. **REFACTOR**: Clean up while keeping tests green

Never proceed to the next task with failing tests.

## Coverage

- Minimum 70% for new features
- Focus coverage on business logic and user interactions
- Don't test framework behavior (React rendering, Express routing)

## What to Test

- Component rendering and user interactions
- Hook return values and state transitions
- Service business logic
- API endpoint request/response contracts
- WebSocket message handling
