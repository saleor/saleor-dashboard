import { AppEventDeliveriesFragment, EventDeliveryStatusEnum } from "@dashboard/graphql";

type Webhook = NonNullable<AppEventDeliveriesFragment["webhooks"]>[0];

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

export const webhookFailedAttemptsCheck = (webhook: Webhook) =>
  hasFailedAttemptsCheck(webhook) || hasFailedAttemptsInPendingCheck(webhook);
