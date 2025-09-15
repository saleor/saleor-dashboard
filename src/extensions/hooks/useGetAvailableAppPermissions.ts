import { PermissionEnum } from "@dashboard/graphql";
import useShop from "@dashboard/hooks/useShop";

export const useGetAvailableAppPermissions = () => {
  const shopData = useShop();
  /**
   * App can't have MANAGE_APPS so filter it out
   */
  const availablePermissions = shopData?.permissions
    .filter(perm => perm.code !== "MANAGE_APPS")
    .map(p => ({
      code: p.code,
      name: p.name,
    }));
  const mapCodesToNames = (codes: PermissionEnum[]) => {
    const permissions = shopData?.permissions;

    if (!permissions) {
      throw new Error(
        "Shop data from useShop hook is not available. mapCodesToNames method must be used after query resolves",
      );
    }

    return codes.map(c => {
      const relatedPermission = permissions.find(p => {
        return p.code === c;
      });

      if (!relatedPermission) {
        throw new Error(
          "Trying to match permission enum from app that doesnt match available permissions from API",
        );
      }

      return relatedPermission.name;
    });
  };

  return {
    availablePermissions,
    mapCodesToNames,
    isReady: !!shopData,
  };
};
