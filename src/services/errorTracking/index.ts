import { SentryAdapter } from "./adapters";
import { ErrorTrackerFactory } from "./trackerFactory";

const errorTracker = ErrorTrackerFactory(
  SentryAdapter({
    dsn: process.env.SENTRY_DSN as string,
    environment: process.env.ENVIRONMENT as string,
    release: process.env.RELEASE_NAME as string,
  }),
);

export default errorTracker;
