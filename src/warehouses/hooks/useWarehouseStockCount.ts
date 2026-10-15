import { useWarehouseStockCountQuery } from "@dashboard/graphql";

/** Skipped without an id. The count is null while loading or when it could not be loaded. */
export const useWarehouseStockCount = (
  warehouseId: string | undefined,
): { stockCount: number | null; loading: boolean } => {
  const query = useWarehouseStockCountQuery({
    variables: { id: warehouseId ?? "" },
    skip: !warehouseId,
    errorPolicy: "all",
  });

  return {
    stockCount: query.loading ? null : (query.data?.warehouse?.stocks?.totalCount ?? null),
    loading: query.loading,
  };
};
