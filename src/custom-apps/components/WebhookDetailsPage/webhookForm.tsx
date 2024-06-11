import { WebhookDetailsFragment } from "@dashboard/graphql";

import { WebhookFormData } from "./WebhookDetailsPage";

export const getWebhookFormInitialFormValues = ({
  webhook,
  prettifiedQuery,
}: {
  webhook: WebhookDetailsFragment | null | undefined;
  prettifiedQuery: string;
}): WebhookFormData => ({
  syncEvents: webhook?.syncEvents?.map(event => event.eventType) ?? [],
  asyncEvents: webhook?.asyncEvents?.map(event => event.eventType) ?? [],
  isActive: webhook?.isActive ?? true,
  name: webhook?.name ?? "",
  secretKey: webhook?.secretKey ?? "",
  targetUrl: webhook?.targetUrl ?? "",
  subscriptionQuery: prettifiedQuery ?? "",
  customHeaders: webhook?.customHeaders ?? "{}",
});
