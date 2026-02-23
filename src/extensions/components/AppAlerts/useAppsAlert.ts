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

  const [fetchAppProblems, { data: appProblemsData }] = useAppHasProblemsLazyQuery({
    fetchPolicy: "no-cache",
  });

  const hasAppProblems = useMemo(() => {
    const apps = mapEdgesToItems(appProblemsData?.apps) ?? [];

    return apps.some(app => (app.problems?.length ?? 0) > 0);
  }, [appProblemsData?.apps]);

  const fetchAll = useCallback(() => {
    fetchAppsWebhooks();

    if (hasManagedAppsPermission) {
      fetchAppProblems({ variables: { first: 100 } });
    }
  }, [fetchAppsWebhooks, hasManagedAppsPermission, fetchAppProblems]);

  // Fetch immediately on mount
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

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
  }, [lastFailedWebhookDate, handleFailedAttempt]);

  useEffect(() => {
    // When any app reports problems, mark as a failed attempt so the sidebar dot appears.
    if (hasAppProblems) {
      handleFailedAttempt(new Date().toISOString());
    }
  }, [hasAppProblems, handleFailedAttempt]);

  return {
    // Merge all issues to detect if there is any problem
    // todo change name
    hasNewFailedAttempts: hasNewFailedAttempts || hasAppProblems,
    handleAppsListItemClick,
  };
};
