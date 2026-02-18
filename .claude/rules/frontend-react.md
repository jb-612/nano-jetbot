---
paths:
  - "ai-maturity-dashboard-source/**/*.tsx"
  - "ai-maturity-dashboard-source/**/*.ts"
---

# Frontend React Rules

## Components

- Functional components only — no class components
- Define props interface above the component
- Structure: types → hooks → helpers → component → exports

## State Management

- Zustand for global/shared state (robot assembly, theme)
- Local `useState` for component-scoped UI state
- No Redux, no React Context for global state

## 3D Visualization

- React Three Fiber declarative JSX — never imperative Three.js API
- Use `@react-three/drei` helpers (OrbitControls, Environment, etc.)
- Keep Canvas tree separate from HTML UI tree
- Use `maath/easing.damp3` for smooth animations, not spring physics

## Styling

- Tailwind CSS utility classes exclusively
- No inline styles, CSS modules, or styled-components
- Dark mode: use `dark:` prefix classes with Tailwind

## Hooks

- Prefix all custom hooks with `use`
- Return `{ data, loading, error }` for data-fetching hooks
- Clean up subscriptions and timers in `useEffect` return

## Pages

- Pages are self-contained with local sub-components
- Avoid extracting components until they're reused
- Each page maps to a route in the tab navigation
