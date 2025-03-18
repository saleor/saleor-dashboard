import { AppWebhookDeliveriesQuery } from "@dashboard/graphql";

export type Webhook = NonNullable<NonNullable<AppWebhookDeliveriesQuery["app"]>["webhooks"]>[0];

export const sortWebhooksByDeliveries = (a: Webhook, b: Webhook) => {
  const getLatestDate = (webhook: Webhook) => {
    const attemptDate =
      webhook.eventDeliveries?.edges?.[0]?.node?.attempts?.edges?.[0]?.node?.createdAt;
    const deliveryDate = webhook.eventDeliveries?.edges?.[0]?.node?.createdAt;

    return attemptDate || deliveryDate;
  };

  const dateA = getLatestDate(a);
  const dateB = getLatestDate(b);

  if (!dateA && !dateB) {
    return 0;
  }

  if (!dateA) return 1;

  if (!dateB) return -1;

  // desc
  return new Date(dateB).getTime() - new Date(dateA).getTime();
};
