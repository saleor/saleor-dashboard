#!/bin/bash

# Check if there are any changes in src/ directory
if ! git diff --name-only HEAD | grep -q '^src/'; then
    echo 'ℹ️ No changes in src/ directory, skipping validation' >&2
    exit 0
fi

echo '🔍 Running final validation...' >&2

# Run type checking
if ! pnpm run check-types; then
    echo '❌ TypeScript validation failed - please fix type errors before completing the task' >&2
    exit 2
fi

# Run linting
if ! pnpm run lint; then
    echo '❌ ESLint validation failed - please fix linting errors before completing the task' >&2
    exit 2
fi

echo '✅ All validations passed!' >&2
exit 0
