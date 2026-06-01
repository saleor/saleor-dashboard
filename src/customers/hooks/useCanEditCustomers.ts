import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";

/**
 * Customer mutations (`customerUpdate`, `customerDelete`, address mutations,
 * metadata updates) all require `MANAGE_USERS`. Read access to customer
 * detail and address pages is broader (`MANAGE_USERS`, `MANAGE_ORDERS`, or
 * `MANAGE_STAFF`), so we use this flag at the UI layer to flip into a
 * read-only mode for users who can read but not write.
 */
export const useCanEditCustomers = () => {
  const userPermissions = useUserPermissions();

  return hasPermissions(userPermissions ?? [], [PermissionEnum.MANAGE_USERS]);
};
