import { gql } from "@apollo/client";

export const rootCategories = gql`
  query RootCategories(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $filter: CategoryFilterInput
    $sort: CategorySortingInput
  ) {
    categories(
      level: 0
      first: $first
      after: $after
      last: $last
      before: $before
      filter: $filter
      sortBy: $sort
    ) {
      edges {
        node {
          ...CategoryFragment
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
`;

export const categoryDetails = gql`
  query CategoryDetails(
    $id: ID!
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    category(id: $id) {
      ...CategoryDetailsFragment
      children(first: $first, after: $after, last: $last, before: $before) {
        edges {
          node {
            ...CategoryFragment
          }
        }
        pageInfo {
          ...PageInfoFragment
        }
      }
      products(first: $first, after: $after, last: $last, before: $before) {
        pageInfo {
          ...PageInfoFragment
        }
        edges {
          cursor
          node {
            id
            name
            thumbnail {
              url
            }
          }
        }
      }
    }
  }
`;
