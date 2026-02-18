---
name: review-pr
description: Review a pull request for quality, security, and best practices
allowed-tools: Read, Grep, Glob, Bash
disable-model-invocation: true
---

# Review Pull Request

Reviews a pull request using the project's review checklist.

## Usage

```
/review-pr [PR number or branch name]
```

## Review Checklist

### TypeScript Strict Compliance
- No `any` types, proper type annotations
- Correct generics usage, minimal type assertions

### React Best Practices
- Hooks rules followed (no conditional hooks, proper deps arrays)
- Key props on list items, appropriate memo/useMemo/useCallback
- Proper useEffect cleanup

### Express Security
- Input validation on all endpoints
- No leaked stack traces in error responses
- Auth checks where needed, no hardcoded secrets

### Test Coverage
- Tests exist for new/modified code
- Happy path and error cases covered
- Meaningful assertions

### Performance
- No unnecessary re-renders
- Large bundle imports flagged
- WebSocket message frequency reasonable

### Accessibility
- ARIA attributes on interactive elements
- Semantic HTML, keyboard navigation support

## Output Format

Organize findings by severity:

```
[CRITICAL] path/to/file.ts:42 — Description and suggested fix
[WARNING]  path/to/file.tsx:15 — Description of concern
[SUGGESTION] path/to/file.ts:88 — Alternative approach
```

## Steps

1. Get the diff: `gh pr diff <number>` or `git diff main...<branch>`
2. Read each changed file in full for context
3. Apply the review checklist to every changed file
4. Report findings organized by severity
5. Summarize with a pass/fail recommendation
