// @ts-strict-ignore
import { gql } from "@apollo/client";
import {
  SearchWarehousesDocument,
  SearchWarehousesQuery,
  SearchWarehousesQueryVariables,
} from "@dashboard/graphql";
import makeTopLevelSearch from "@dashboard/hooks/makeTopLevelSearch";

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

export default makeTopLevelSearch<SearchWarehousesQuery, SearchWarehousesQueryVariables>(
  SearchWarehousesDocument,
);
