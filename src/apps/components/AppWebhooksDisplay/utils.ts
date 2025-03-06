import { AppWebhookDeliveriesQuery } from "@dashboard/graphql";

export type Webhook = NonNullable<NonNullable<AppWebhookDeliveriesQuery["app"]>["webhooks"]>[0];

export const sortWebhooksByDeliveries = (a: Webhook, b: Webhook) => {
  const deliveriesA = a.eventDeliveries?.edges?.length ?? 0;
  const deliveriesB = b.eventDeliveries?.edges?.length ?? 0;

  // desc
  return deliveriesB - deliveriesA;
};
