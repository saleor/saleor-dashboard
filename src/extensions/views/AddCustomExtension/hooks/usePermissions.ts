import useShop from "@dashboard/hooks/useShop";
import { useMemo } from "react";

import { filterCustomExtensionPermissions } from "../../customExtensionHiddenPermissions";

export const usePermissions = () => {
  const shop = useShop();

  return useMemo(() => {
    const permissionsArray = filterCustomExtensionPermissions(shop?.permissions ?? []);

    return permissionsArray.sort((a, b) => a.name.localeCompare(b.name));
  }, [shop?.permissions]);
};
