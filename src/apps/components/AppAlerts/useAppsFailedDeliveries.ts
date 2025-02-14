import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { PermissionEnum, useAppFailedPendingWebhooksLazyQuery } from "@dashboard/graphql";
import { useMemo } from "react";

import { webhookFailedAttemptsCheck } from "./utils";

interface AppsFailedDeliveries {
  hasFailed: boolean;
  fetchAppsWebhooks: () => void;
}

const requiredPermissions = [PermissionEnum.MANAGE_APPS];

export const useAppsFailedDeliveries = (): AppsFailedDeliveries => {
  const permissions = useUserPermissions();
  const hasRequiredPermissions = requiredPermissions.some(permission =>
    permissions?.map(e => e.code)?.includes(permission),
  );

  const [fetchAppsWebhooks, { data }] = useAppFailedPendingWebhooksLazyQuery();

  const hasFailed = useMemo(
    () =>
      data?.apps?.edges.some(
        app =>
          app.node.webhooks?.some(webhook => {
            if (webhookFailedAttemptsCheck(webhook)) {
              return true;
            }

            return false;
          }),
        false,
      ) ?? false,
    [data],
  );

  const handleFetchAppsWebhooks = () => {
    if (hasRequiredPermissions) {
      fetchAppsWebhooks();
    }
  };

  return {
    hasFailed,
    fetchAppsWebhooks: handleFetchAppsWebhooks,
  };
};
