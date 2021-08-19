import { Actions, DispatchResponseEvent, Events } from "@saleor/app-bridge";
import useNavigator from "@saleor/hooks/useNavigator";
import React from "react";

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
  frameEl: HTMLIFrameElement,
  appOrigin: string
) => {
  const navigate = useNavigator();

  const actionReducer = (action: Actions | undefined) => {
    switch (action?.type) {
      case "redirect": {
        const { to, newTab, actionId } = action.payload;

        if (to.startsWith("/") && !newTab) {
          navigate(to);
        } else {
          window.open(to);
        }

        sendResponseStatus(actionId, true);
        return;
      }
      default: {
        sendResponseStatus(action?.payload?.actionId, false);
        return;
      }
    }
  };

  React.useEffect(() => {
    const handler = (event: MessageEvent<Actions>) => {
      if (event.origin === appOrigin) {
        actionReducer(event.data);
      }
    };

    window.addEventListener("message", handler);

    return () => {
      window.removeEventListener("message", handler);
    };
  }, []);

  const postToExtension = (event: Events) => {
    frameEl.contentWindow.postMessage(event, appOrigin);
  };

  return {
    postToExtension
  };
};
