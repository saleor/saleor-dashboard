import { useEffect } from "react";

import { useAppsFailedDeliveries } from "./useAppsFailedDeliveries";

export const useAppsAlert = () => {
  const { hasFailed, fetchAppsWebhooks } = useAppsFailedDeliveries();

  // TODO: Implement fetching at intervals
  useEffect(() => {
    fetchAppsWebhooks();
  }, []);

  return {
    hasFailedAttempts: hasFailed,
  };
};
