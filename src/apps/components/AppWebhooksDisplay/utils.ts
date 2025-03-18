import { AppWebhookDeliveriesQuery } from "@dashboard/graphql";

export type Webhook = NonNullable<NonNullable<AppWebhookDeliveriesQuery["app"]>["webhooks"]>[0];

const getLatestDate = (webhook: Webhook): string | undefined => {
  const attemptDate: string | undefined =
    webhook.eventDeliveries?.edges?.[0]?.node?.attempts?.edges?.[0]?.node?.createdAt;
  const deliveryDate: string | undefined = webhook.eventDeliveries?.edges?.[0]?.node?.createdAt;

  if (attemptDate && deliveryDate) {
    return attemptDate > deliveryDate ? attemptDate : deliveryDate;
  }

  return attemptDate || deliveryDate;
};

export const sortWebhooksByDeliveries = (a: Webhook, b: Webhook): number => {
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
