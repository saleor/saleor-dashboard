import { useUserPermissions } from "@saleor/auth/hooks/useUserPermissions";
import { User_userPermissions } from "@saleor/fragments/types/User";
import { PermissionEnum } from "@saleor/graphql";
import React from "react";

export function hasPermissions(
  userPermissions: User_userPermissions[],
  requiredPermissions: PermissionEnum[]
): boolean {
  return requiredPermissions.reduce(
    (acc, perm) =>
      acc && !!userPermissions.find(userPerm => userPerm.code === perm),
    true
  );
}

export interface RequirePermissionsProps {
  children: React.ReactNode | React.ReactNodeArray;
  requiredPermissions: PermissionEnum[];
}

const RequirePermissions: React.FC<RequirePermissionsProps> = ({
  children,
  requiredPermissions
}) => {
  const userPermissions = useUserPermissions();

  return userPermissions &&
    hasPermissions(userPermissions, requiredPermissions) ? (
    <>{children}</>
  ) : null;
};

RequirePermissions.displayName = "RequirePermissions";
export default RequirePermissions;
