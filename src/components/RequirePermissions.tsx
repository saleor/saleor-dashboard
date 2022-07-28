import { useUserPermissions } from "@saleor/auth/hooks/useUserPermissions";
import { PermissionEnum, UserPermissionFragment } from "@saleor/graphql";
import React from "react";

export function hasPermissions(
  userPermissions: UserPermissionFragment[],
  requiredPermissions: PermissionEnum[],
): boolean {
  return requiredPermissions.reduce(
    (acc, perm) =>
      acc && !!userPermissions.find(userPerm => userPerm.code === perm),
    true,
  );
}

export interface RequirePermissionsProps {
  children: React.ReactNode | React.ReactNodeArray;
  requiredPermissions: PermissionEnum[];
}

const RequirePermissions: React.FC<RequirePermissionsProps> = ({
  children,
  requiredPermissions,
}) => {
  const userPermissions = useUserPermissions();

  return userPermissions &&
    hasPermissions(userPermissions, requiredPermissions) ? (
    <>{children}</>
  ) : null;
};

RequirePermissions.displayName = "RequirePermissions";
export default RequirePermissions;
