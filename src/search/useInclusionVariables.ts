import { PermissionEnum } from "@dashboard/graphql";

import { useHasPermission } from "./useHasPermission";

export const useInclusionVariables = (scope: string) => {
  const hasPermission = useHasPermission();
  const hasManageOrdersPermission = hasPermission("MANAGE_ORDERS");
  const hasManageProductsPermission = hasPermission("MANAGE_PRODUCTS");
  const hasManagePagesPermission = hasPermission("MANAGE_PAGES");
  const hasManagePageTypesAndAttributesPermission = hasPermission(
    "MANAGE_PAGE_TYPES_AND_ATTRIBUTES",
  );

  return {
    includeOrders: hasManageOrdersPermission && ["orders", "all"].includes(scope),
    includeCategories: hasManageProductsPermission && ["categories", "all"].includes(scope),
    includeCollections: hasManageProductsPermission && ["collections", "all"].includes(scope),
    includeProducts: hasManageProductsPermission && ["products", "all"].includes(scope),
    includeVariants: hasManageProductsPermission && ["variants", "all"].includes(scope),
    includeModels: hasManagePagesPermission && ["models", "all"].includes(scope),
    includeModelTypes:
      hasManagePageTypesAndAttributesPermission && ["model-types", "all"].includes(scope),
  };
};
