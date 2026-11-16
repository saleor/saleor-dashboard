import { type FetchResult } from "@apollo/client";
import {
  type MenuErrorFragment,
  type MenuItemCreateInput,
  type MenuItemFragment,
  type MenuItemInput,
  type MenuItemMoveInput,
  type MenuUpdateMutation,
} from "@dashboard/graphql";

import { type MenuDetailsSubmitData } from "../../components/MenuDetailsPage/MenuDetailsPage";
import { type MenuItemDialogFormData } from "../../components/MenuItemDialog/types";
import { unknownTypeError } from "../../components/MenuItemsSortableTree/utils";

export function getMenuItemInputData(data: MenuItemDialogFormData): MenuItemInput {
  const variables: MenuItemInput = {
    name: data.name,
  };

  switch (data.linkType) {
    case "category":
      variables.category = data.linkValue;
      break;

    case "collection":
      variables.collection = data.linkValue;
      break;

    case "page":
      variables.page = data.linkValue;
      break;

    case "link":
      variables.url = data.linkValue;
      break;

    default:
      throw unknownTypeError;
  }

  return variables;
}

export function getMenuItemCreateInputData(
  menu: string,
  data: MenuItemDialogFormData,
): MenuItemCreateInput {
  const variables: MenuItemCreateInput = {
    menu,
    name: data.name,
  };

  switch (data.linkType) {
    case "category":
      variables.category = data.linkValue;
      break;

    case "collection":
      variables.collection = data.linkValue;
      break;

    case "page":
      variables.page = data.linkValue;
      break;

    case "link":
      variables.url = data.linkValue;
      break;

    default:
      throw unknownTypeError;
  }

  return variables;
}

export function getInitialMenuItemValue(item: MenuItemFragment): string {
  if (!item) {
    return "...";
  }

  if (item.category) {
    return item.category.id;
  } else if (item.collection) {
    return item.collection.id;
  } else if (item.page) {
    return item.page.id;
  } else if (item.url) {
    return item.url;
  } else {
    return "";
  }
}

export function getInitialMenuItemLabel(item: MenuItemFragment): string {
  if (!item) {
    return "...";
  }

  if (item.category) {
    return item.category.name;
  } else if (item.collection) {
    return item.collection.name;
  } else if (item.page) {
    return item.page.title;
  } else if (item.url) {
    return item.url;
  } else {
    return "";
  }
}

export function getMoves(data: MenuDetailsSubmitData): MenuItemMoveInput[] {
  return data.operations
    .filter(operation => operation.type === "move")
    .map(move => ({
      itemId: move.id,
      parentId: move.parentId,
      sortOrder: move.sortOrder,
    }));
}

export function getRemoveIds(data: MenuDetailsSubmitData): string[] {
  return data.operations
    .filter(operation => operation.type === "remove")
    .map(operation => operation.id);
}

/**
 * Errors of a structure save, or `undefined` when the request failed outright.
 *
 * MenuDetailsPage drops its pending item moves and deletions when the save returns a list, even
 * one with errors, because part of the save may have gone through. A request that failed outright
 * saved nothing, so returning nothing keeps them for another try. The mutation hook reports the
 * failure itself and resolves without data instead of throwing.
 */
export function getMenuUpdateErrors(
  result: FetchResult<MenuUpdateMutation>,
): MenuErrorFragment[] | undefined {
  if (!result.data) {
    return undefined;
  }

  return [
    ...(result.data.menuItemBulkDelete?.errors ?? []),
    ...(result.data.menuItemMove?.errors ?? []),
    ...(result.data.menuUpdate?.errors ?? []),
  ];
}
