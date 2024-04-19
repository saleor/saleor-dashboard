import * as Sentry from "@sentry/react";

import { TrackerMethods } from "../types";

interface Config {
  dsn: string;
  environment?: string;
  release?: string;
}

export const SentryAdapter = (config: Config): TrackerMethods => {
  const init: TrackerMethods["init"] = () => {
    if (config?.dsn) {
      Sentry.init({
        dsn: config.dsn,
        environment: config.environment,
        release: config.release,
        ignoreErrors: [
          "Editor's content can not be saved in read-only mode",
          "ResizeObserver loop completed with undelivered notifications",
          // TODO: rmoeve after Cypress migation
          "ResizeObserver loop limit exceeded",
        ],
      });

      return true;
    }

    return false;
  };
  const setUserData: TrackerMethods["setUserData"] = userData => Sentry.setUser(userData);
  const captureException: TrackerMethods["captureException"] = (e: Error) =>
    Sentry.captureException(e);

  return {
    captureException,
    init,
    setUserData,
  };
};
