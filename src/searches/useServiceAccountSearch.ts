import gql from "graphql-tag";

import makeTopLevelSearch from "@saleor/hooks/makeTopLevelSearch";
import { pageInfoFragment } from "@saleor/queries";
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

export default makeTopLevelSearch<
  SearchServiceAccount,
  SearchServiceAccountVariables
>(searchServiceAccount);
