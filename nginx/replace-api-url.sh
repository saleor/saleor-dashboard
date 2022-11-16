#!/usr/bin/env sh

# Replaces the API_URL from the bundle's index.html file with the $API_URL env var.
# This script is automatically picked up by the nginx entrypoint on startup.

set -e

INDEX_BUNDLE_PATH="/app/dashboard/index.html"

if [ -z "${API_URL}" ]; then
    echo "No API_URL provided, using defaults."
else
    echo "Setting API_URL to: $API_URL"

    sed -i "s#API_URL:.*#API_URL: \"$API_URL\",#" "$INDEX_BUNDLE_PATH"
fi
