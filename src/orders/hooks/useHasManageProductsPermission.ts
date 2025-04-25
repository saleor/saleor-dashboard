import { useUser } from "@dashboard/auth";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";

export const useHasManageProductsPermission = () => {
  const user = useUser();

  const hasManageProducts = hasPermissions(user?.user?.userPermissions ?? [], [
    PermissionEnum.MANAGE_PRODUCTS,
  ]);

  return hasManageProducts;
};
