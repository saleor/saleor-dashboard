import gql from "graphql-tag";

import makeTopLevelSearch from "@saleor/hooks/makeTopLevelSearch";
import { pageInfoFragment } from "@saleor/queries";
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
