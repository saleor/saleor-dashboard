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
  identifier: null,
  mountName: "HOMEPAGE_WIDGETS",
  url: "https://app.example/widget",
  open: () => undefined,
  targetName: "WIDGET",
  settings: null,
  isSaleorOfficial: false,
  fromCache: false,
  ...overrides,
});

describe("filterHomeExtensions", () => {
  it("treats HOMEPAGE_WIDGETS extensions with no settings as widget (fullscreen default false)", () => {
    // Arrange
    const extensions = [buildExtension({})];

    // Act
    const result = filterHomeExtensions(extensions, userPermissions);

    // Assert
    expect(result.fullscreen).toHaveLength(0);
    expect(result.widgets).toHaveLength(1);
  });

  it("treats explicit homeWidgetTarget.fullscreen=true as fullscreen", () => {
    // Arrange
    const extensions = [
      buildExtension({
        settings: { homeWidgetTarget: { fullscreen: true, method: "GET" } },
      }),
    ];

    // Act
    const result = filterHomeExtensions(extensions, userPermissions);

    // Assert
    expect(result.fullscreen).toHaveLength(1);
    expect(result.widgets).toHaveLength(0);
  });

  it("treats explicit homeWidgetTarget.fullscreen=false as widget", () => {
    // Arrange
    const extensions = [
      buildExtension({
        settings: { homeWidgetTarget: { fullscreen: false, method: "GET" } },
      }),
    ];

    // Act
    const result = filterHomeExtensions(extensions, userPermissions);

    // Assert
    expect(result.fullscreen).toHaveLength(0);
    expect(result.widgets).toHaveLength(1);
  });

  it("treats homeWidgetTarget without explicit fullscreen as widget (default false)", () => {
    // Arrange
    const extensions = [
      buildExtension({
        settings: { homeWidgetTarget: { method: "POST" } },
      }),
    ];

    // Act
    const result = filterHomeExtensions(extensions, userPermissions);

    // Assert
    expect(result.fullscreen).toHaveLength(0);
    expect(result.widgets).toHaveLength(1);
  });

  it("drops extensions with non-HOMEPAGE_WIDGETS mount", () => {
    // Arrange
    const extensions = [buildExtension({ mountName: "PRODUCT_DETAILS_WIDGETS" })];

    // Act
    const result = filterHomeExtensions(extensions, userPermissions);

    // Assert
    expect(result.fullscreen).toHaveLength(0);
    expect(result.widgets).toHaveLength(0);
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
    expect(result.fullscreen).toHaveLength(0);
    expect(result.widgets).toHaveLength(0);
  });

  it("keeps extensions whose required permissions the user has", () => {
    // Arrange
    const extensions = [
      buildExtension({
        permissions: [PermissionEnum.MANAGE_PRODUCTS],
        settings: { homeWidgetTarget: { fullscreen: true, method: "GET" } },
      }),
    ];

    // Act
    const result = filterHomeExtensions(extensions, userPermissions);

    // Assert
    expect(result.fullscreen).toHaveLength(1);
  });

  it("preserves input order within each split", () => {
    // Arrange
    const extensions = [
      buildExtension({
        id: "a",
        label: "A",
        settings: { homeWidgetTarget: { fullscreen: true, method: "GET" } },
      }),
      buildExtension({
        id: "b",
        label: "B",
        settings: { homeWidgetTarget: { fullscreen: false, method: "GET" } },
      }),
      buildExtension({
        id: "c",
        label: "C",
        settings: { homeWidgetTarget: { fullscreen: true, method: "GET" } },
      }),
      buildExtension({
        id: "d",
        label: "D",
        settings: { homeWidgetTarget: { fullscreen: false, method: "GET" } },
      }),
    ];

    // Act
    const result = filterHomeExtensions(extensions, userPermissions);

    // Assert
    expect(result.fullscreen.map(e => e.id)).toEqual(["a", "c"]);
    expect(result.widgets.map(e => e.id)).toEqual(["b", "d"]);
  });

  it("drops extensions with relative url and missing app appUrl", () => {
    // Arrange
    const extensions = [
      buildExtension({
        url: "/widget",
        app: {
          __typename: "App",
          id: "app-1",
          appUrl: null,
          name: "App 1",
          brand: null,
        },
      }),
    ];

    // Act
    const result = filterHomeExtensions(extensions, userPermissions);

    // Assert
    expect(result.fullscreen).toHaveLength(0);
    expect(result.widgets).toHaveLength(0);
  });
});
