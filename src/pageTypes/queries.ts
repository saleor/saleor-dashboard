import { gql } from "@apollo/client";

export const pageTypeListQuery = gql`
  query PageTypeList(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $filter: PageTypeFilterInput
    $sort: PageTypeSortingInput
  ) {
    pageTypes(
      after: $after
      before: $before
      first: $first
      last: $last
      filter: $filter
      sortBy: $sort
    ) {
      edges {
        node {
          ...PageTypeFragment
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
`;

export const pageTypeDetailsQuery = gql`
  query PageTypeDetails($id: ID!) {
    pageType(id: $id) {
      ...PageTypeDetailsFragment
    }
  }
`;
