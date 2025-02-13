import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import {
  AppFailedPendingWebhooksQuery,
  EventDeliveryStatusEnum,
  PermissionEnum,
  useAppFailedPendingWebhooksLazyQuery,
} from "@dashboard/graphql";
import { useMemo } from "react";

type Webhook = NonNullable<
  NonNullable<AppFailedPendingWebhooksQuery["apps"]>["edges"][0]["node"]["webhooks"]
>[0];
interface AppsFailedDeliveries {
  hasFailed: boolean;
  fetchAppsWebhooks: () => void;
}

const requiredPermissions = [PermissionEnum.MANAGE_APPS];

const hasFailedAttemptsCheck = (webhook: Webhook) =>
  webhook.failedDelivers && webhook.failedDelivers?.edges?.length > 0;
const hasFailedAttemptsInPendingCheck = (webhook: Webhook) => {
  const preliminaryCheck = webhook.pendingDelivers && webhook.pendingDelivers?.edges?.length > 0;

  if (!preliminaryCheck) return false;

  return webhook.pendingDelivers?.edges.some(edge =>
    edge.node?.attempts?.edges.some(
      attempt => attempt.node.status === EventDeliveryStatusEnum.FAILED,
    ),
  );
};

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
            if (hasFailedAttemptsCheck(webhook) || hasFailedAttemptsInPendingCheck(webhook)) {
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
