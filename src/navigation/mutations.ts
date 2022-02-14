import { gql } from "@apollo/client";

export const menuCreate = gql`
  mutation MenuCreate($input: MenuCreateInput!) {
    menuCreate(input: $input) {
      errors {
        ...MenuErrorFragment
      }
      menu {
        id
      }
    }
  }
`;

export const menuBulkDelete = gql`
  mutation MenuBulkDelete($ids: [ID]!) {
    menuBulkDelete(ids: $ids) {
      errors {
        ...MenuErrorFragment
      }
    }
  }
`;

export const menuDelete = gql`
  mutation MenuDelete($id: ID!) {
    menuDelete(id: $id) {
      errors {
        ...MenuErrorFragment
      }
    }
  }
`;

export const menuItemCreate = gql`
  mutation MenuItemCreate($input: MenuItemCreateInput!) {
    menuItemCreate(input: $input) {
      errors {
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

export const menuUpdate = gql`
  mutation MenuUpdate(
    $id: ID!
    $name: String!
    $moves: [MenuItemMoveInput]!
    $removeIds: [ID]!
  ) {
    menuUpdate(id: $id, input: { name: $name }) {
      errors {
        ...MenuErrorFragment
      }
    }

    menuItemMove(menu: $id, moves: $moves) {
      errors {
        ...MenuErrorFragment
      }
    }

    menuItemBulkDelete(ids: $removeIds) {
      errors {
        ...MenuErrorFragment
      }
    }
  }
`;

export const menuItemUpdate = gql`
  mutation MenuItemUpdate($id: ID!, $input: MenuItemInput!) {
    menuItemUpdate(id: $id, input: $input) {
      errors {
        ...MenuErrorFragment
      }
      menuItem {
        ...MenuItemFragment
      }
    }
  }
`;
