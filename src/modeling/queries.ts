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
    $searchValues: String
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
    $searchValues: String
  ) {
    pageType(id: $id) {
      id
      name
      attributes {
        ...AttributeDetails
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

export const modelsOfTypeQuery = gql`
  query ModelsOfType($pageTypeId: ID!) {
    pages(first: 100, where: { pageType: { eq: $pageTypeId } }) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`;
