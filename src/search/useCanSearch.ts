import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { PermissionEnum } from "@dashboard/graphql";

export const searchPermissions = [
  PermissionEnum.MANAGE_PRODUCTS,
  PermissionEnum.MANAGE_PAGES,
  PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES,
  PermissionEnum.MANAGE_ORDERS,
];

export const useCanSearch = (): boolean => {
  const userPermissions = useUserPermissions();

  return searchPermissions.some(
    permission => userPermissions?.some(({ code }) => code === permission) ?? false,
  );
};
