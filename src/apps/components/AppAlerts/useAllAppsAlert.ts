import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { PermissionEnum, useAppFailedPendingWebhooksQuery } from "@dashboard/graphql";

const requiredPermissions = [PermissionEnum.MANAGE_APPS];

interface FailedWebhooksCount {
  failed: number;
  pending: number;
}

const defaultFailedWebhooksCount: FailedWebhooksCount = {
  failed: 0,
  pending: 0,
};

export const useAllAppsAlert = (): FailedWebhooksCount => {
  const permissions = useUserPermissions();
  const hasRequiredPermissions = requiredPermissions.some(permission =>
    permissions?.map(e => e.code)?.includes(permission),
  );

  const { data } = useAppFailedPendingWebhooksQuery({
    skip: !hasRequiredPermissions,
  });

  const failedWebhooksCount =
    data?.apps?.edges.reduce((acc, app) => {
      const failedWebhooks =
        app.node.webhooks?.reduce(
          (acc, webhook) => acc + (webhook?.failedDelivers?.edges?.length ?? 0),
          0,
        ) ?? 0;

      const pendingWebhooks =
        app.node.webhooks?.reduce(
          (acc, webhook) => acc + (webhook?.pendingDelivers?.edges?.length ?? 0),
          0,
        ) ?? 0;

      return {
        failed: acc.failed + failedWebhooks,
        pending: acc.pending + pendingWebhooks,
      };
    }, defaultFailedWebhooksCount) ?? defaultFailedWebhooksCount;

  return failedWebhooksCount;
};
