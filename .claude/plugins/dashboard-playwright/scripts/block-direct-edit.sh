#!/bin/bash
# Block direct edits to playwright test files

FILE_PATH="${CLAUDE_FILE_PATH:-}"

if [[ "$FILE_PATH" == *"playwright/"* ]] && [[ "$FILE_PATH" == *".spec.ts"* || "$FILE_PATH" == *".test.ts"* || "$FILE_PATH" == *"/pages/"* ]]; then
    echo "🚫 BLOCKED: Direct edit to Playwright test file" >&2
    echo "" >&2
    echo "When running /dashboard-playwright:analyze-failures, you MUST delegate edits to subagents:" >&2
    echo "" >&2
    echo "Use Task tool with subagent_type: \"dashboard-playwright:e2e-test-fixer\"" >&2
    exit 2
fi

exit 0
