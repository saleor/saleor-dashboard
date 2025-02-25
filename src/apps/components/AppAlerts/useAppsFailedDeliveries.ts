import { useAppFailedPendingWebhooksLazyQuery } from "@dashboard/graphql";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import { useMemo } from "react";

import { webhookFailedAttemptsCheck } from "./utils";

interface AppsFailedDeliveries {
  hasFailed: boolean;
  fetchAppsWebhooks: () => void;
}

export const useAppsFailedDeliveries = (): AppsFailedDeliveries => {
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();

  const [fetchAppsWebhooks, { data }] = useAppFailedPendingWebhooksLazyQuery();

  const hasFailed = useMemo(
    () =>
      data?.apps?.edges.some(app => app.node.webhooks?.some(webhookFailedAttemptsCheck), false) ??
      false,
    [data],
  );

  const handleFetchAppsWebhooks = () => {
    // TODO: checking if webhooks should be fetched will be extracted out of this hook in a separate ticket
    fetchAppsWebhooks({
      variables: {
        canFetchAppEvents: hasManagedAppsPermission,
      },
    });
  };

  return {
    hasFailed,
    fetchAppsWebhooks: handleFetchAppsWebhooks,
  };
};
