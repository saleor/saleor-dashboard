import {
  MenuItemCreateInput,
  MenuItemFragment,
  MenuItemInput,
  MenuItemMoveInput,
} from "@dashboard/graphql";

import { MenuDetailsSubmitData } from "../../components/MenuDetailsPage";
import { MenuItemDialogFormData } from "../../components/MenuItemDialog";
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

export function getInitialMenutItemValue(item: MenuItemFragment): string {
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
