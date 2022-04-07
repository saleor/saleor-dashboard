import { gql } from "@apollo/client";

export const menuCreate = gql`
  mutation MenuCreate($input: MenuCreateInput!) {
    menuCreate(input: $input) {
      errors {
        ...MenuError
      }
      menu {
        id
      }
    }
  }
`;

export const menuBulkDelete = gql`
  mutation MenuBulkDelete($ids: [ID!]!) {
    menuBulkDelete(ids: $ids) {
      errors {
        ...MenuError
      }
    }
  }
`;

export const menuDelete = gql`
  mutation MenuDelete($id: ID!) {
    menuDelete(id: $id) {
      errors {
        ...MenuError
      }
    }
  }
`;

export const menuItemCreate = gql`
  mutation MenuItemCreate($input: MenuItemCreateInput!) {
    menuItemCreate(input: $input) {
      errors {
        ...MenuError
      }
      menuItem {
        menu {
          id
          items {
            ...MenuItemNested
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
    $moves: [MenuItemMoveInput!]!
    $removeIds: [ID!]!
  ) {
    menuUpdate(id: $id, input: { name: $name }) {
      errors {
        ...MenuError
      }
    }

    menuItemMove(menu: $id, moves: $moves) {
      errors {
        ...MenuError
      }
    }

    menuItemBulkDelete(ids: $removeIds) {
      errors {
        ...MenuError
      }
    }
  }
`;

export const menuItemUpdate = gql`
  mutation MenuItemUpdate($id: ID!, $input: MenuItemInput!) {
    menuItemUpdate(id: $id, input: $input) {
      errors {
        ...MenuError
      }
      menuItem {
        ...MenuItem
      }
    }
  }
`;
