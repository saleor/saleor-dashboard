import { AppWebhookDeliveriesQuery } from "@dashboard/graphql";

export type Webhook = NonNullable<NonNullable<AppWebhookDeliveriesQuery["app"]>["webhooks"]>[0];

export const sortWebhooksByFailedDeliveries = (a: Webhook, b: Webhook) => {
  const deliveriesOne = a.eventDeliveries?.edges?.length ?? 0;
  const deliveriesTwo = b.eventDeliveries?.edges?.length ?? 0;

  if (deliveriesOne > 0 && deliveriesTwo === 0) {
    return -1;
  }

  if (deliveriesOne === 0 && deliveriesTwo > 0) {
    return 1;
  }

  return 0;
};
