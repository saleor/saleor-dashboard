import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import {
  AppFailedPendingWebhooksQuery,
  EventDeliveryStatusEnum,
  PermissionEnum,
  useAppFailedPendingWebhooksQuery,
} from "@dashboard/graphql";
import { useMemo } from "react";

type Webhook = NonNullable<
  NonNullable<AppFailedPendingWebhooksQuery["apps"]>["edges"][0]["node"]["webhooks"]
>[0];
interface FailedWebhooksCount {
  hasFailed: boolean;
  hasPending: boolean;
}

const requiredPermissions = [PermissionEnum.MANAGE_APPS];

const defaultFailedWebhooksInfo: FailedWebhooksCount = {
  hasFailed: false,
  hasPending: false,
};

const hasFailedCheck = (webhook: Webhook) =>
  webhook.failedDelivers && webhook.failedDelivers?.edges?.length > 0;
const hasPendingCheck = (webhook: Webhook) => {
  const preliminaryCheck = webhook.pendingDelivers && webhook.pendingDelivers?.edges?.length > 0;

  if (!preliminaryCheck) return false;

  return webhook.pendingDelivers?.edges.some(edge =>
    edge.node?.attempts?.edges.some(
      attempt => attempt.node.status === EventDeliveryStatusEnum.FAILED,
    ),
  );
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
          if (hasFailedCheck(webhook)) {
            webhookInfo.hasFailed = true;
          }

          if (hasPendingCheck(webhook)) {
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
