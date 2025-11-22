import { useUser } from "@dashboard/auth";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";

export const useHasManageProductsPermission = () => {
  const user = useUser();

  const hasManageProducts = hasPermissions(user?.user?.userPermissions ?? [], [
    "MANAGE_PRODUCTS",
  ]);

  return hasManageProducts;
};
