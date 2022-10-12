import { gql } from "@apollo/client";

export const productTypeListQuery = gql`
  query ProductTypeList(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $filter: ProductTypeFilterInput
    $sort: ProductTypeSortingInput
  ) {
    productTypes(
      after: $after
      before: $before
      first: $first
      last: $last
      filter: $filter
      sortBy: $sort
    ) {
      edges {
        node {
          ...ProductType
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export const productTypeDetailsQuery = gql`
  query ProductTypeDetails($id: ID!, $first: Int, $after: String) {
    productType(id: $id) {
      ...ProductTypeDetails
    }
    shop {
      defaultWeightUnit
    }
    taxClasses(first: $first, after: $after) {
      edges {
        node {
          id
          name
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const productTypeCreateDataQuery = gql`
  query ProductTypeCreateData($first: Int, $after: String) {
    shop {
      defaultWeightUnit
    }
    taxClasses(first: $first, after: $after) {
      edges {
        node {
          id
          name
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
