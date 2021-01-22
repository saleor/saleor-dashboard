import * as Sentry from "@sentry/react";

import { TrackerMethods } from "../types";

interface Config {
  dsn: string;
  environment?: string;
}

export const SentryAdapter = (config: Config): TrackerMethods => {
  const init: TrackerMethods["init"] = () => {
    if (config?.dsn) {
      Sentry.init({
        dsn: config.dsn,
        environment: config.environment
      });
      return true;
    }
    return false;
  };

  const setUserData: TrackerMethods["setUserData"] = userData =>
    Sentry.setUser(userData);

  const captureException: TrackerMethods["captureException"] = (e: Error) =>
    Sentry.captureException(e);

  return {
    captureException,
    init,
    setUserData
  };
};
