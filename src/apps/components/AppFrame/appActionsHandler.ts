import { useExternalApp } from "@dashboard/apps/components/ExternalAppContext";
import { appPath } from "@dashboard/apps/urls";
import { getAppMountUri } from "@dashboard/config";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { AppUrls } from "@dashboard/new-apps/urls";
import {
  DispatchResponseEvent,
  NotificationAction,
  NotifyReady,
  RedirectAction,
  UpdateRouting,
} from "@saleor/app-sdk/app-bridge";
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

const isExternalHost = (host: string) =>
  new URL(host).hostname !== window.location.hostname;

const isLocalPath = (path: string) => path.startsWith("/");

const useHandleNotificationAction = () => {
  const notify = useNotifier();

  return {
    handle: (action: NotificationAction) => {
      const { actionId, ...notification } =
        action.payload as NotificationAction["payload"];

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
    const exactLocation = urlJoin(getAppMountUri(), action.payload.to);

    if (action.payload.newContext) {
      // Open new dashboard in new tab
      window.open(exactLocation);
    } else {
      // Change only url without reloading if we are in the same app
      window.history.pushState(null, "", exactLocation);
    }
  };

  const handleExternalHostChange = (action: RedirectAction) => {
    if (action.payload.newContext) {
      window.open(action.payload.to);
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
      }
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
  };

  return {
    handle: (action: RedirectAction) => {
      const { actionId } = action.payload;

      const onlyAppDeepChange = AppUrls.isAppDeepUrlChange(
        appId,
        location.pathname,
        action.payload.to,
      );

      /**
       * Handle local app URL changes, eg apps/XYZ/app/configuration -> apps/XYZ/app/preview
       */
      if (onlyAppDeepChange) {
        try {
          handleAppDeepChange(action);

          return createResponseStatus(actionId, true);
        } catch (e) {
          return createResponseStatus(actionId, false);
        }
      }

      if (isExternalHost(action.payload.to)) {
        try {
          handleExternalHostChange(action);

          return createResponseStatus(actionId, true);
        } catch (e) {
          return createResponseStatus(actionId, false);
        }
      }

      if (isLocalPath(action.payload.to)) {
        try {
          handleLocalDashboardPathChange(action);
          return createResponseStatus(actionId, true);
        } catch (e) {
          return createResponseStatus(actionId, false);
        }
      }

      // If nothing was catched, assume failure
      return createResponseStatus(actionId, false);
    },
  };
};

const useUpdateRoutingAction = (appId: string) => ({
  handle: (action: UpdateRouting) => {
    const { newRoute, actionId } = action.payload;

    const appCompletePath = new URL(
      appPath(encodeURIComponent(appId)),
      getAppMountUri(),
    ).href;

    window.history.pushState(null, "", appCompletePath + newRoute);

    return createResponseStatus(actionId, true);
  },
});

const useNotifyReadyAction = () => ({
  handle(action: NotifyReady) {
    console.warn("Not implemented");
    return createResponseStatus(action.payload.actionId, true);
  },
});

export const AppActionsHandler = {
  useHandleNotificationAction,
  useUpdateRoutingAction,
  useHandleRedirectAction,
  useNotifyReadyAction,
};
