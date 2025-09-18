#!/bin/bash

echo '🔍 Running final validation...' >&2

# Run type checking
if ! npm run check-types; then
    echo '❌ TypeScript validation failed - please fix type errors before completing the task' >&2
    exit 2
fi

# Run linting
if ! npm run lint; then
    echo '❌ ESLint validation failed - please fix linting errors before completing the task' >&2  
    exit 2
fi

echo '✅ All validations passed!' >&2
exit 0
