import { gql } from "@apollo/client";

export const pageInfoFragment = gql`
  fragment PageInfo on PageInfo {
    endCursor
    hasNextPage
    hasPreviousPage
    startCursor
  }
`;
