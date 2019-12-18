import { WebhookListUrlSortField } from "@saleor/webhooks/urls";
import { WebhookSortField } from "@saleor/types/globalTypes";
import { createGetSortQueryVariables } from "@saleor/utils/sort";

export function getSortQueryField(
  sort: WebhookListUrlSortField
): WebhookSortField {
  switch (sort) {
    case WebhookListUrlSortField.name:
      return WebhookSortField.NAME;
    case WebhookListUrlSortField.serviceAccount:
      return WebhookSortField.SERVICE_ACCOUNT;
    default:
      return undefined;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(
  getSortQueryField
);
