import { gql } from "@apollo/client";
import {
  SearchCustomersDocument,
  SearchCustomersQuery,
  SearchCustomersQueryVariables,
} from "@saleor/graphql";
import makeTopLevelSearch from "@saleor/hooks/makeTopLevelSearch";

export const searchCustomers = gql`
  query SearchCustomers($after: String, $first: Int!, $query: String!) {
    search: customers(
      after: $after
      first: $first
      filter: { search: $query }
    ) {
      edges {
        node {
          id
          email
          firstName
          lastName
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export default makeTopLevelSearch<
  SearchCustomersQuery,
  SearchCustomersQueryVariables
>(SearchCustomersDocument);
