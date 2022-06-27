import { Actions, DispatchResponseEvent, Events } from "@saleor/app-bridge";
import useNavigator from "@saleor/hooks/useNavigator";
import React from "react";
import { useIntl } from "react-intl";

import { useExternalApp } from "../ExternalAppContext";

const sendResponseStatus = (
  actionId: string,
  ok: boolean,
): DispatchResponseEvent => ({
  type: "response",
  payload: {
    actionId,
    ok,
  },
});

export const useAppActions = (
  frameEl: React.MutableRefObject<HTMLIFrameElement>,
  appOrigin: string,
) => {
  const navigate = useNavigator();
  const { closeApp } = useExternalApp();
  const intl = useIntl();

  const actionReducer = (
    action: Actions | undefined,
  ): DispatchResponseEvent => {
    switch (action?.type) {
      case "redirect": {
        const { to, newContext, actionId } = action.payload;

        let success = true;

        try {
          if (newContext) {
            window.open(to);
          } else if (to.startsWith("/")) {
            navigate(to);
            closeApp();
          } else {
            const isExternalDomain =
              new URL(to).hostname !== window.location.hostname;

            if (isExternalDomain) {
              success = window.confirm(
                intl.formatMessage({
                  id: "MSItJD",
                  defaultMessage:
                    "You are about to leave the Dashboard. Do you want to continue?",
                }),
              );
            }

            if (success) {
              window.location.href = to;
            }
          }
        } catch (e) {
          success = false;
        }

        return sendResponseStatus(actionId, success);
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
    postToExtension,
  };
};
