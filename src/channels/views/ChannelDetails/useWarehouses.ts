import { useUserPermissions } from "@saleor/auth/hooks/useUserPermissions";
import { hasOneOfPermissions } from "@saleor/components/RequirePermissions";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import {
  PermissionEnum,
  useChannelWarehousesQuery,
  useWarehousesCountQuery,
} from "@saleor/graphql";
import useWarehouseSearch from "@saleor/searches/useWarehouseSearch";

export const useWarehouses = (channelId?: string) => {
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
    data: channelWarehousesData,
    loading: channelWarehousesLoading,
  } = useChannelWarehousesQuery(
    channelId
      ? {
          variables: {
            filter: {
              channels: [channelId],
            },
          },
        }
      : undefined,
  );

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
    channelWarehousesData,
    channelWarehousesLoading,
    fetchMoreWarehouses,
    searchWarehouses,
    searchWarehousesResult,
  };
};
