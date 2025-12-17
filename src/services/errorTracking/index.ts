import { SentryAdapter } from "./adapters";
import { ErrorTrackerFactory } from "./trackerFactory";

export const errorTracker = ErrorTrackerFactory(
  SentryAdapter({
    // todo install t3/env
    dsn: process.env.SENTRY_DSN as string,
    environment: process.env.ENVIRONMENT,
    release: process.env.RELEASE_NAME,
  }),
);
