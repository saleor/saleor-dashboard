import { createAppsDebug } from "@dashboard/apps/apps-debug";
import { usePostToExtension } from "@dashboard/apps/components/AppFrame/usePostToExtension";
import { useExternalApp } from "@dashboard/apps/components/ExternalAppContext/ExternalAppContext";
import { AppUrls } from "@dashboard/apps/urls";
import { getAppMountUri } from "@dashboard/config";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import {
  DispatchResponseEvent,
  NotificationAction,
  NotifyReady,
  RedirectAction,
  UpdateRouting,
} from "@saleor/app-sdk/app-bridge";
import { useIntl } from "react-intl";
import urlJoin from "url-join";

const debug = createAppsDebug("appActionsHandler");

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

const isExternalHost = (host: string) =>
  new URL(host).hostname !== window.location.hostname;

const isLocalPath = (path: string) => path.startsWith("/");

const useHandleNotificationAction = () => {
  const notify = useNotifier();

  return {
    handle: (action: NotificationAction) => {
      const { actionId, ...notification } = action.payload;

      debug(`Handling Notification action with ID: %s`, actionId);

      notify({
        ...notification,
      });

      return createResponseStatus(actionId, true);
    },
  };
};

const useHandleRedirectAction = (appId: string) => {
  const navigate = useNavigator();
  const { closeApp } = useExternalApp();
  const intl = useIntl();

  const handleAppDeepChange = (action: RedirectAction) => {
    debug("Handling deep app URL change");

    const exactLocation = urlJoin(getAppMountUri(), action.payload.to);

    debug(`Exact location to redirect: %s`, exactLocation);

    if (action.payload.newContext) {
      // Open new dashboard in new tab
      window.open(exactLocation);
    } else {
      // Change only url without reloading if we are in the same app
      window.history.pushState(null, "", exactLocation);
    }

    return createResponseStatus(action.payload.actionId, true);
  };

  const handleExternalHostChange = (action: RedirectAction) => {
    debug(
      `Handling external host change action with ID: %s`,
      action.payload.actionId,
    );
    debug(`Action payload is %O`, action.payload);

    if (action.payload.newContext) {
      window.open(action.payload.to);

      return createResponseStatus(action.payload.actionId, true);
    } else {
      const confirmed = window.confirm(
        intl.formatMessage({
          id: "MSItJD",
          defaultMessage:
            "You are about to leave the Dashboard. Do you want to continue?",
        }),
      );

      if (confirmed) {
        window.location.href = action.payload.to;

        return createResponseStatus(action.payload.actionId, true);
      }

      return createResponseStatus(action.payload.actionId, false);
    }
  };

  const handleLocalDashboardPathChange = (action: RedirectAction) => {
    if (action.payload.newContext) {
      const url = new URL(action.payload.to, getAppMountUri());

      window.open(url.href);
    } else {
      navigate(action.payload.to);
      closeApp();
    }

    return createResponseStatus(action.payload.actionId, true);
  };

  return {
    handle: (action: RedirectAction) => {
      const { actionId } = action.payload;
      debug(`Handling Redirect action with ID: %s`, actionId);
      debug(`Action payload: %O`, action.payload);

      const onlyAppDeepChange = AppUrls.isAppDeepUrlChange(
        appId,
        location.pathname,
        action.payload.to,
      );

      debug(`Is app deep URL change: %s`, onlyAppDeepChange);

      try {
        if (onlyAppDeepChange) {
          return handleAppDeepChange(action);
        } else if (isLocalPath(action.payload.to)) {
          return handleLocalDashboardPathChange(action);
        } else if (isExternalHost(action.payload.to)) {
          return handleExternalHostChange(action);
        }
      } catch (e) {
        console.error("Action handler thrown", e);
      }

      /**
       * Assume failure if nothing catched
       */
      console.error(
        "Couldnt handle Redirect action properly, this should not happen",
      );
      return createResponseStatus(actionId, false);
    },
  };
};

const useHandleUpdateRoutingAction = (appId: string) => ({
  handle: (action: UpdateRouting) => {
    const { newRoute, actionId } = action.payload;

    debug(
      `Handling UpdateRouting action with ID: %s and new route: %s`,
      actionId,
      newRoute,
    );

    const exactLocation = urlJoin(
      getAppMountUri(),
      `apps/${encodeURIComponent(appId)}/app`,
      action.payload.newRoute,
    );

    debug(`Update to new nested route:  %s`, exactLocation);

    window.history.pushState(null, "", exactLocation);

    return createResponseStatus(actionId, true);
  },
});

/**
 * TODO Remove prop drilling, consume context
 */
const useNotifyReadyAction = (
  frameEl: HTMLIFrameElement | null,
  appOrigin: string,
  appToken: string,
) => {
  const postToExtension = usePostToExtension(frameEl, appOrigin);

  debug("Received notifyReady action");

  return {
    handle(action: NotifyReady) {
      postToExtension({
        type: "handshake",
        payload: {
          token: appToken,
          version: 1,
        },
      });
      return createResponseStatus(action.payload.actionId, true);
    },
  };
};

export const AppActionsHandler = {
  useHandleNotificationAction,
  useHandleUpdateRoutingAction,
  useHandleRedirectAction,
  useNotifyReadyAction,
  createResponseStatus,
};
