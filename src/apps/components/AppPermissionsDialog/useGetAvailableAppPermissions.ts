import useShop from "@dashboard/hooks/useShop";

export const useGetAvailableAppPermissions = () => {
  const { permissions } = useShop();

  /**
   * App can't have MANAGE_APPS so filter it out
   */
  return permissions
    .filter(perm => perm.code !== "MANAGE_APPS")
    .map(p => ({
      code: p.code,
      name: p.name,
    }));
};
