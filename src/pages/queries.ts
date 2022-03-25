import { gql } from "@apollo/client";

export const pageList = gql`
  query PageList(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $sort: PageSortingInput
    $filter: PageFilterInput
  ) {
    pages(
      before: $before
      after: $after
      first: $first
      last: $last
      sortBy: $sort
      filter: $filter
    ) {
      edges {
        node {
          ...Page
        }
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`;

export const pageDetails = gql`
  query PageDetails(
    $id: ID!
    $firstValues: Int
    $afterValues: String
    $lastValues: Int
    $beforeValues: String
  ) {
    page(id: $id) {
      ...PageDetails
    }
  }
`;

export const pageTypeQuery = gql`
  query PageType(
    $id: ID!
    $firstValues: Int
    $afterValues: String
    $lastValues: Int
    $beforeValues: String
  ) {
    pageType(id: $id) {
      id
      name
      attributes {
        id
        inputType
        entityType
        slug
        name
        valueRequired
        choices(
          first: $firstValues
          after: $afterValues
          last: $lastValues
          before: $beforeValues
        ) {
          ...AttributeValueList
        }
      }
    }
  }
`;

export const pageCountQuery = gql`
  query PageCount($filter: PageFilterInput) {
    pages(filter: $filter) {
      totalCount
    }
  }
`;
