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
    "MANAGE_CHANNELS",
  ]);
  const canSeeCreatedBy = hasOneOfPermissions(userPermissions ?? [], ["MANAGE_USERS"]);
  const canSeeUser = hasOneOfPermissions(userPermissions ?? [], [
    "MANAGE_USERS",
    "MANAGE_STAFF",
  ]);
  const canSeeApp = hasOneOfPermissions(userPermissions ?? [], ["MANAGE_APPS"]);

  return {
    canManageChannels,
    canSeeCreatedBy,
    canSeeUser,
    canSeeApp,
  };
};
