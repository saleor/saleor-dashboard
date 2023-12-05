// @ts-strict-ignore
import { createAppsDebug } from "@dashboard/apps/apps-debug";
import { usePrevious } from "@dashboard/hooks/usePrevious";
import { DashboardEventFactory, Events } from "@saleor/app-sdk/app-bridge";
import { useEffect } from "react";

interface Args {
  enabled: boolean;
  appToken: string;
  postToExtension: (events: Events) => void;
}

const debug = createAppsDebug("useUpdateAppToken");

/**
 * Listens on appToken changes and pushes it to the App if changed.
 */
export const useUpdateAppToken = ({
  enabled,
  appToken,
  postToExtension,
}: Args) => {
  const cachedToken = usePrevious(appToken);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (!cachedToken) {
      /**
       * Missing cache token means its first render, so we dont want to send it to app
       */
      return;
    }

    if (cachedToken !== appToken) {
      debug("Will send new token to the app");
      /**
       * Ensure running only when token changes. If token changes, send it to app
       */
      postToExtension(DashboardEventFactory.createTokenRefreshEvent(appToken));
    }
  }, [enabled, appToken, cachedToken, postToExtension]);
};
