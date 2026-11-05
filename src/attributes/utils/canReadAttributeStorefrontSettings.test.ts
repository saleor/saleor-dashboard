import { AttributeTypeEnum, PermissionEnum } from "@dashboard/graphql";

import { canReadAttributeStorefrontSettings } from "./canReadAttributeStorefrontSettings";

const granting =
  (...granted: PermissionEnum[]) =>
  (permission: PermissionEnum): boolean =>
    granted.includes(permission);

describe("canReadAttributeStorefrontSettings", () => {
  it("allows a type-scoped list when the user holds one of that type's permissions", () => {
    // Arrange
    const hasPermission = granting(PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES);

    // Act
    const result = canReadAttributeStorefrontSettings({
      type: AttributeTypeEnum.PAGE_TYPE,
      hasPermission,
    });

    // Assert
    expect(result).toBe(true);
  });

  it("denies a type-scoped list without that type's permissions", () => {
    // Arrange
    const hasPermission = granting(PermissionEnum.MANAGE_PAGES);

    // Act
    const result = canReadAttributeStorefrontSettings({
      type: AttributeTypeEnum.PRODUCT_TYPE,
      hasPermission,
    });

    // Assert
    expect(result).toBe(false);
  });

  it("requires every type's permission for an unscoped list", () => {
    // Arrange
    const partial = granting(PermissionEnum.MANAGE_PRODUCTS, PermissionEnum.MANAGE_PAGES);
    const full = granting(
      PermissionEnum.MANAGE_PRODUCTS,
      PermissionEnum.MANAGE_PAGES,
      PermissionEnum.MANAGE_USERS,
    );

    // Act
    const partialResult = canReadAttributeStorefrontSettings({
      type: undefined,
      hasPermission: partial,
    });
    const fullResult = canReadAttributeStorefrontSettings({ type: undefined, hasPermission: full });

    // Assert
    expect(partialResult).toBe(false);
    expect(fullResult).toBe(true);
  });
});
