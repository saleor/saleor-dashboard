#!/bin/bash
# Extract detailed information for a specific error category
# Usage: ./get-error-details.sh <failures-full.json> <category> [index]
# Categories: assertion, timeout, element-not-found, network, other

set -e

FAILURES_FILE="${1:-playwright-failures/failures-full.json}"
CATEGORY="${2:-assertion}"
INDEX="${3:-0}"  # Get specific failure by index, or "all" for all

if [ ! -f "$FAILURES_FILE" ]; then
    echo "Error: Failures file not found: $FAILURES_FILE" >&2
    exit 1
fi

if [ "$INDEX" = "all" ]; then
    # Get all failures of this category
    jq --arg cat "$CATEGORY" '
    .failures[] |
    select(.tests[0].results[0].category == $cat) |
    {
        title: .title,
        file: .file,
        line: .line,
        error: .tests[0].results[0].error,
        attachments: .tests[0].results[0].attachments
    }
    ' "$FAILURES_FILE"
else
    # Get specific failure by index
    jq --arg cat "$CATEGORY" --argjson idx "$INDEX" '
    [.failures[] | select(.tests[0].results[0].category == $cat)][$idx] |
    {
        title: .title,
        file: .file,
        line: .line,
        error: .tests[0].results[0].error,
        attachments: .tests[0].results[0].attachments
    }
    ' "$FAILURES_FILE"
fi
