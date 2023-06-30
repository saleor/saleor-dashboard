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

  const mapCodesToNames = (codes: PermissionEnum[]) =>
    codes.map(c => {
      if (!shopData.permissions) {
        return c;
      }

      // @ts-ignore todo
      return shopData.permissions.find(p => p.code === c).name;
    });

  return {
    availablePermissions,
    mapCodesToNames,
  };
};
