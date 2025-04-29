import useShop from "@dashboard/hooks/useShop";
import { useMemo } from "react";

export const usePermissions = () => {
  const shop = useShop();

  return useMemo(() => {
    // Create new array so that it's mutable
    const permissionsArray = [...(shop?.permissions ?? [])];

    return permissionsArray.sort((a, b) => a.name.localeCompare(b.name));
  }, [shop?.permissions]);
};
