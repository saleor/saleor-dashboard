import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { PermissionEnum } from "@dashboard/graphql";

export const useHasPermission = () => {
  const userPermissions = useUserPermissions();

  return (permission: PermissionEnum) => {
    return userPermissions?.some(perm => perm.code === permission) ?? false;
  };
};
