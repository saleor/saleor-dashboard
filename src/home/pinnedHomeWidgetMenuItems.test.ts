import { type ResolvedPreferenceState } from "@dashboard/extensions/preferences/types";
import { type Extension } from "@dashboard/extensions/types";
import { PermissionEnum, type UserPermissionFragment } from "@dashboard/graphql";

import { getPinnedHomeWidgetMenuItems } from "./pinnedHomeWidgetMenuItems";

const userPermissions: UserPermissionFragment[] = [
  { __typename: "UserPermission", code: PermissionEnum.MANAGE_PRODUCTS, name: "Manage products" },
];

const buildExtension = (overrides: Partial<Extension>): Extension => ({
  id: "ext-1",
  app: {
    __typename: "App",
    id: "app-1",
    identifier: null,
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
  settings: { homeWidgetTarget: { fullscreen: true, method: "GET" } },
  isSaleorOfficial: false,
  fromCache: false,
  ...overrides,
});

const pinnedState = (): ResolvedPreferenceState => "pinned";
const defaultState = (): ResolvedPreferenceState => "default";

describe("getPinnedHomeWidgetMenuItems", () => {
  it("maps a pinned fullscreen extension to a Home sub-item linking to its widget route", () => {
    // Arrange
    const extensions = [buildExtension({ id: "ext=1", label: "Analytics" })];

    // Act
    const result = getPinnedHomeWidgetMenuItems(extensions, userPermissions, pinnedState);

    // Assert
    expect(result).toEqual([
      {
        id: "home-widget-ext=1",
        label: "Analytics",
        url: "/home/widget/ext%3D1",
        permissions: [],
        type: "item",
      },
    ]);
  });

  it("skips extensions that are not pinned", () => {
    // Arrange
    const extensions = [buildExtension({})];

    // Act
    const result = getPinnedHomeWidgetMenuItems(extensions, userPermissions, defaultState);

    // Assert
    expect(result).toEqual([]);
  });

  it("skips pinned non-fullscreen widgets, which have no route of their own", () => {
    // Arrange
    const extensions = [
      buildExtension({ settings: { homeWidgetTarget: { fullscreen: false, method: "GET" } } }),
    ];

    // Act
    const result = getPinnedHomeWidgetMenuItems(extensions, userPermissions, pinnedState);

    // Assert
    expect(result).toEqual([]);
  });

  it("skips extensions the user has no permission for", () => {
    // Arrange
    const extensions = [buildExtension({ permissions: [PermissionEnum.MANAGE_ORDERS] })];

    // Act
    const result = getPinnedHomeWidgetMenuItems(extensions, userPermissions, pinnedState);

    // Assert
    expect(result).toEqual([]);
  });

  it("ignores the pin state of extensions from other mounts", () => {
    // Arrange
    const extensions = [buildExtension({ mountName: "PRODUCT_DETAILS_WIDGETS" })];

    // Act
    const result = getPinnedHomeWidgetMenuItems(extensions, userPermissions, pinnedState);

    // Assert
    expect(result).toEqual([]);
  });
});
