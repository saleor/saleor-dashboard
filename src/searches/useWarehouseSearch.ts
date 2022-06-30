import { gql } from "@apollo/client";
import {
  SearchWarehousesDocument,
  SearchWarehousesQuery,
  SearchWarehousesQueryVariables,
} from "@saleor/graphql";
import makeTopLevelSearch from "@saleor/hooks/makeTopLevelSearch";

export const searchWarehouses = gql`
  query SearchWarehouses($after: String, $first: Int!, $query: String!) {
    search: warehouses(
      after: $after
      first: $first
      sortBy: { direction: ASC, field: NAME }
      filter: { search: $query }
    ) {
      totalCount
      edges {
        node {
          id
          name
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export default makeTopLevelSearch<
  SearchWarehousesQuery,
  SearchWarehousesQueryVariables
>(SearchWarehousesDocument);
