import { AppEventDeliveriesFragment, EventDeliveryStatusEnum } from "@dashboard/graphql";
import moment from "moment";

export type Webhook = NonNullable<AppEventDeliveriesFragment["webhooks"]>[0];

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

const getLatestFailedAttemptFromWebhook = (webhook: Webhook) => {
  const fromFailedDelivers = webhook.failedDelivers?.edges?.[0]?.node;
  const fromPendingDelivers = webhook.pendingDelivers?.edges?.[0]?.node.attempts?.edges?.[0]?.node;

  if (fromFailedDelivers && fromPendingDelivers) {
    return moment(fromFailedDelivers?.createdAt).isAfter(moment(fromPendingDelivers?.createdAt))
      ? fromFailedDelivers
      : fromPendingDelivers;
  } else if (fromFailedDelivers) {
    return fromFailedDelivers;
  } else if (fromPendingDelivers) {
    return fromPendingDelivers;
  } else {
    return null;
  }
};

export const getLatestFailedAttemptFromWebhooks = (webhooks: Webhook[]) =>
  webhooks
    .map(getLatestFailedAttemptFromWebhook)
    .filter(Boolean)
    .sort((a, b) => moment(b?.createdAt).diff(a?.createdAt))[0] ?? null;
