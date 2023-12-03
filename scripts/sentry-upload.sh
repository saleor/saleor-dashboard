#!/bin/bash

if [[ -z "${SENTRY_ORG}" ]]; then
  echo "Sentry not definied. Skipping uploading..."
else 
  echo "Sentry processing... ($SENTRY_RELEASE)"
  npm run sentry:inject
  npm run sentry:upload
  npm run sentry:clean
fi