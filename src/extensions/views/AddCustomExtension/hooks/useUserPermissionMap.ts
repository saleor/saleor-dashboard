import { useUser } from "@dashboard/auth";
import { useMemo } from "react";

export const useUserPermissionSet = () => {
  const user = useUser();

  return useMemo(() => {
    const userPermissions = user?.user?.userPermissions?.map(p => p.code) || [];

    return new Set(userPermissions);
  }, [user?.user?.userPermissions]);
};
