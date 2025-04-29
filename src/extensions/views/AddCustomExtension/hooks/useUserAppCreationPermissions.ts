import { useUser } from "@dashboard/auth";
import useShop from "@dashboard/hooks/useShop";
import difference from "lodash/difference";

export const useUserAppCreationPermissions = () => {
  const user = useUser();
  const shop = useShop();

  const userPermissions = user?.user?.userPermissions?.map(p => p.code) || [];
  const allAppPermissions = shop?.permissions?.map(permission => permission.code) || [];

  return difference(allAppPermissions, userPermissions).length > 0;
};
