import { useAppFailedPendingWebhooksLazyQuery } from "@dashboard/graphql";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import { Moment } from "moment";
import { useMemo } from "react";

import { getLatestFailedAttemptFromWebhooks } from "./utils";

interface AppsFailedDeliveries {
  hasFailed: boolean;
  fetchAppsWebhooks: () => void;
  lastFailedWebhookDate: Moment | null;
}

export const useAppsFailedDeliveries = (): AppsFailedDeliveries => {
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();

  const [fetchAppsWebhooks, { data }] = useAppFailedPendingWebhooksLazyQuery();

  const lastFailedWebhookDate = useMemo(
    () =>
      data?.apps?.edges.reduce(
        (acc, app) => {
          const latestFailedAttempt = getLatestFailedAttemptFromWebhooks(app.node.webhooks ?? []);

          if (!latestFailedAttempt) {
            return acc;
          }

          if (!acc) {
            return latestFailedAttempt.createdAt;
          }

          return latestFailedAttempt.createdAt > acc ? latestFailedAttempt : acc;
        },
        null as Moment | null,
      ) ?? null,
    [data?.apps?.edges],
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
    hasFailed: !!lastFailedWebhookDate,
    lastFailedWebhookDate,
    fetchAppsWebhooks: handleFetchAppsWebhooks,
  };
};
