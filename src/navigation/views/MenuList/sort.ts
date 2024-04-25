// @ts-strict-ignore
import { MenuSortField } from "@dashboard/graphql";
import { MenuListUrlSortField } from "@dashboard/navigation/urls";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

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

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
