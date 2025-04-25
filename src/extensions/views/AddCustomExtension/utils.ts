import { PermissionEnum, PermissionFragment } from "@dashboard/graphql";

export const getNoPermissionsObject = (permissions: PermissionFragment[]) => {
  /**
   * Object: {
   *   MANAGE_ORDERS: false
   *   ...
   * }
   * */
  return permissions.reduce(
    (acc, { code }) => ({ ...acc, [code]: false }),
    {} as Record<PermissionEnum, boolean>,
  );
};

export const getAllPermissionsObject = (permissions: PermissionFragment[]) => {
  /**
   * Object: {
   *   MANAGE_ORDERS: true
   *   ...
   * }
   * */
  return permissions.reduce(
    (acc, { code }) => ({ ...acc, [code]: true }),
    {} as Record<PermissionEnum, boolean>,
  );
};
