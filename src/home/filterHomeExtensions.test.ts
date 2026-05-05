import { type Extension } from "@dashboard/extensions/types";
import { PermissionEnum, type UserPermissionFragment } from "@dashboard/graphql";

import { filterHomeExtensions } from "./filterHomeExtensions";

const userPermissions: UserPermissionFragment[] = [
  { __typename: "UserPermission", code: PermissionEnum.MANAGE_PRODUCTS, name: "Manage products" },
  { __typename: "UserPermission", code: PermissionEnum.MANAGE_ORDERS, name: "Manage orders" },
];

const buildExtension = (overrides: Partial<Extension>): Extension => ({
  id: "ext-1",
  app: {
    __typename: "App",
    id: "app-1",
    appUrl: "https://app.example",
    name: "App 1",
    brand: null,
  },
  accessToken: "token",
  permissions: [],
  label: "Extension",
  mountName: "HOMEPAGE_WIDGETS",
  url: "https://app.example/widget",
  open: () => undefined,
  targetName: "WIDGET",
  settings: null,
  isSaleorOfficial: false,
  ...overrides,
});

describe("filterHomeExtensions", () => {
  it("keeps HOMEPAGE_WIDGETS extensions with no settings (fullscreen default true)", () => {
    // Arrange
    const extensions = [buildExtension({})];

    // Act
    const result = filterHomeExtensions(extensions, userPermissions);

    // Assert
    expect(result).toHaveLength(1);
  });

  it("keeps HOMEPAGE_WIDGETS extensions with homeWidget.fullscreen=true", () => {
    // Arrange
    const extensions = [
      buildExtension({
        settings: { homeWidget: { fullscreen: true, method: "GET" } },
      }),
    ];

    // Act
    const result = filterHomeExtensions(extensions, userPermissions);

    // Assert
    expect(result).toHaveLength(1);
  });

  it("drops extensions with homeWidget.fullscreen=false", () => {
    // Arrange
    const extensions = [
      buildExtension({
        settings: { homeWidget: { fullscreen: false, method: "GET" } },
      }),
    ];

    // Act
    const result = filterHomeExtensions(extensions, userPermissions);

    // Assert
    expect(result).toHaveLength(0);
  });

  it("drops extensions with non-HOMEPAGE_WIDGETS mount", () => {
    // Arrange
    const extensions = [buildExtension({ mountName: "PRODUCT_DETAILS_WIDGETS" })];

    // Act
    const result = filterHomeExtensions(extensions, userPermissions);

    // Assert
    expect(result).toHaveLength(0);
  });

  it("drops extensions whose required permissions the user lacks", () => {
    // Arrange
    const extensions = [
      buildExtension({
        permissions: [PermissionEnum.MANAGE_USERS],
      }),
    ];

    // Act
    const result = filterHomeExtensions(extensions, userPermissions);

    // Assert
    expect(result).toHaveLength(0);
  });

  it("keeps extensions whose required permissions the user has", () => {
    // Arrange
    const extensions = [
      buildExtension({
        permissions: [PermissionEnum.MANAGE_PRODUCTS],
      }),
    ];

    // Act
    const result = filterHomeExtensions(extensions, userPermissions);

    // Assert
    expect(result).toHaveLength(1);
  });

  it("preserves input order", () => {
    // Arrange
    const extensions = [
      buildExtension({ id: "a", label: "A" }),
      buildExtension({ id: "b", label: "B" }),
      buildExtension({ id: "c", label: "C" }),
    ];

    // Act
    const result = filterHomeExtensions(extensions, userPermissions);

    // Assert
    expect(result.map(e => e.id)).toEqual(["a", "b", "c"]);
  });
});
