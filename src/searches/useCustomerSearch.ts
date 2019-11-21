import gql from "graphql-tag";

import makeTopLevelSearch from "@saleor/hooks/makeTopLevelSearch";
import { pageInfoFragment } from "@saleor/queries";
import {
  SearchCustomers,
  SearchCustomersVariables
} from "./types/SearchCustomers";

export const searchCustomers = gql`
  ${pageInfoFragment}
  query SearchCustomers($after: String, $first: Int!, $query: String!) {
    search: customers(after: $after, first: $first, query: $query) {
      edges {
        node {
          id
          email
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
`;

export default makeTopLevelSearch<SearchCustomers, SearchCustomersVariables>(
  searchCustomers
);
