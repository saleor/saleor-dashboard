import { AppActionsHandler } from "@dashboard/apps/components/AppFrame/appActionsHandler";
import {
  Actions,
  DispatchResponseEvent,
  Events,
} from "@saleor/app-sdk/app-bridge";
import React from "react";

export const useAppActions = (
  frameEl: React.MutableRefObject<HTMLIFrameElement | null>,
  appOrigin: string,
  appId: string,
) => {
  const { handle: handleNotification } =
    AppActionsHandler.useHandleNotificationAction();
  const { handle: handleUpdateRouting } =
    AppActionsHandler.useUpdateRoutingAction(appId);
  const { handle: handleRedirect } =
    AppActionsHandler.useHandleRedirectAction(appId);

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
      case "notifyReady": {
        console.warn("Not implemented");
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
        const response = handleAction(event.data);

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
