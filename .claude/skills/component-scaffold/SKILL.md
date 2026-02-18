---
name: component-scaffold
description: Scaffold a new React component with test file
allowed-tools: Write, Bash
---

# Scaffold React Component

Creates a new React component with its co-located test file.

## Usage

```
/component-scaffold ComponentName
```

## What It Creates

For `/component-scaffold RobotStatus`:

```
ai-maturity-dashboard-source/src/components/
├── RobotStatus.tsx          # Component file
└── RobotStatus.test.tsx     # Test file with basic render test
```

## Component Template

- Functional component with TypeScript props interface
- Named export (not default)
- Tailwind CSS classes for styling
- Dark mode support via `dark:` prefix

## Test Template

- Vitest + React Testing Library
- Basic render test
- Props validation test
- Follows `describe('ComponentName')` / `it('should ...')` convention

## Instructions

1. Accept the component name as the first argument
2. Create the component file at `ai-maturity-dashboard-source/src/components/{Name}.tsx`
3. Create the test file at `ai-maturity-dashboard-source/src/components/{Name}.test.tsx`
4. Use PascalCase for the component name and file name
5. Include a `{Name}Props` interface even if initially empty
6. Add a basic render test and a snapshot-free assertion
