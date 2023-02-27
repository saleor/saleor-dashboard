import { SentryAdapter } from "./adapters";
import { ErrorTrackerFactory } from "./trackerFactory";

const errorTracker = ErrorTrackerFactory(
  SentryAdapter({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.ENVIRONMENT,
  }),
);

export default errorTracker;
