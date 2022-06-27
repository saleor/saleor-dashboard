import {
  PermissionGroupDetailsQuery,
  ShopInfoQuery,
  UserDetailsQuery,
} from "@saleor/graphql";

export const getLastSourcesOfPermission = (
  groupId: string,
  userPermissions: PermissionGroupDetailsQuery["user"]["userPermissions"],
) =>
  userPermissions
    .filter(
      perm =>
        perm.sourcePermissionGroups.length === 1 &&
        perm.sourcePermissionGroups[0].id === groupId,
    )
    .map(perm => perm.code);

export const getPermissionsComponentChoices = (
  userPermissions: UserDetailsQuery["me"]["userPermissions"],
  shopPermissions: ShopInfoQuery["shop"]["permissions"],
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
