import { useAppHasProblemsLazyQuery } from "@dashboard/graphql";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import { useIntervalActionWithState } from "@dashboard/hooks/useIntervalActionWithState";
import moment from "moment-timezone";
import { useCallback, useEffect, useMemo } from "react";

import { useAppsFailedDeliveries } from "./useAppsFailedDeliveries";
import { useSidebarDotState } from "./useSidebarDotState";

const DELIVERIES_FETCHING_INTERVAL = 5 * 60 * 1000; // 5 minutes

/** @todo Move to extensions/* or sidebar */
export const useAppsAlert = () => {
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();
  const {
    hasProblems: hasAppFailedDeliveries,
    handleFailedAttempt,
    handleAppsListItemClick,
  } = useSidebarDotState();
  const { lastFailedWebhookDate, fetchAppsWebhooks } = useAppsFailedDeliveries();

  const [fetchHasAppsAnyProblems, { data: appProblemsData }] = useAppHasProblemsLazyQuery({
    fetchPolicy: "no-cache",
  });

  const hasAppProblems = useMemo(() => {
    // problems field not supported by current API version
    return false;
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
    hasProblems: hasAppFailedDeliveries || hasAppProblems,
    handleAppsListItemClick,
  };
};
