import { Actions, DispatchResponseEvent, Events } from "@saleor/app-bridge";
import useNavigator from "@saleor/hooks/useNavigator";
import React from "react";

import { useExternalApp } from "../ExternalAppContext";

const sendResponseStatus = (
  actionId: string,
  ok: boolean
): DispatchResponseEvent => ({
  type: "response",
  payload: {
    actionId,
    ok
  }
});

export const useAppActions = (
  frameEl: React.MutableRefObject<HTMLIFrameElement>,
  appOrigin: string
) => {
  const navigate = useNavigator();
  const { closeApp } = useExternalApp();

  const actionReducer = (
    action: Actions | undefined
  ): DispatchResponseEvent => {
    switch (action?.type) {
      case "redirect": {
        const { to, newContext, actionId } = action.payload;

        if (newContext) {
          window.open(to);
        } else if (to.startsWith("/")) {
          navigate(to);
          closeApp();
        } else {
          window.location.href = to;
        }

        return sendResponseStatus(actionId, true);
      }
      default: {
        return sendResponseStatus(action?.payload?.actionId, false);
      }
    }
  };

  const postToExtension = (event: Events) => {
    if (frameEl.current) {
      frameEl.current.contentWindow.postMessage(event, appOrigin);
    }
  };

  React.useEffect(() => {
    const handler = (event: MessageEvent<Actions>) => {
      if (event.origin === appOrigin) {
        const response = actionReducer(event.data);

        postToExtension(response);
      }
    };

    window.addEventListener("message", handler);

    return () => {
      window.removeEventListener("message", handler);
    };
  }, []);

  return {
    postToExtension
  };
};
