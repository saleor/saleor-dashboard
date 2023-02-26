import { AppActionsHandler } from "@dashboard/apps/components/AppFrame/appActionsHandler";
import {
  Actions,
  DispatchResponseEvent,
  Events,
} from "@saleor/app-sdk/app-bridge";
import React, { useRef, useState } from "react";

export const useAppActions = (
  frameEl: React.MutableRefObject<HTMLIFrameElement | null>,
  appOrigin: string,
  appId: string,
  appToken: string,
) => {
  const { handle: handleNotification } =
    AppActionsHandler.useHandleNotificationAction();
  const { handle: handleUpdateRouting } =
    AppActionsHandler.useHandleUpdateRoutingAction(appId);
  const { handle: handleRedirect } =
    AppActionsHandler.useHandleRedirectAction(appId);
  const [handshakeDone, setHandshakeDone] = useState(false);

  const postToExtension = (event: Events) => {
    console.log({ handshakeDone });

    if (frameEl?.current?.contentWindow) {
      console.log(`event ${event.type}`);
      try {
        frameEl.current.contentWindow.postMessage(event, appOrigin);
      } catch (e) {
        console.info(e);
      }
    }
  };

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
        console.log("notifyReady");
        postToExtension({
          type: "handshake",
          payload: {
            token: appToken,
            version: 1,
          },
        });

        setHandshakeDone(true);

        // move somewhere todo
        return {
          type: "response",
          payload: {
            actionId: action.payload.actionId,
            ok: true,
          },
        };
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
  }, []);

  return {
    handshakeDone,
    postToExtension,
    setHandshakeDone,
  };
};
