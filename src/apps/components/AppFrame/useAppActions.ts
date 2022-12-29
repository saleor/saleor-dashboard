import {
  Actions,
  DispatchResponseEvent,
  Events,
  NotificationAction,
  RedirectAction,
} from "@saleor/app-sdk/app-bridge";
import { appPath } from "@saleor/apps/urls";
import { getAppMountUri } from "@saleor/config";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import React from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";
import urlJoin from "url-join";

import { useExternalApp } from "../ExternalAppContext";

const sendResponseStatus = (
  actionId: string,
  ok: boolean,
): DispatchResponseEvent => ({
  type: "response",
  payload: {
    actionId,
    ok,
  },
});

const isAppDeepUrlChange = (appId: string, from: string, to: string) => {
  const appCompletePath = appPath(encodeURIComponent(appId));

  return to.startsWith(appCompletePath) && from.startsWith(appCompletePath);
};

export const useAppActions = (
  frameEl: React.MutableRefObject<HTMLIFrameElement | null>,
  appOrigin: string,
  appId: string,
) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const location = useLocation();
  const { closeApp } = useExternalApp();
  const intl = useIntl();

  const actionReducer = (
    action: Actions | undefined,
  ): DispatchResponseEvent => {
    switch (action?.type) {
      case "notification": {
        const {
          actionId,
          ...notification
        } = action.payload as NotificationAction["payload"];

        notify({
          ...notification,
        });

        return sendResponseStatus(actionId, true);
      }
      case "redirect": {
        const {
          to,
          newContext,
          actionId,
        } = action.payload as RedirectAction["payload"];

        let success = true;
        const appDeepUrlChange = isAppDeepUrlChange(
          appId,
          location.pathname,
          to,
        );

        try {
          if (newContext) {
            window.open(to);
          } else if (appDeepUrlChange) {
            const exactLocation = urlJoin(getAppMountUri(), to);

            // Change only url without reloading if we are in the same app
            window.history.pushState(null, "", exactLocation);
          } else if (to.startsWith("/")) {
            navigate(to);
            closeApp();
          } else {
            const isExternalDomain =
              new URL(to).hostname !== window.location.hostname;

            if (isExternalDomain) {
              success = window.confirm(
                intl.formatMessage({
                  id: "MSItJD",
                  defaultMessage:
                    "You are about to leave the Dashboard. Do you want to continue?",
                }),
              );
            }

            if (success) {
              window.location.href = to;
            }
          }
        } catch (e) {
          success = false;
        }

        return sendResponseStatus(actionId, success);
      }
      case "updateRouting": {
        const { newRoute, actionId } = action.payload;

        const appCompletePath = appPath(encodeURIComponent(appId));

        window.history.pushState(null, "", appCompletePath + newRoute);

        return sendResponseStatus(actionId, true);
      }
      default: {
        throw new Error("Unknown action type");
      }
    }
  };

  const postToExtension = (event: Events) => {
    if (frameEl?.current?.contentWindow) {
      frameEl.current.contentWindow.postMessage(event, appOrigin);
    }
  };

  React.useEffect(() => {
    const handler = (event: MessageEvent<Actions>) => {
      if (event.origin === appOrigin) {
        const response = actionReducer(event.data);

        postToExtension(response);
      }
    };

    window.addEventListener("message", handler);

    return () => {
      window.removeEventListener("message", handler);
    };
  }, []);

  return {
    postToExtension,
  };
};
