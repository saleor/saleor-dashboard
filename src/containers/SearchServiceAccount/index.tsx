import gql from "graphql-tag";

import BaseSearch from "../BaseSearch";
import {
  SearchServiceAccount,
  SearchServiceAccountVariables
} from "./types/SearchServiceAccount";

export const searchServiceAccount = gql`
  query SearchServiceAccount($after: String, $first: Int!, $query: String!) {
    serviceAccounts(after: $after, first: $first, filter: { search: $query }) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

export default BaseSearch<SearchServiceAccount, SearchServiceAccountVariables>(
  searchServiceAccount
);
