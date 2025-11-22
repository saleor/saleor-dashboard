// @ts-strict-ignore
import { MenuSortField } from "@dashboard/graphql";
import { MenuListUrlSortField } from "@dashboard/structures/urls";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

function getSortQueryField(sort: MenuListUrlSortField): MenuSortField {
  switch (sort) {
    case MenuListUrlSortField.name:
      return "NAME";
    case MenuListUrlSortField.items:
      return "ITEMS_COUNT";
    default:
      return undefined;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
