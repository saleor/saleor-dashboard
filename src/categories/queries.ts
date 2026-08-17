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
          ...Category
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export const categoryDetails = gql`
  query CategoryDetails(
    $id: ID!
    $childrenFirst: Int
    $childrenAfter: String
    $childrenLast: Int
    $childrenBefore: String
  ) {
    category(id: $id) {
      ...CategoryDetails
      children(
        first: $childrenFirst
        after: $childrenAfter
        last: $childrenLast
        before: $childrenBefore
      ) {
        totalCount
        edges {
          node {
            ...Category
          }
        }
        pageInfo {
          ...PageInfo
        }
      }
    }
  }
`;

export const categoryProducts = gql`
  query CategoryProducts($id: ID!, $first: Int, $after: String, $last: Int, $before: String) {
    category(id: $id) {
      id
      products(first: $first, after: $after, before: $before, last: $last) {
        edges {
          node {
            ...CollectionProduct
          }
        }
        pageInfo {
          ...PageInfo
        }
      }
    }
  }
`;

export const categoryChildren = gql`
  query CategoryChildren($id: ID!, $first: Int!, $after: String) {
    category(id: $id) {
      id
      children(first: $first, after: $after) {
        edges {
          node {
            ...Category
          }
        }
        pageInfo {
          ...PageInfo
        }
      }
    }
  }
`;

export const defaultGraphiQLQuery = `query CategoryDetails($id: ID!) {
  category(id: $id) {
    id
    name
    slug
  }
}`;
