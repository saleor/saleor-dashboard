import { appPath } from "@dashboard/apps/urls";
import { getAppMountUri } from "@dashboard/config";
import useNotifier from "@dashboard/hooks/useNotifier";
import {
  DispatchResponseEvent,
  NotificationAction,
  UpdateRouting,
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

const useUpdateRoutingAction = (appId: string) => ({
  handle: useCallback(
    (action: UpdateRouting) => {
      const { newRoute, actionId } = action.payload;

      const appCompletePath = new URL(
        appPath(encodeURIComponent(appId)),
        getAppMountUri(),
      ).href;

      window.history.pushState(null, "", appCompletePath + newRoute);

      return createResponseStatus(actionId, true);
    },
    [appId],
  ),
});

export const AppActionsHandler = {
  useHandleNotificationAction,
  useUpdateRoutingAction,
};
