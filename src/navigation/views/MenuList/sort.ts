import { MenuSortField } from "@saleor/graphql";
import { MenuListUrlSortField } from "@saleor/navigation/urls";
import { createGetSortQueryVariables } from "@saleor/utils/sort";

export function getSortQueryField(sort: MenuListUrlSortField): MenuSortField {
  switch (sort) {
    case MenuListUrlSortField.name:
      return MenuSortField.NAME;
    case MenuListUrlSortField.items:
      return MenuSortField.ITEMS_COUNT;
    default:
      return undefined;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(
  getSortQueryField,
);
