import { getAppMountUri } from "@dashboard/config";
import { useActiveAppExtension } from "@dashboard/extensions/components/AppExtensionContext/AppExtensionContextProvider";
import { useTriggerEntityRefresh } from "@dashboard/extensions/entity-refresh";
import {
  applyWidgetHeightToFrame,
  createWidgetResizeOkResponse,
} from "@dashboard/extensions/hooks/widgetIframeResize";
import { ExtensionsUrls, LegacyAppPaths } from "@dashboard/extensions/urls";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import {
  DashboardEventFactory,
  type DispatchResponseEvent,
  type FormPayloadUpdate,
  type NotificationAction,
  type NotifyReady,
  type OpenPopup,
  type PopupClose,
  type RedirectAction,
  type RefreshEntity,
  type RequestPermissions,
  type UpdateRouting,
  type WidgetResize,
} from "@saleor/app-sdk/app-bridge";
import { useIntl } from "react-intl";
import urlJoin from "url-join";

import { createAppsDebug } from "../../utils/apps-debug";
import { useExternalApp } from "../ExternalAppContext/ExternalAppContext";
import { usePostToExtension } from "./usePostToExtension";

const debug = createAppsDebug("appActionsHandler");
const createResponseStatus = (actionId: string, ok: boolean): DispatchResponseEvent => ({
  type: "response",
  payload: {
    actionId,
    ok,
  },
});
const isExternalHost = (host: string) => new URL(host).host !== window.location.host;
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

    const getNewExactLocation = () => {
      const legacyAppPath = LegacyAppPaths.resolveAppPath(appId);

      if (action.payload.to.startsWith(legacyAppPath)) {
        /* Some apps might have used path in dashboard to /apps/XYZ/app/... as a way
         * to change it's own URL - we still need to support this even though apps are now in
         * /extensions/app/XYZ/...
         **/
        const subpath = action.payload.to.replace(legacyAppPath, "");
        const newPath = ExtensionsUrls.resolveAppDeepUrl(appId, subpath);

        return urlJoin(getAppMountUri(), newPath);
      } else {
        /** Newer apps can use /extensions/app/XYZ/... to change it's own URL
         * however we should discourage such usage, app should just use window.location.href
         * or some custom router (e.g. Next.js Router) */
        return urlJoin(getAppMountUri(), action.payload.to);
      }
    };

    const exactLocation = getNewExactLocation();

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
    debug(`Handling external host change action with ID: %s`, action.payload.actionId);
    debug(`Action payload is %O`, action.payload);

    if (action.payload.newContext) {
      window.open(action.payload.to);

      return createResponseStatus(action.payload.actionId, true);
    } else {
      const confirmed = window.confirm(
        intl.formatMessage({
          id: "MSItJD",
          defaultMessage: "You are about to leave the Dashboard. Do you want to continue?",
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
      const exactLocation = urlJoin(getAppMountUri(), action.payload.to);

      window.open(exactLocation);
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

      const onlyAppDeepChange = ExtensionsUrls.isAppDeepUrlChange(
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
       * Assume failure if nothing caught
       */
      console.error("Couldn't handle Redirect action properly, this should not happen");

      return createResponseStatus(actionId, false);
    },
  };
};
const useHandleUpdateRoutingAction = (appId: string) => ({
  handle: (action: UpdateRouting) => {
    const { newRoute, actionId } = action.payload;

    debug(`Handling UpdateRouting action with ID: %s and new route: %s`, actionId, newRoute);

    const exactLocation = urlJoin(
      getAppMountUri(),
      ExtensionsUrls.resolveViewManifestExtensionUrl(appId).replace("?", ""),
      action.payload.newRoute,
    );

    if (window.location.pathname === exactLocation) {
      debug("Current route is the same as requested change, skipping navigation.");

      return createResponseStatus(actionId, true);
    }

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
  versions: {
    core: string;
    dashboard: string;
  },
) => {
  const postToExtension = usePostToExtension(frameEl, appOrigin);

  debug("Received notifyReady action");

  return {
    handle(action: NotifyReady) {
      postToExtension(
        DashboardEventFactory.createHandshakeEvent(appToken, 1, {
          core: versions.core,
          dashboard: versions.dashboard,
        }),
      );

      return createResponseStatus(action.payload.actionId, true);
    },
  };
};

const useHandlePermissionRequest = (appId: string) => {
  const navigate = useNavigator();

  return {
    handle: (action: RequestPermissions) => {
      const { actionId, permissions, redirectPath } = action.payload;

      debug("Received RequestPermissions action");

      if (permissions.length === 0) {
        debug("Empty permissions array, skipping");

        return createResponseStatus(actionId, false);
      }

      if (!redirectPath || redirectPath.length === 0) {
        debug("Invalid path, skipping");

        return createResponseStatus(actionId, false);
      }

      navigate(
        ExtensionsUrls.resolveRequestPermissionsUrl(appId, {
          redirectPath,
          requestedPermissions: permissions,
        }),
      );

      return createResponseStatus(actionId, true);
    },
  };
};

const useHandleAppFormUpdate = () => {
  const { attachFormResponseFrame, deactivate } = useActiveAppExtension();

  return {
    handle: (action: FormPayloadUpdate) => {
      const { actionId, ...payload } = action.payload;
      const shouldClosePopup = payload.closePopup ?? true;

      attachFormResponseFrame(payload);

      if (shouldClosePopup) {
        deactivate();
      }

      return createResponseStatus(actionId, true);
    },
  };
};

const useHandlePopupCloseAction = () => {
  const { deactivate } = useActiveAppExtension();

  return {
    handle: (action: PopupClose) => {
      const { actionId } = action.payload;

      debug(`Handling PopupClose action with ID: %s`, actionId);
      deactivate();

      return createResponseStatus(actionId, true);
    },
  };
};

const useHandleWidgetResizeAction = (frameEl: HTMLIFrameElement | null) => ({
  handle: (action: WidgetResize) => {
    const { actionId, height } = action.payload;

    debug(`Handling WidgetResize action with ID: %s, height: %s`, actionId, height);

    if (!frameEl) {
      return createWidgetResizeOkResponse(actionId);
    }

    applyWidgetHeightToFrame(frameEl, height);

    return createWidgetResizeOkResponse(actionId);
  },
});

/**
 * TODO: POST-method widgets (IframePost) are not wired to this action yet - they
 * use a separate listener that only handles `widgetResize`.
 */
const useHandleRefreshEntityAction = () => {
  const triggerEntityRefresh = useTriggerEntityRefresh();

  return {
    handle: (action: RefreshEntity) => {
      const { actionId } = action.payload;

      debug(`Handling RefreshEntity action with ID: %s`, actionId);

      // Fire-and-forget: ack immediately, refresh the current page in the
      // background. No-op when no entity page is registered.
      triggerEntityRefresh();

      return createResponseStatus(actionId, true);
    },
  };
};

/**
 * Opens a POPUP extension belonging to the SAME app as the firing widget.
 * Only honored for WIDGET frames - other frame types are rejected.
 */
const useHandleOpenPopupAction = (appId: string, target: "POPUP" | "WIDGET" | "APP_PAGE") => {
  const { openPopupByIdentifier } = useActiveAppExtension();

  return {
    handle: (action: OpenPopup) => {
      const { actionId, extensionIdentifier, appParams } = action.payload;

      debug(`Handling OpenPopup action with ID: %s, identifier: %s`, actionId, extensionIdentifier);

      if (target !== "WIDGET") {
        console.error(
          `openPopup action is only allowed from WIDGET extensions, but was sent from a "${target}" frame.`,
          { appId, extensionIdentifier },
        );

        return createResponseStatus(actionId, false);
      }

      const result = openPopupByIdentifier({
        requestingAppId: appId,
        extensionIdentifier,
        appParams,
      });

      if (!result.ok) {
        console.error(`openPopup action failed: ${result.reason}`, { appId, extensionIdentifier });

        return createResponseStatus(actionId, false);
      }

      return createResponseStatus(actionId, true);
    },
  };
};

export const AppActionsHandler = {
  useHandleNotificationAction,
  useHandleOpenPopupAction,
  useHandleRefreshEntityAction,
  useHandleUpdateRoutingAction,
  useHandleRedirectAction,
  useNotifyReadyAction,
  createResponseStatus,
  useHandlePermissionRequest,
  useHandleAppFormUpdate,
  useHandlePopupCloseAction,
  useHandleWidgetResizeAction,
};
