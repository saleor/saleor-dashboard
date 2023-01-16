import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { hasOneOfPermissions } from "@dashboard/components/RequirePermissions";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import { PermissionEnum, useWarehousesCountQuery } from "@dashboard/graphql";
import useWarehouseSearch from "@dashboard/searches/useWarehouseSearch";

export const useWarehouses = () => {
  const userPermissions = useUserPermissions();
  const canLoadWarehouses = hasOneOfPermissions(userPermissions, [
    PermissionEnum.MANAGE_SHIPPING,
    PermissionEnum.MANAGE_ORDERS,
    PermissionEnum.MANAGE_PRODUCTS,
  ]);

  const {
    data: warehousesCountData,
    loading: warehousesCountLoading,
  } = useWarehousesCountQuery({ skip: !canLoadWarehouses });

  const {
    loadMore: fetchMoreWarehouses,
    search: searchWarehouses,
    result: searchWarehousesResult,
  } = useWarehouseSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
    skip: !canLoadWarehouses,
  });

  return {
    warehousesCountData,
    warehousesCountLoading,
    fetchMoreWarehouses,
    searchWarehouses,
    searchWarehousesResult,
  };
};
