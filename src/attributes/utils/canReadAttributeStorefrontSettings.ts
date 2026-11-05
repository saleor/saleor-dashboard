import { AttributeTypeEnum, PermissionEnum } from "@dashboard/graphql";

/** Mirrors Saleor's `check_attribute_required_permissions`: any one permission per type. */
const ATTRIBUTE_TYPE_PERMISSIONS: Record<AttributeTypeEnum, PermissionEnum[]> = {
  [AttributeTypeEnum.PRODUCT_TYPE]: [
    PermissionEnum.MANAGE_PRODUCTS,
    PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES,
  ],
  [AttributeTypeEnum.PAGE_TYPE]: [
    PermissionEnum.MANAGE_PAGES,
    PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES,
  ],
  [AttributeTypeEnum.CUSTOMER_TYPE]: [
    PermissionEnum.MANAGE_USERS,
    PermissionEnum.MANAGE_CUSTOMER_TYPES_AND_ATTRIBUTES,
  ],
};

/**
 * Whether the user may read type-gated attribute fields such as `visibleInStorefront`
 * for every attribute in a list scoped to `type` (all types when unscoped).
 */
export const canReadAttributeStorefrontSettings = ({
  type,
  hasPermission,
}: {
  type: AttributeTypeEnum | null | undefined;
  hasPermission: (permission: PermissionEnum) => boolean;
}): boolean => {
  const types = type ? [type] : Object.values(AttributeTypeEnum);

  return types.every(attributeType =>
    ATTRIBUTE_TYPE_PERMISSIONS[attributeType].some(hasPermission),
  );
};
