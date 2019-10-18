import gql from "graphql-tag";

import { pageInfoFragment } from "@saleor/queries";
import TopLevelSearch from "../TopLevelSearch";
import {
  SearchServiceAccount,
  SearchServiceAccountVariables
} from "./types/SearchServiceAccount";

export const searchServiceAccount = gql`
  ${pageInfoFragment}
  query SearchServiceAccount($after: String, $first: Int!, $query: String!) {
    search: serviceAccounts(
      after: $after
      first: $first
      filter: { search: $query }
    ) {
      edges {
        node {
          id
          name
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
`;

export default TopLevelSearch<
  SearchServiceAccount,
  SearchServiceAccountVariables
>(searchServiceAccount);
