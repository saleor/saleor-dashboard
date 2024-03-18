// @ts-strict-ignore
import { SentryAdapter } from "./adapters";
import { ErrorTrackerFactory } from "./trackerFactory";

const errorTracker = ErrorTrackerFactory(
  SentryAdapter({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.ENVIRONMENT,
    release: process.env.RELEASE_NAME,
  }),
);

export default errorTracker;
