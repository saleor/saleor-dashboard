import { PermissionEnum } from "@dashboard/graphql";
import useShop from "@dashboard/hooks/useShop";

export const useGetAvailableAppPermissions = () => {
  const shopData = useShop();

  /**
   * App can't have MANAGE_APPS so filter it out
   */
  const availablePermissions = shopData.permissions
    .filter(perm => perm.code !== "MANAGE_APPS")
    .map(p => ({
      code: p.code,
      name: p.name,
    }));

  const mapCodesToNames = (codes: PermissionEnum[]) => {
    if (!shopData?.permissions) {
      throw new Error(
        "Shop data from useShop hook is not available. mapCodesToNames method must be used after query resolves",
      );
    }

    return codes.map(c => shopData.permissions.find(p => p.code === c).name);
  };

  return {
    availablePermissions,
    mapCodesToNames,
  };
};
