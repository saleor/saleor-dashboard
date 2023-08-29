import { WarehouseListQuery } from "@dashboard/graphql";

export const mergeWarehousesQuery = (
  previousResult: WarehouseListQuery,
  {
    fetchMoreResult,
  }: {
    fetchMoreResult?: WarehouseListQuery;
  },
): WarehouseListQuery => {
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
};
