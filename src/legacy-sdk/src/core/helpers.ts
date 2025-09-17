import { Maybe, UserPermissionFragment } from "@dashboard/graphql";

export const hasNonEmptyPermissions = (
  permissions: Maybe<Array<Maybe<Pick<UserPermissionFragment, "code" | "name">>>> | undefined,
): boolean => (permissions ? permissions.length > 0 : false);
