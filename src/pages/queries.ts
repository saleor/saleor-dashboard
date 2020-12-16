import { pageDetailsFragment, pageFragment } from "@saleor/fragments/pages";
import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import { PageDetails, PageDetailsVariables } from "./types/PageDetails";
import { PageList, PageListVariables } from "./types/PageList";

const pageList = gql`
  ${pageFragment}
  query PageList(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $sort: PageSortingInput
  ) {
    pages(
      before: $before
      after: $after
      first: $first
      last: $last
      sortBy: $sort
    ) {
      edges {
        node {
          ...PageFragment
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
export const usePageListQuery = makeQuery<PageList, PageListVariables>(
  pageList
);

const pageDetails = gql`
  ${pageDetailsFragment}
  query PageDetails($id: ID!) {
    page(id: $id) {
      ...PageDetailsFragment
    }
  }
`;
export const usePageDetailsQuery = makeQuery<PageDetails, PageDetailsVariables>(
  pageDetails
);
