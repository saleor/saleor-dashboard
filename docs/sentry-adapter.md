# Sentry adapter

We use Sentry as the default tracker. No changes in code are required for it to work. You can configure it with the environment variables.

The following environment variables are available:

```
# Required
SENTRY_DSN=

# Optional
# https://docs.sentry.io/product/cli/configuration/
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_URL_PREFIX=
ENVIRONMENT=
```
