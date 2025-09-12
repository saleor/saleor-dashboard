import { Maybe, UserPermission } from "../apollo/types";

export const hasNonEmptyPermissions = (
  permissions: Maybe<Array<Maybe<Pick<UserPermission, "code" | "name">>>> | undefined,
): boolean => (permissions ? permissions.length > 0 : false);
