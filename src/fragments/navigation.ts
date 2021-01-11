import gql from "graphql-tag";

export const menuFragment = gql`
  fragment MenuFragment on Menu {
    id
    name
    items {
      id
    }
  }
`;

export const menuItemFragment = gql`
  fragment MenuItemFragment on MenuItem {
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
  ${menuItemFragment}
  fragment MenuItemNestedFragment on MenuItem {
    ...MenuItemFragment
    children {
      ...MenuItemFragment
      children {
        ...MenuItemFragment
        children {
          ...MenuItemFragment
          children {
            ...MenuItemFragment
            children {
              ...MenuItemFragment
              children {
                ...MenuItemFragment
              }
            }
          }
        }
      }
    }
  }
`;

export const menuDetailsFragment = gql`
  ${menuItemNestedFragment}
  fragment MenuDetailsFragment on Menu {
    id
    items {
      ...MenuItemNestedFragment
    }
    name
  }
`;
