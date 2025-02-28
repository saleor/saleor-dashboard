import { useAppFailedPendingWebhooksLazyQuery } from "@dashboard/graphql";
import moment from "moment-timezone";
import { useMemo } from "react";

import { getLatestFailedAttemptFromWebhooks, LatestWebhookDeliveryWithMoment } from "./utils";

interface AppsFailedDeliveries {
  hasFailed: boolean;
  fetchAppsWebhooks: () => void;
  lastFailedWebhookDate: moment.Moment | null;
}

export const useAppsFailedDeliveries = (): AppsFailedDeliveries => {
  const [fetchAppsWebhooks, { data }] = useAppFailedPendingWebhooksLazyQuery({
    fetchPolicy: "no-cache",
  });

  const lastFailedWebhookDate: moment.Moment | null = useMemo(
    () =>
      data?.apps?.edges.reduce<LatestWebhookDeliveryWithMoment | null>((acc, app) => {
        const latestFailedAttempt = getLatestFailedAttemptFromWebhooks(app.node.webhooks ?? []);

        if (!latestFailedAttempt) {
          return acc;
        }

        if (!acc) {
          return latestFailedAttempt;
        }

        return latestFailedAttempt.createdAt.isAfter(acc.createdAt) ? latestFailedAttempt : acc;
      }, null)?.createdAt ?? null,
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
