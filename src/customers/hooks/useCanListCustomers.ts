import { PermissionEnum } from "@dashboard/graphql";
import { useHasPermission } from "@dashboard/search/useHasPermission";

/**
 * The `customers` query requires `MANAGE_USERS` or `MANAGE_ORDERS`. Staff with only
 * `MANAGE_STAFF` may open a customer profile but not list customers.
 */
export const useCanListCustomers = (): boolean => {
  const hasPermission = useHasPermission();

  return hasPermission(PermissionEnum.MANAGE_USERS) || hasPermission(PermissionEnum.MANAGE_ORDERS);
};
