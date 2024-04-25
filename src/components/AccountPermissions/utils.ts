import {
  PermissionEnum,
  PermissionFragment,
  UserPermissionFragment,
  UserUserPermissionWithSourcePermissionGroupsFragment,
} from "@dashboard/graphql";

export const getLastSourcesOfPermission = (
  groupId: string,
  userPermissions: Array<NonNullable<UserUserPermissionWithSourcePermissionGroupsFragment>>,
) =>
  userPermissions
    .filter(
      perm =>
        perm.sourcePermissionGroups?.length === 1 && perm.sourcePermissionGroups[0]?.id === groupId,
    )
    .map(perm => perm.code);

export const getPermissionsComponentChoices = (
  userPermissions: UserPermissionFragment[],
  shopPermissions: PermissionFragment[],
  lastSourcesOfPermissionIds: string[],
) => {
  const userCodes = userPermissions.map(p => p.code) || [];

  return shopPermissions.map(perm => ({
    ...perm,
    __typename: "PermissionData",
    disabled: !userCodes.includes(perm.code),
    lastSource: lastSourcesOfPermissionIds.includes(perm.code),
  }));
};

export const hasPermissionSelected = (permissions: string[], permissionCode: PermissionEnum) =>
  permissions.filter(userPerm => userPerm === permissionCode).length === 1;
