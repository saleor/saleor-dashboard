import { AppActionsHandler } from "@dashboard/apps/components/AppFrame/appActionsHandler";
import { usePostToExtension } from "@dashboard/apps/components/AppFrame/usePostToExtension";
import { Actions, DispatchResponseEvent } from "@saleor/app-sdk/app-bridge";
import React, { useState } from "react";

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
  /**
   * Store if app has performed a handshake with Dashboard, to avoid sending events before that
   */
  const [handshakeDone, setHandshakeDone] = useState(false);
  const handleAction = (action: Actions | undefined): DispatchResponseEvent => {
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
      default: {
        throw new Error("Unknown action type");
      }
    }
  };

  React.useEffect(() => {
    const handler = (event: MessageEvent<Actions>) => {
      if (event.origin === appOrigin) {
        const response = handleAction(event.data);

        postToExtension(response);
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
