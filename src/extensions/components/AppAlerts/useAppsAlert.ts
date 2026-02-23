import { useAppHasProblemsLazyQuery } from "@dashboard/graphql";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import { useIntervalActionWithState } from "@dashboard/hooks/useIntervalActionWithState";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import moment from "moment-timezone";
import { useCallback, useEffect, useMemo } from "react";

import { useAppsFailedDeliveries } from "./useAppsFailedDeliveries";
import { useSidebarDotState } from "./useSidebarDotState";

const DELIVERIES_FETCHING_INTERVAL = 5 * 60 * 1000; // 5 minutes

/** @todo Move to extensions/* or sidebar */
export const useAppsAlert = () => {
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();
  const { hasNewFailedAttempts, handleFailedAttempt, handleAppsListItemClick } =
    useSidebarDotState();
  const { lastFailedWebhookDate, fetchAppsWebhooks } = useAppsFailedDeliveries();

  const [fetchHasAppsAnyProblems, { data: appProblemsData }] = useAppHasProblemsLazyQuery({
    fetchPolicy: "no-cache",
  });

  const hasAppProblems = useMemo(() => {
    const apps = mapEdgesToItems(appProblemsData?.apps) ?? [];

    return apps.some(app => (app.problems?.length ?? 0) > 0);
  }, [appProblemsData?.apps]);

  const fetchAll = useCallback(() => {
    fetchAppsWebhooks();

    fetchHasAppsAnyProblems({ variables: { first: 100 } });
  }, [fetchAppsWebhooks, fetchHasAppsAnyProblems]);

  // Fetch immediately on mount
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

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
  }, [lastFailedWebhookDate, handleFailedAttempt]);

  return {
    hasProblems: hasNewFailedAttempts || hasAppProblems,
    handleAppsListItemClick,
  };
};
