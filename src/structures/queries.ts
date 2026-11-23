import { gql } from "@apollo/client";

export const menuList = gql`
  query MenuList(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $sort: MenuSortingInput
  ) {
    menus(first: $first, after: $after, before: $before, last: $last, sortBy: $sort) {
      edges {
        node {
          ...Menu
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export const menuDetails = gql`
  query MenuDetails($id: ID!) {
    menu(id: $id) {
      ...MenuDetails
    }
  }
`;

// Loaded only while the metadata dialog is open. MenuDetails doesn't include metadata, so
// saving it doesn't reload the whole item tree, and reloading the page's query can't reset
// half-typed metadata edits.
export const menuMetadata = gql`
  query MenuMetadata($id: ID!) {
    menu(id: $id) {
      id
      ...Metadata
    }
  }
`;

export const defaultGraphiQLQuery = `query MenuDetails($id: ID!) {
  menu(id: $id) {
    id
    name
    slug
  }
}`;
