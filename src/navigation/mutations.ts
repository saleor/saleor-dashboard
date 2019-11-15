import gql from "graphql-tag";

import makeMutation from "@saleor/hooks/makeMutation";
import { menuItemFragment, menuItemNestedFragment } from "./queries";
import {
  MenuBulkDelete,
  MenuBulkDeleteVariables
} from "./types/MenuBulkDelete";
import { MenuCreate, MenuCreateVariables } from "./types/MenuCreate";
import { MenuDelete, MenuDeleteVariables } from "./types/MenuDelete";
import {
  MenuItemCreate,
  MenuItemCreateVariables
} from "./types/MenuItemCreate";
import {
  MenuItemDelete,
  MenuItemDeleteVariables
} from "./types/MenuItemDelete";
import { MenuItemMove, MenuItemMoveVariables } from "./types/MenuItemMove";
import {
  MenuItemUpdate,
  MenuItemUpdateVariables
} from "./types/MenuItemUpdate";
import { MenuUpdate, MenuUpdateVariables } from "./types/MenuUpdate";

const menuCreate = gql`
  mutation MenuCreate($input: MenuCreateInput!) {
    menuCreate(input: $input) {
      errors {
        field
        message
      }
      menu {
        id
      }
    }
  }
`;
export const useMenuCreateMutation = makeMutation<
  MenuCreate,
  MenuCreateVariables
>(menuCreate);

const menuBulkDelete = gql`
  mutation MenuBulkDelete($ids: [ID]!) {
    menuBulkDelete(ids: $ids) {
      errors {
        field
        message
      }
    }
  }
`;
export const useMenuBulkDeleteMutation = makeMutation<
  MenuBulkDelete,
  MenuBulkDeleteVariables
>(menuBulkDelete);

const menuDelete = gql`
  mutation MenuDelete($id: ID!) {
    menuDelete(id: $id) {
      errors {
        field
        message
      }
    }
  }
`;
export const useMenuDeleteMutation = makeMutation<
  MenuDelete,
  MenuDeleteVariables
>(menuDelete);

const menuItemCreate = gql`
  ${menuItemNestedFragment}
  mutation MenuItemCreate($input: MenuItemCreateInput!) {
    menuItemCreate(input: $input) {
      errors {
        field
        message
      }
      menuItem {
        menu {
          id
          items {
            ...MenuItemNestedFragment
          }
        }
      }
    }
  }
`;
export const useMenuItemCreateMutation = makeMutation<
  MenuItemCreate,
  MenuItemCreateVariables
>(menuItemCreate);

const menuUpdate = gql`
  mutation MenuUpdate($id: ID!, $name: String) {
    menuUpdate(id: $id, input: { name: $name }) {
      errors {
        field
        message
      }
    }
  }
`;
export const useMenuUpdateMutation = makeMutation<
  MenuUpdate,
  MenuUpdateVariables
>(menuUpdate);

const menuItemMove = gql`
  mutation MenuItemMove($id: ID!, $move: MenuItemMoveInput!) {
    menuItemMove(menu: $id, moves: [$move]) {
      errors {
        field
        message
      }
    }
  }
`;
export const useMenuItemMoveMutation = makeMutation<
  MenuItemMove,
  MenuItemMoveVariables
>(menuItemMove);

const menuItemDelete = gql`
  mutation MenuItemDelete($id: ID!) {
    menuItemDelete(id: $id) {
      errors {
        field
        message
      }
    }
  }
`;
export const useMenuItemDeleteMutation = makeMutation<
  MenuItemDelete,
  MenuItemDeleteVariables
>(menuItemDelete);

const menuItemUpdate = gql`
  ${menuItemFragment}
  mutation MenuItemUpdate($id: ID!, $input: MenuItemInput!) {
    menuItemUpdate(id: $id, input: $input) {
      errors {
        field
        message
      }
      menuItem {
        ...MenuItemFragment
      }
    }
  }
`;
export const useMenuItemUpdateMutation = makeMutation<
  MenuItemUpdate,
  MenuItemUpdateVariables
>(menuItemUpdate);
