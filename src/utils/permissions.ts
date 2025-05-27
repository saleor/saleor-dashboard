import { useUser } from "@dashboard/auth";
import { PermissionEnum } from "@dashboard/graphql";
import { useMemo } from "react";

export const useUserHasPermissions = (requiredPermissions: PermissionEnum[]) => {
  const user = useUser();
  const userPermissions = useMemo(
    () => new Set(user?.user?.userPermissions?.map(perm => perm.code) || []),
    [user],
  );

  return requiredPermissions.every(permission => userPermissions.has(permission));
};
