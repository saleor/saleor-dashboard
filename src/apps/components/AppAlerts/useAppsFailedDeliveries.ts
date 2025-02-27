import { useAppFailedPendingWebhooksLazyQuery } from "@dashboard/graphql";
import { Moment } from "moment";
import { useMemo } from "react";

import { getLatestFailedAttemptFromWebhooks } from "./utils";

interface AppsFailedDeliveries {
  hasFailed: boolean;
  fetchAppsWebhooks: () => void;
  lastFailedWebhookDate: Moment | null;
}

export const useAppsFailedDeliveries = (): AppsFailedDeliveries => {
  const [fetchAppsWebhooks, { data }] = useAppFailedPendingWebhooksLazyQuery({
    fetchPolicy: "no-cache",
  });

  const lastFailedWebhookDate = useMemo(
    () =>
      data?.apps?.edges.reduce((acc, app) => {
        const latestFailedAttempt = getLatestFailedAttemptFromWebhooks(app.node.webhooks ?? []);

        if (!latestFailedAttempt) {
          return acc;
        }

        if (!acc) {
          return latestFailedAttempt.createdAt;
        }

        return latestFailedAttempt.createdAt > acc ? latestFailedAttempt : acc;
      }, null) ?? null,
    [data?.apps?.edges],
  );

  const handleFetchAppsWebhooks = () => {
    // Permissions are checked outside of this hook
    fetchAppsWebhooks({
      variables: {
        canFetchAppEvents: true,
      },
    });
  };

  return {
    hasFailed: !!lastFailedWebhookDate,
    lastFailedWebhookDate,
    fetchAppsWebhooks: handleFetchAppsWebhooks,
  };
};
