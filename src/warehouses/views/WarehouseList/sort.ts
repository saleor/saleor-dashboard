import { WarehouseSortField } from "@saleor/graphql";
import { createGetSortQueryVariables } from "@saleor/utils/sort";
import { WarehouseListUrlSortField } from "@saleor/warehouses/urls";

export function getSortQueryField(
  sort: WarehouseListUrlSortField,
): WarehouseSortField {
  switch (sort) {
    case WarehouseListUrlSortField.name:
      return WarehouseSortField.NAME;
    default:
      return undefined;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(
  getSortQueryField,
);
