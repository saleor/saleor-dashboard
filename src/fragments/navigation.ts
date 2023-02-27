import { gql } from "@apollo/client";

export const menuFragment = gql`
  fragment Menu on Menu {
    id
    name
    items {
      id
    }
  }
`;

export const menuItemFragment = gql`
  fragment MenuItem on MenuItem {
    category {
      id
      name
    }
    collection {
      id
      name
    }
    id
    level
    name
    page {
      id
      title
    }
    url
  }
`;

// GraphQL does not support recurive fragments
export const menuItemNestedFragment = gql`
  fragment MenuItemNested on MenuItem {
    ...MenuItem
    children {
      ...MenuItem
      children {
        ...MenuItem
        children {
          ...MenuItem
          children {
            ...MenuItem
            children {
              ...MenuItem
              children {
                ...MenuItem
              }
            }
          }
        }
      }
    }
  }
`;

export const menuDetailsFragment = gql`
  fragment MenuDetails on Menu {
    id
    items {
      ...MenuItemNested
    }
    name
  }
`;
