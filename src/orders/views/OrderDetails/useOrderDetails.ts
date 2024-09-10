import { useUser } from "@dashboard/auth";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum, useOrderDetailsWithMetadataQuery } from "@dashboard/graphql";

export const useOrderDetails = (id: string) => {
  const user = useUser();

  const hasManageProducts = hasPermissions(user?.user?.userPermissions ?? [], [
    PermissionEnum.MANAGE_PRODUCTS,
  ]);
  const { data, loading } = useOrderDetailsWithMetadataQuery({
    displayLoader: true,
    variables: { id, hasManageProducts },
  });

  return {
    data,
    loading,
  };
};
