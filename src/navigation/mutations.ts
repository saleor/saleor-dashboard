import { menuErrorFragment } from "@saleor/fragments/errors";
import {
  menuItemFragment,
  menuItemNestedFragment
} from "@saleor/fragments/navigation";
import gql from "graphql-tag";

import { TypedMutation } from "../mutations";
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
  MenuItemUpdate,
  MenuItemUpdateVariables
} from "./types/MenuItemUpdate";
import { MenuUpdate, MenuUpdateVariables } from "./types/MenuUpdate";

const menuCreate = gql`
  ${menuErrorFragment}
  mutation MenuCreate($input: MenuCreateInput!) {
    menuCreate(input: $input) {
      errors: menuErrors {
        ...MenuErrorFragment
      }
      menu {
        id
      }
    }
  }
`;
export const MenuCreateMutation = TypedMutation<
  MenuCreate,
  MenuCreateVariables
>(menuCreate);

const menuBulkDelete = gql`
  ${menuErrorFragment}
  mutation MenuBulkDelete($ids: [ID]!) {
    menuBulkDelete(ids: $ids) {
      errors: menuErrors {
        ...MenuErrorFragment
      }
    }
  }
`;
export const MenuBulkDeleteMutation = TypedMutation<
  MenuBulkDelete,
  MenuBulkDeleteVariables
>(menuBulkDelete);

const menuDelete = gql`
  ${menuErrorFragment}
  mutation MenuDelete($id: ID!) {
    menuDelete(id: $id) {
      errors: menuErrors {
        ...MenuErrorFragment
      }
    }
  }
`;
export const MenuDeleteMutation = TypedMutation<
  MenuDelete,
  MenuDeleteVariables
>(menuDelete);

const menuItemCreate = gql`
  ${menuErrorFragment}
  ${menuItemNestedFragment}
  mutation MenuItemCreate($input: MenuItemCreateInput!) {
    menuItemCreate(input: $input) {
      errors: menuErrors {
        ...MenuErrorFragment
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
export const MenuItemCreateMutation = TypedMutation<
  MenuItemCreate,
  MenuItemCreateVariables
>(menuItemCreate);

const menuUpdate = gql`
  ${menuErrorFragment}
  mutation MenuUpdate(
    $id: ID!
    $name: String!
    $moves: [MenuItemMoveInput]!
    $removeIds: [ID]!
  ) {
    menuUpdate(id: $id, input: { name: $name }) {
      errors: menuErrors {
        ...MenuErrorFragment
      }
    }

    menuItemMove(menu: $id, moves: $moves) {
      errors: menuErrors {
        ...MenuErrorFragment
      }
    }

    menuItemBulkDelete(ids: $removeIds) {
      errors: menuErrors {
        ...MenuErrorFragment
      }
    }
  }
`;
export const MenuUpdateMutation = TypedMutation<
  MenuUpdate,
  MenuUpdateVariables
>(menuUpdate);

const menuItemUpdate = gql`
  ${menuErrorFragment}
  ${menuItemFragment}
  mutation MenuItemUpdate($id: ID!, $input: MenuItemInput!) {
    menuItemUpdate(id: $id, input: $input) {
      errors: menuErrors {
        ...MenuErrorFragment
      }
      menuItem {
        ...MenuItemFragment
      }
    }
  }
`;
export const MenuItemUpdateMutation = TypedMutation<
  MenuItemUpdate,
  MenuItemUpdateVariables
>(menuItemUpdate);
