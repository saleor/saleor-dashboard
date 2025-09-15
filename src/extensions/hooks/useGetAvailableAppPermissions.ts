import { useUser } from "@dashboard/auth";
import { PermissionEnum } from "@dashboard/graphql";
import { useMemo } from "react";

/**
 * Hook to get available permissions for extension creation.
 * Only returns permissions that the current user has.
 */
export const useGetAvailableAppPermissions = () => {
  const { user } = useUser();

  const userPermissions = useMemo(() => {
    if (!user?.userPermissions) {
      return [];
    }

    return user.userPermissions.map(permission => permission.code);
  }, [user?.userPermissions]);

  return {
    availablePermissions: userPermissions,
    isReady: !!user,
    mapCodesToNames: (codes: PermissionEnum[]) => codes.map(code => code),
  };
};
