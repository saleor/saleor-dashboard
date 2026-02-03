import { Actions, DispatchResponseEvent } from "@saleor/app-sdk/app-bridge";
import { captureMessage } from "@sentry/react";
import { useEffect, useState } from "react";

import { AppActionsHandler } from "./appActionsHandler";
import { usePostToExtension } from "./usePostToExtension";

/**
 * TODO Refactor to named attributes
 */
export const useAppActions = (
  frameEl: HTMLIFrameElement | null,
  appOrigin: string,
  appId: string,
  appToken: string,
  versions: {
    core: string;
    dashboard: string;
  },
) => {
  const postToExtension = usePostToExtension(frameEl, appOrigin);
  const { handle: handleNotification } = AppActionsHandler.useHandleNotificationAction();
  const { handle: handleUpdateRouting } = AppActionsHandler.useHandleUpdateRoutingAction(appId);
  const { handle: handleRedirect } = AppActionsHandler.useHandleRedirectAction(appId);
  const { handle: handleNotifyReady } = AppActionsHandler.useNotifyReadyAction(
    frameEl,
    appOrigin,
    appToken,
    versions,
  );
  const { handle: handlePermissionRequest } = AppActionsHandler.useHandlePermissionRequest(appId);
  const { handle: handleAppFormUpdate } = AppActionsHandler.useHandleAppFormUpdate();
  const { handle: handlePopupClose } = AppActionsHandler.useHandlePopupCloseAction();
  /**
   * Store if app has performed a handshake with Dashboard, to avoid sending events before that
   */
  const [handshakeDone, setHandshakeDone] = useState(false);
  const handleAction = (action: Actions | undefined): DispatchResponseEvent | void => {
    switch (action?.type) {
      case "notification": {
        return handleNotification(action);
      }
      case "redirect": {
        return handleRedirect(action);
      }
      case "updateRouting": {
        return handleUpdateRouting(action);
      }
      /**
       * Send handshake after app informs its ready and mounted
       */
      case "notifyReady": {
        const response = handleNotifyReady(action);

        setHandshakeDone(true);

        return response;
      }
      case "requestPermissions": {
        return handlePermissionRequest(action);
      }
      case "formPayloadUpdate": {
        return handleAppFormUpdate(action);
      }
      case "popupClose": {
        return handlePopupClose(action);
      }
      default: {
        // @ts-expect-error this is for runtime checking
        const actionType = action?.type as string | undefined;

        captureMessage("Unknown action type requested by the App", scope => {
          scope.setLevel("warning");

          scope.setContext("action", {
            actionType,
            appId,
          });

          return scope;
        });

        console.warn(
          `${actionType} action is invalid. Check docs: https://docs.saleor.io/developer/extending/apps/developing-apps/app-sdk/app-bridge#actions`,
        );
        console.warn(`Dashboard received action from app:`, { action, appId });
      }
    }
  };

  useEffect(() => {
    const handler = (event: MessageEvent<Actions>) => {
      if (event.origin === appOrigin) {
        const response = handleAction(event.data);

        if (response) {
          postToExtension(response);
        }
      }
    };

    window.addEventListener("message", handler);

    return () => {
      window.removeEventListener("message", handler);
    };
  }, [appOrigin, handleAction, postToExtension]);

  return {
    handshakeDone,
    postToExtension,
    setHandshakeDone,
  };
};
