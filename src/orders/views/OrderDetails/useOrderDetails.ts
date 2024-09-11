import { useOrderDetailsWithMetadataQuery } from "@dashboard/graphql";
import { useHasManageProductsPermission } from "@dashboard/orders/hooks/useHasManageProductsPermission";

export const useOrderDetails = (id: string) => {
  const hasManageProducts = useHasManageProductsPermission();
  const { data, loading } = useOrderDetailsWithMetadataQuery({
    displayLoader: true,
    variables: { id, hasManageProducts },
  });

  return {
    data,
    loading,
  };
};
