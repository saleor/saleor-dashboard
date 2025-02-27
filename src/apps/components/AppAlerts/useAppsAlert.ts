import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import { useIntervalActionWithState } from "@dashboard/hooks/useIntervalActionWithState";
import { useEffect } from "react";

import { useAppsFailedDeliveries } from "./useAppsFailedDeliveries";
import { useSidebarDotState } from "./useSidebarDotState";

const DELIVERIES_FETCHING_INTERVAL = 5 * 60 * 1000; // 5 minutes

export const useAppsAlert = () => {
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();
  const { hasNewFailedAttempts, handleFailedAttempt } = useSidebarDotState();
  const { lastFailedWebhookDate, fetchAppsWebhooks } = useAppsFailedDeliveries();

  useIntervalActionWithState({
    action: fetchAppsWebhooks,
    interval: DELIVERIES_FETCHING_INTERVAL,
    key: "webhook_deliveries_last_fetched",
    skip: !hasManagedAppsPermission,
  });

  useEffect(() => {
    if (lastFailedWebhookDate) {
      handleFailedAttempt(lastFailedWebhookDate.toISOString());
    }
  }, [lastFailedWebhookDate]);

  return {
    hasNewFailedAttempts,
  };
};
