import { ServiceListUrlSortField } from "@saleor/services/urls";
import { ServiceAccountSortField } from "@saleor/types/globalTypes";
import { createGetSortQueryVariables } from "@saleor/utils/sort";

export function getSortQueryField(
  sort: ServiceListUrlSortField
): ServiceAccountSortField {
  switch (sort) {
    case ServiceListUrlSortField.name:
      return ServiceAccountSortField.NAME;
    default:
      return undefined;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(
  getSortQueryField
);
