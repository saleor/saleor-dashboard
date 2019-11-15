import {
  findNode,
  getNode,
  permuteNode
} from "@saleor/navigation/components/MenuDetailsPage/tree";
import { MenuItemMove } from "@saleor/navigation/types/MenuItemMove";
import {
  MenuItemCreateInput,
  MenuItemInput,
  MenuItemMoveInput
} from "../../../types/globalTypes";
import { MenuItemDialogFormData } from "../../components/MenuItemDialog";
import { unknownTypeError } from "../../components/MenuItems";
import {
  MenuDetails_menu,
  MenuDetails_menu_items
} from "../../types/MenuDetails";

export function getMenuItemInputData(
  data: MenuItemDialogFormData
): MenuItemInput {
  const variables: MenuItemInput = {
    name: data.name
  };
  switch (data.type) {
    case "category":
      variables.category = data.id;
      break;

    case "collection":
      variables.collection = data.id;
      break;

    case "page":
      variables.page = data.id;
      break;

    case "link":
      variables.url = data.id;
      break;

    default:
      throw unknownTypeError;
  }

  return variables;
}

export function getMenuItemCreateInputData(
  menu: string,
  data: MenuItemDialogFormData
): MenuItemCreateInput {
  const variables: MenuItemCreateInput = {
    menu,
    name: data.name
  };
  switch (data.type) {
    case "category":
      variables.category = data.id;
      break;

    case "collection":
      variables.collection = data.id;
      break;

    case "page":
      variables.page = data.id;
      break;

    case "link":
      variables.url = data.id;
      break;

    default:
      throw unknownTypeError;
  }

  return variables;
}

export function getInitialDisplayValue(item: MenuDetails_menu_items): string {
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

export function findMenuItem(
  id: string,
  data: MenuDetails_menu
): MenuDetails_menu_items {
  return getNode(data.items, findNode(data.items, id));
}

export function getItemMoveOptimisticResponse(
  menu: MenuDetails_menu,
  move: MenuItemMoveInput
): MenuItemMove {
  return {
    menuItemMove: {
      __typename: "MenuItemMove",
      errors: [],
      menu: {
        ...menu,
        items: permuteNode(menu.items, {
          id: move.itemId,
          parentId: move.parentId,
          sortOrder: move.sortOrder
        })
      }
    }
  };
}
