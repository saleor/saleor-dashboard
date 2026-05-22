import { PermissionEnum, type PermissionFragment } from "@dashboard/graphql";

import {
  filterCustomExtensionPermissions,
  HIDDEN_CUSTOM_EXTENSION_PERMISSIONS,
} from "./customExtensionHiddenPermissions";

describe("filterCustomExtensionPermissions", () => {
  it("removes MANAGE_APPS from the list", () => {
    // Arrange
    const permissions: PermissionFragment[] = [
      { __typename: "Permission", name: "Manage Apps", code: PermissionEnum.MANAGE_APPS },
      { __typename: "Permission", name: "Manage Orders", code: PermissionEnum.MANAGE_ORDERS },
      { __typename: "Permission", name: "Manage Products", code: PermissionEnum.MANAGE_PRODUCTS },
    ];

    // Act
    const result = filterCustomExtensionPermissions(permissions);

    // Assert
    expect(result).toEqual([
      { __typename: "Permission", name: "Manage Orders", code: PermissionEnum.MANAGE_ORDERS },
      { __typename: "Permission", name: "Manage Products", code: PermissionEnum.MANAGE_PRODUCTS },
    ]);
  });

  it("returns the list unchanged when no hidden permissions are present", () => {
    // Arrange
    const permissions: PermissionFragment[] = [
      { __typename: "Permission", name: "Manage Orders", code: PermissionEnum.MANAGE_ORDERS },
      { __typename: "Permission", name: "Manage Products", code: PermissionEnum.MANAGE_PRODUCTS },
    ];

    // Act
    const result = filterCustomExtensionPermissions(permissions);

    // Assert
    expect(result).toEqual(permissions);
  });

  it("returns an empty array when given an empty list", () => {
    // Act
    const result = filterCustomExtensionPermissions([]);

    // Assert
    expect(result).toEqual([]);
  });

  it("filters out every permission listed in HIDDEN_CUSTOM_EXTENSION_PERMISSIONS", () => {
    // Arrange
    const permissions: PermissionFragment[] = HIDDEN_CUSTOM_EXTENSION_PERMISSIONS.map(code => ({
      __typename: "Permission" as const,
      name: code,
      code,
    }));

    // Act
    const result = filterCustomExtensionPermissions(permissions);

    // Assert
    expect(result).toEqual([]);
  });
});
