if [[ -z "${SENTRY_ORG}" ]]; then
  echo "Sentry not definied. Skipping..."
else 
  echo "Sentry processing..."
  npm run sentry:inject
  npm run sentry:upload
  npm run sentry:clean
fi