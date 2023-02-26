import { AppActionsHandler } from "@dashboard/apps/components/AppFrame/appActionsHandler";
import { usePostToExtension } from "@dashboard/apps/components/AppFrame/usePostToExtension";
import { Actions, DispatchResponseEvent } from "@saleor/app-sdk/app-bridge";
import React, { useState } from "react";

export const useAppActions = (
  frameEl: HTMLIFrameElement,
  appOrigin: string,
  appId: string,
  appToken: string,
) => {
  const postToExtension = usePostToExtension(frameEl, appOrigin);

  const { handle: handleNotification } =
    AppActionsHandler.useHandleNotificationAction();
  const { handle: handleUpdateRouting } =
    AppActionsHandler.useHandleUpdateRoutingAction(appId);
  const { handle: handleRedirect } =
    AppActionsHandler.useHandleRedirectAction(appId);

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
        postToExtension({
          type: "handshake",
          payload: {
            token: appToken,
            version: 1,
          },
        });

        setHandshakeDone(true);

        return AppActionsHandler.createResponseStatus(
          action.payload.actionId,
          true,
        );
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
