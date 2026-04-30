import { useUser } from "@dashboard/auth/useUser";

const CX_GROUP_NAME = "CX Returns Management";

/**
 * Returns true if the current user belongs to the "CX Returns Management"
 * Saleor permission group.
 *
 * To grant access:
 *   1. Go to Saleor Admin → Staff → Permission Groups
 *   2. Create a group named "CX Returns Management" with the MANAGE_ORDERS permission
 *   3. Assign CX agent accounts to this group
 */
export function useCXPermission(): boolean {
  const { user } = useUser();

  if (!user) return false;

  return (user.permissionGroups ?? []).some(g => g.name === CX_GROUP_NAME);
}
