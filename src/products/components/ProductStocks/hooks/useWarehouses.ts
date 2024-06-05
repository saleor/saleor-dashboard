import useWarehouseSearch from "@dashboard/searches/useWarehouseSearch";
import { mapEdgesToItems } from "@dashboard/utils/maps";

export const useWarehouses = (channnelsId: string[], stocksIds: string[]) => {
  const { loadMore: loadMoreWarehouses, result: searchWarehousesResult } = useWarehouseSearch({
    variables: {
      first: 100,
      channnelsId,
      query: "",
    },
    skip: !channnelsId.length,
  });

  const warehouses = mapEdgesToItems(searchWarehousesResult?.data?.search) || [];

  const warehousesToAssign =
    warehouses?.filter(warehouse => !stocksIds.includes(warehouse.id)) || [];

  return {
    loadMoreWarehouses,
    warehouses,
    warehousesToAssign,
    hasMoreWarehouses: searchWarehousesResult?.data?.search?.pageInfo?.hasNextPage || false,
  };
};
