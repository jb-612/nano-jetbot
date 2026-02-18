#!/usr/bin/env bash
# PreToolUse hook: Run TypeScript type-check before git commit
# Exit 0 = allow, Exit 2 = block

set -euo pipefail

# Read stdin for tool info
INPUT=$(cat)
TOOL=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool',''))" 2>/dev/null || echo "")

# Only check on Bash tool calls that contain "git commit"
if [ "$TOOL" != "Bash" ]; then
  exit 0
fi

COMMAND=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('arguments',{}).get('command',''))" 2>/dev/null || echo "")

if ! echo "$COMMAND" | grep -q "git commit"; then
  exit 0
fi

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
FRONTEND_DIR="$PROJECT_ROOT/ai-maturity-dashboard-source"
BACKEND_DIR="$PROJECT_ROOT/server"

ERRORS=""

# Type-check frontend
if [ -f "$FRONTEND_DIR/tsconfig.json" ]; then
  if ! (cd "$FRONTEND_DIR" && npx tsc --noEmit 2>&1); then
    ERRORS="Frontend type errors found."
  fi
fi

# Type-check backend
if [ -f "$BACKEND_DIR/tsconfig.json" ]; then
  if ! (cd "$BACKEND_DIR" && npx tsc --noEmit 2>&1); then
    ERRORS="$ERRORS Backend type errors found."
  fi
fi

if [ -n "$ERRORS" ]; then
  echo "$ERRORS Fix type errors before committing." >&2
  exit 2
fi

exit 0
