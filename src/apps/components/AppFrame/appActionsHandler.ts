import { useExternalApp } from "@dashboard/apps/components/ExternalAppContext";
import { appPath } from "@dashboard/apps/urls";
import { getAppMountUri } from "@dashboard/config";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import {
  DispatchResponseEvent,
  NotificationAction,
  RedirectAction,
  UpdateRouting,
} from "@saleor/app-sdk/app-bridge";
import { useCallback } from "react";
import { useIntl } from "react-intl";
import urlJoin from "url-join";

const createResponseStatus = (
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

const useHandleNotificationAction = () => {
  const notify = useNotifier();

  const handle = useCallback(
    (action: NotificationAction) => {
      const { actionId, ...notification } =
        action.payload as NotificationAction["payload"];

      notify({
        ...notification,
      });

      return createResponseStatus(actionId, true);
    },
    [notify],
  );

  return {
    handle,
  };
};

const useHandleRedirectAction = (appId: string) => {
  const navigate = useNavigator();
  const { closeApp } = useExternalApp();
  const intl = useIntl();

  return {
    handle: useCallback(
      (action: RedirectAction) => {
        const { to, newContext, actionId } =
          action.payload as RedirectAction["payload"];

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

        return createResponseStatus(actionId, success);
      },
      [appId, closeApp, intl, navigate],
    ),
  };
};

const useUpdateRoutingAction = (appId: string) => ({
  handle: useCallback(
    (action: UpdateRouting) => {
      const { newRoute, actionId } = action.payload;

      const appCompletePath = new URL(
        appPath(encodeURIComponent(appId)),
        getAppMountUri(),
      ).href;

      window.history.pushState(null, "", appCompletePath + newRoute);

      return createResponseStatus(actionId, true);
    },
    [appId],
  ),
});

export const AppActionsHandler = {
  useHandleNotificationAction,
  useUpdateRoutingAction,
  useHandleRedirectAction,
};
