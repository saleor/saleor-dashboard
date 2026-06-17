import { useRegisterEntityRefresh } from "@dashboard/extensions/entity-refresh";
import { useOrderDetailsWithMetadataQuery } from "@dashboard/graphql";
import { useHasManageProductsPermission } from "@dashboard/orders/hooks/useHasManageProductsPermission";

export const useOrderDetails = (id: string) => {
  const hasManageProducts = useHasManageProductsPermission();
  const { data, loading, refetch } = useOrderDetailsWithMetadataQuery({
    displayLoader: true,
    variables: { id, hasManageProducts },
  });

  useRegisterEntityRefresh(refetch);

  return {
    data,
    loading,
  };
};
