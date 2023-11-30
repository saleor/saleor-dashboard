if [[ -z "${SENTRY_ORG}" ]]; then
  echo "Sentry not definied. Skipping initializing..."
else 
  VER=$(cat package.json | jq -r .version)
  COMMIT=$(git rev-parse --short HEAD)
  SENTRY_RELEASE="$VER-$COMMIT"
  echo "Sentry release: $SENTRY_RELEASE"
fi