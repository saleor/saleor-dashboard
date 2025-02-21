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

type LatestWebhookDelivery =
  | NonNullable<Webhook["failedDelivers"]>["edges"][0]["node"]
  | NonNullable<
      NonNullable<Webhook["pendingDelivers"]>["edges"][0]["node"]["attempts"]
    >["edges"][0]["node"];

type LatestWebhookDeliveryWithMoment = LatestWebhookDelivery & { createdAt: moment.Moment };

const toWebhookDeliveryWithMoment = (
  delivery: LatestWebhookDelivery | null | undefined,
): LatestWebhookDeliveryWithMoment | null =>
  delivery
    ? {
        ...delivery,
        createdAt: moment(delivery.createdAt),
      }
    : null;

const getLatestFailedAttemptFromWebhook = (
  webhook: Webhook,
): LatestWebhookDeliveryWithMoment | null => {
  const fromFailedDelivers = toWebhookDeliveryWithMoment(webhook.failedDelivers?.edges?.[0]?.node);
  const fromPendingDelivers = toWebhookDeliveryWithMoment(
    webhook.pendingDelivers?.edges?.[0]?.node.attempts?.edges.find(
      ({ node: { status } }) => status === EventDeliveryStatusEnum.FAILED,
    )?.node,
  );

  if (fromFailedDelivers && fromPendingDelivers) {
    const isFailedNewer = fromFailedDelivers?.createdAt.isAfter(fromPendingDelivers?.createdAt);

    return isFailedNewer ? fromFailedDelivers : fromPendingDelivers;
  }

  if (fromFailedDelivers) {
    return fromFailedDelivers;
  }

  if (fromPendingDelivers) {
    return fromPendingDelivers;
  }

  return null;
};

export const getLatestFailedAttemptFromWebhooks = (webhooks: Webhook[]) =>
  webhooks
    .map(getLatestFailedAttemptFromWebhook)
    .filter(Boolean)
    .sort((a, b) => b?.createdAt.diff(a?.createdAt))[0] ?? null;
