import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import { useIntervalActionWithState } from "@dashboard/hooks/useIntervalActionWithState";
import moment from "moment-timezone";
import { useEffect } from "react";

import { useAppsFailedDeliveries } from "./useAppsFailedDeliveries";
import { useSidebarDotState } from "./useSidebarDotState";

const DELIVERIES_FETCHING_INTERVAL = 5 * 60 * 1000; // 5 minutes

/** @todo Move to extensions/* or sidebar */
export const useAppsAlert = () => {
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();
  const { hasNewFailedAttempts, handleFailedAttempt, handleAppsListItemClick } =
    useSidebarDotState();
  const { lastFailedWebhookDate, fetchAppsWebhooks } = useAppsFailedDeliveries();

  useIntervalActionWithState({
    action: fetchAppsWebhooks,
    interval: DELIVERIES_FETCHING_INTERVAL,
    key: "webhook_deliveries_last_fetched",
    skip: !hasManagedAppsPermission,
  });

  useEffect(() => {
    if (lastFailedWebhookDate && lastFailedWebhookDate instanceof moment) {
      handleFailedAttempt(lastFailedWebhookDate.toISOString());
    }
  }, [lastFailedWebhookDate]);

  return {
    hasNewFailedAttempts,
    handleAppsListItemClick,
  };
};
