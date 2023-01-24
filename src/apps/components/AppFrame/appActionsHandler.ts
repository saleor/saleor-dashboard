import useNotifier from "@dashboard/hooks/useNotifier";
import {
  DispatchResponseEvent,
  NotificationAction,
} from "@saleor/app-sdk/app-bridge";
import { useCallback } from "react";

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

const useHandleNotificationAction = () => {
  const notify = useNotifier();

  const handle = useCallback(
    (action: NotificationAction) => {
      const { actionId, ...notification } =
        action.payload as NotificationAction["payload"];

      notify({
        ...notification,
      });

      return createResponseStatus(actionId, true);
    },
    [notify],
  );

  return {
    handle,
  };
};

export const AppActionsHandler = {
  useHandleNotificationAction,
};
