import { AppEventDeliveriesFragment, EventDeliveryStatusEnum } from "@dashboard/graphql";
import moment from "moment-timezone";

export type Webhook = NonNullable<AppEventDeliveriesFragment["webhooks"]>[0];

type LatestWebhookDelivery =
  | NonNullable<Webhook["failedDelivers"]>["edges"][0]["node"]
  | NonNullable<
      NonNullable<Webhook["pendingDelivers"]>["edges"][0]["node"]["attempts"]
    >["edges"][0]["node"];

export type LatestWebhookDeliveryWithMoment = LatestWebhookDelivery & { createdAt: moment.Moment };

const toWebhookDeliveryWithMoment = (
  delivery: LatestWebhookDelivery | null | undefined,
): LatestWebhookDeliveryWithMoment | null =>
  delivery
    ? {
        ...delivery,
        createdAt: moment(delivery.createdAt),
      }
    : null;

const getLatest = (
  a: LatestWebhookDeliveryWithMoment | null,
  b: LatestWebhookDeliveryWithMoment | null,
) => {
  if (a && b) {
    return a.createdAt.isAfter(b.createdAt) ? a : b;
  }

  return a ?? b;
};

const getLatestFailedAttemptFromWebhook = (
  webhook: Webhook,
): LatestWebhookDeliveryWithMoment | null => {
  // Edge case: Saleor failed to make a single delivery attempt
  const failedEventDelivery = toWebhookDeliveryWithMoment(webhook.failedDelivers?.edges?.[0]?.node);
  const fromFailedDeliveryAttempts = toWebhookDeliveryWithMoment(
    webhook.failedDelivers?.edges?.[0]?.node?.attempts?.edges?.[0]?.node,
  );

  // handling the edge case and checking which one is newer
  const fromFailedDelivers = getLatest(failedEventDelivery, fromFailedDeliveryAttempts);

  const fromPendingDelivers = toWebhookDeliveryWithMoment(
    webhook.pendingDelivers?.edges?.[0]?.node.attempts?.edges.find(
      ({ node: { status } }) => status === EventDeliveryStatusEnum.FAILED,
    )?.node,
  );

  return getLatest(fromFailedDelivers, fromPendingDelivers);
};

export const getLatestFailedAttemptFromWebhooks = (webhooks: Webhook[]) =>
  webhooks
    .map(getLatestFailedAttemptFromWebhook)
    .filter(Boolean)
    .sort((a, b) => b?.createdAt.diff(a?.createdAt))[0] ?? null;
