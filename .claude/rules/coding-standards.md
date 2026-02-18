# Coding Standards

## TypeScript

- Strict mode enabled (`"strict": true` in tsconfig)
- No `any` types — use `unknown` and narrow, or define proper interfaces
- Named exports preferred over default exports
- Import ordering: react/node builtins → third-party → local modules → types

## Error Handling

- Backend: Use typed error responses via `ApiError` interface
- Frontend: Hooks return `{ data, loading, error }` pattern
- Never swallow errors silently — log or propagate

## Naming

- Files: PascalCase for components (`RobotViewer.tsx`), kebab-case for utilities (`use-robot-status.ts`)
- Variables/functions: camelCase
- Types/interfaces: PascalCase
- Constants: UPPER_SNAKE_CASE for true constants, camelCase for config objects

## Code Organization

- One component per file
- Co-locate tests with source when possible
- Types that cross module boundaries go in dedicated `types/` directories
