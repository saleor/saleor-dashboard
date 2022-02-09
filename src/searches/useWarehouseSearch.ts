import { pageInfoFragment } from "@saleor/fragments/pageInfo";
import makeTopLevelSearch from "@saleor/hooks/makeTopLevelSearch";
import gql from "graphql-tag";

import {
  SearchWarehouses,
  SearchWarehousesVariables
} from "./types/SearchWarehouses";

export const searchWarehouses = gql`
  ${pageInfoFragment}
  query SearchWarehouses($after: String, $first: Int!, $query: String!) {
    search: warehouses(
      after: $after
      first: $first
      sortBy: { direction: ASC, field: NAME }
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

export default makeTopLevelSearch<SearchWarehouses, SearchWarehousesVariables>(
  searchWarehouses
);
