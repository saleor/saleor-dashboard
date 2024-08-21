import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { hasOneOfPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";

interface GiftCardPermissions {
  canManageChannels: boolean;
  canSeeCreatedBy: boolean;
  canSeeUser: boolean;
  canSeeApp: boolean;
}

export const useGiftCardPermissions = (): GiftCardPermissions => {
  const userPermissions = useUserPermissions();

  const canManageChannels = hasOneOfPermissions(userPermissions ?? [], [
    PermissionEnum.MANAGE_CHANNELS,
  ]);
  const canSeeCreatedBy = hasOneOfPermissions(userPermissions ?? [], [PermissionEnum.MANAGE_USERS]);
  const canSeeUser = hasOneOfPermissions(userPermissions ?? [], [
    PermissionEnum.MANAGE_USERS,
    PermissionEnum.MANAGE_STAFF,
  ]);
  const canSeeApp = hasOneOfPermissions(userPermissions ?? [], [PermissionEnum.MANAGE_APPS]);

  return {
    canManageChannels,
    canSeeCreatedBy,
    canSeeUser,
    canSeeApp,
  };
};
