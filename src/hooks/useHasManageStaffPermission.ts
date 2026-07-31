import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { PermissionEnum } from "@dashboard/graphql";

/**
 * MANAGE_STAFF gates staff-user references on other objects (e.g. `AppToken.createdBy`,
 * `AppInstallation.installedBy`), which must be `@include`d only when the user can read them.
 */
export const useHasManageStaffPermission = () => {
  const permissions = useUserPermissions();
  const hasManageStaffPermission = !!permissions?.some(
    ({ code }) => code === PermissionEnum.MANAGE_STAFF,
  );

  return { hasManageStaffPermission };
};
