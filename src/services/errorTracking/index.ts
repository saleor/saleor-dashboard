import { SentryAdapter } from "./adapters";
import { ErrorTrackingFactory } from "./errorTracking";

export const errorTracking = ErrorTrackingFactory(
  SentryAdapter({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.ENVIRONMENT
  })
);
