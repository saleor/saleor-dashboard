import { useEffect } from "react";

import { useAppsFailedDeliveries } from "./useAppsFailedDeliveries";
import { useSidebarDotState } from "./useSidebarDotState";

export const useAppsAlert = () => {
  const { hasNewFailedAttempts, handleFailedAttempt } = useSidebarDotState();
  const { lastFailedWebhookDate, fetchAppsWebhooks } = useAppsFailedDeliveries();

  // TODO: Implement fetching at intervals
  useEffect(() => {
    fetchAppsWebhooks();
  }, []);

  useEffect(() => {
    if (lastFailedWebhookDate) {
      handleFailedAttempt(lastFailedWebhookDate.toISOString());
    }
  }, [lastFailedWebhookDate]);

  return {
    hasNewFailedAttempts,
  };
};
