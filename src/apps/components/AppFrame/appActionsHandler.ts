import { useExternalApp } from "@dashboard/apps/components/ExternalAppContext/ExternalAppContext";
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
      const { actionId, ...notification } = action.payload;

      console.debug(`Handling Notification action with ID: ${actionId}`);

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
    console.debug("Handling deep app URL change");
    const exactLocation = urlJoin(getAppMountUri(), action.payload.to);
    console.debug(`Exact location to redirect: ${exactLocation}`);

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
    console.debug(
      `Handling external host change action with ID: ${action.payload.actionId}`,
    );
    console.debug(`Action payload is `, action.payload);

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
      console.debug(`Handling Redirect action with ID ${actionId}`);
      console.debug(`Action payload`, action.payload);

      const onlyAppDeepChange = AppUrls.isAppDeepUrlChange(
        appId,
        location.pathname,
        action.payload.to,
      );

      console.debug(`Is app deep URL change: ${onlyAppDeepChange}`);

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

    console.debug(
      `Handling UpdateRouting action with ID: ${actionId} and new route: ${newRoute}`,
    );

    const exactLocation = urlJoin(
      getAppMountUri(),
      `apps/${encodeURIComponent(appId)}/app`,
      action.payload.newRoute,
    );

    console.debug(`Update to new nested route ${exactLocation}`);

    window.history.pushState(null, "", exactLocation);

    return createResponseStatus(actionId, true);
  },
});

const useNotifyReadyAction = () => ({
  handle(action: NotifyReady) {
    console.debug(
      `Handling NotifyReady action with ID: ${action.payload.actionId}`,
    );
    console.warn("Not implemented");
    return createResponseStatus(action.payload.actionId, true);
  },
});

export const AppActionsHandler = {
  useHandleNotificationAction,
  useHandleUpdateRoutingAction,
  useHandleRedirectAction,
  useNotifyReadyAction,
  createResponseStatus,
};
