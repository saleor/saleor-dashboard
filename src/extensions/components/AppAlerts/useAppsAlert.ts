import { useInstalledAppsListLazyQuery } from "@dashboard/graphql";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import { useIntervalActionWithState } from "@dashboard/hooks/useIntervalActionWithState";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import moment from "moment-timezone";
import { useEffect, useMemo } from "react";

import { useAppsFailedDeliveries } from "./useAppsFailedDeliveries";
import { useSidebarDotState } from "./useSidebarDotState";

const DELIVERIES_FETCHING_INTERVAL = 5 * 60 * 1000; // 5 minutes

/** @todo Move to extensions/* or sidebar */
export const useAppsAlert = () => {
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();
  const { hasNewFailedAttempts, handleFailedAttempt, handleAppsListItemClick } =
    useSidebarDotState();
  const { lastFailedWebhookDate, fetchAppsWebhooks } = useAppsFailedDeliveries();

  const [fetchInstalledApps, { data: installedAppsData }] = useInstalledAppsListLazyQuery({
    fetchPolicy: "no-cache",
  });

  const hasAppProblems = useMemo(() => {
    const apps = mapEdgesToItems(installedAppsData?.apps) ?? [];

    return apps.some(app => (app.problems?.length ?? 0) > 0);
  }, [installedAppsData?.apps]);

  const fetchAll = () => {
    fetchAppsWebhooks();

    if (hasManagedAppsPermission) {
      fetchInstalledApps({ variables: { first: 100 } });
    }
  };

  // Fetch immediately on mount
  useEffect(() => {
    if (hasManagedAppsPermission) {
      fetchAll();
    }
  }, [hasManagedAppsPermission]);

  useIntervalActionWithState({
    action: fetchAll,
    interval: DELIVERIES_FETCHING_INTERVAL,
    key: "webhook_deliveries_last_fetched",
    skip: !hasManagedAppsPermission,
  });

  useEffect(() => {
    if (lastFailedWebhookDate && lastFailedWebhookDate instanceof moment) {
      handleFailedAttempt(lastFailedWebhookDate.toISOString());
    }
  }, [lastFailedWebhookDate]);

  useEffect(() => {
    if (hasAppProblems) {
      handleFailedAttempt(new Date().toISOString());
    }
  }, [hasAppProblems]);

  return {
    hasNewFailedAttempts: hasNewFailedAttempts || hasAppProblems,
    handleAppsListItemClick,
  };
};
