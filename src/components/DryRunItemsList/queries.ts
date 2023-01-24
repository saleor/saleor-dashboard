import { gql } from "@apollo/client";

export const checkouts = gql`
  query CheckoutList($first: Int, $after: String, $last: Int, $before: String) {
    checkouts(before: $before, after: $after, first: $first, last: $last) {
      edges {
        cursor
        node {
          id
          created
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

export const channels = gql`
  query ChannelList {
    channels {
      id
      name
    }
  }
`;
