import {
  WarehouseListDocument,
  WarehouseListQuery,
  WarehouseListQueryVariables,
} from "@dashboard/graphql";
import { makeFetchAll } from "@dashboard/hooks/makeFetchAll";

export const useFetchAllWarehouses = makeFetchAll<WarehouseListQuery, WarehouseListQueryVariables>(
  WarehouseListDocument,
  "warehouses",
  (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) {
      return previousResult;
    }

    const previousEdges = previousResult?.warehouses?.edges ?? [];
    const fetchMoreEdges = fetchMoreResult?.warehouses?.edges ?? [];

    if (fetchMoreResult?.warehouses?.edges) {
      fetchMoreResult.warehouses.edges = [...previousEdges, ...fetchMoreEdges];

      return { ...fetchMoreResult };
    }

    return previousResult;
  },
);
