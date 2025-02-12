import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { PermissionEnum, useAppFailedPendingWebhooksQuery } from "@dashboard/graphql";
import { useMemo } from "react";

const requiredPermissions = [PermissionEnum.MANAGE_APPS];

interface FailedWebhooksCount {
  hasFailed: boolean;
  hasPending: boolean;
}

const defaultFailedWebhooksInfo: FailedWebhooksCount = {
  hasFailed: false,
  hasPending: false,
};

export const useAllAppsAlert = (): FailedWebhooksCount => {
  const permissions = useUserPermissions();
  const hasRequiredPermissions = requiredPermissions.some(permission =>
    permissions?.map(e => e.code)?.includes(permission),
  );

  const { data } = useAppFailedPendingWebhooksQuery({
    skip: !hasRequiredPermissions,
  });

  const failedWebhooksInfo = useMemo(
    () =>
      data?.apps?.edges.reduce((acc, app) => {
        const webhookInfo = defaultFailedWebhooksInfo;

        app.node.webhooks?.forEach(webhook => {
          const { failedDelivers, pendingDelivers } = webhook;

          if (failedDelivers && failedDelivers.edges?.length > 0) {
            webhookInfo.hasFailed = true;
          }

          if (pendingDelivers && pendingDelivers.edges?.length > 0) {
            webhookInfo.hasPending = true;
          }
        });

        return {
          hasFailed: webhookInfo.hasFailed || acc.hasFailed,
          hasPending: webhookInfo.hasPending || acc.hasPending,
        };
      }, defaultFailedWebhooksInfo) ?? defaultFailedWebhooksInfo,
    [data],
  );

  return failedWebhooksInfo;
};
