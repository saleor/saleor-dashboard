import { Extension } from "@dashboard/extensions/hooks/useExtensions";
import { AppExtensionMountEnum, PermissionEnum } from "@dashboard/graphql";
import { orderDraftListUrl, orderListUrl } from "@dashboard/orders/urls";

import { SidebarMenuItem } from "./types";
import { getMenuItemExtension, isMenuActive, mapToExtensionsItems } from "./utils";

jest.mock("@dashboard/apps/urls", () => ({
  AppUrls: {
    resolveDashboardUrlFromAppCompleteUrl: jest.fn(
      (url, appUrl, appId) => `mockAppUrl:${url}:${appUrl}:${appId}`,
    ),
  },
}));

jest.mock("@dashboard/extensions/urls", () => ({
  ExtensionsUrls: {
    resolveDashboardUrlFromAppCompleteUrl: jest.fn(
      (url, appUrl, appId) => `mockExtensionUrl:${url}:${appUrl}:${appId}`,
    ),
  },
}));

// To grab the mocked functions for assertions
const { AppUrls } = jest.requireMock("@dashboard/apps/urls");
const { ExtensionsUrls } = jest.requireMock("@dashboard/extensions/urls");

describe("mapToExtensionsItems", () => {
  beforeEach(() => {
    AppUrls.resolveDashboardUrlFromAppCompleteUrl.mockClear();
    ExtensionsUrls.resolveDashboardUrlFromAppCompleteUrl.mockClear();
  });

  const mockApp: Extension["app"] = {
    __typename: "App",
    id: "app-1",
    appUrl: "https://app.example.com",
  };

  const mockExtension: Extension = {
    id: "test-extension",
    label: "Test Extension",
    app: mockApp,
    url: "/test",
    permissions: [] as PermissionEnum[],
    open: jest.fn(),
    accessToken: "mock-token",
    mount: AppExtensionMountEnum.NAVIGATION_CATALOG,
  };

  const mockHeader: SidebarMenuItem = {
    id: "extensions-header",
    label: "Extensions",
    type: "divider",
  };

  it("should map extensions to menu items when extensions flag is enabled", () => {
    const result = mapToExtensionsItems([mockExtension], mockHeader, true);

    expect(result).toHaveLength(2);
    expect(result[0]).toBe(mockHeader);
    expect(result[1]).toEqual({
      id: "extension-test-extension",
      label: "Test Extension",
      url: "mockExtensionUrl:/test:https://app.example.com:app-1",
      permissions: [] as PermissionEnum[],
      onClick: mockExtension.open,
      type: "item",
    });
    expect(ExtensionsUrls.resolveDashboardUrlFromAppCompleteUrl).toHaveBeenCalledWith(
      mockExtension.url,
      mockExtension.app.appUrl,
      mockExtension.app.id,
    );
    expect(AppUrls.resolveDashboardUrlFromAppCompleteUrl).not.toHaveBeenCalled();
  });

  it("should map extensions to menu items when extensions flag is disabled", () => {
    const result = mapToExtensionsItems([mockExtension], mockHeader, false);

    expect(result).toHaveLength(2);
    expect(result[0]).toBe(mockHeader);
    expect(result[1]).toEqual({
      id: "extension-test-extension",
      label: "Test Extension",
      url: "mockAppUrl:/test:https://app.example.com:app-1",
      permissions: [] as PermissionEnum[],
      onClick: mockExtension.open,
      type: "item",
    });
    expect(AppUrls.resolveDashboardUrlFromAppCompleteUrl).toHaveBeenCalledWith(
      mockExtension.url,
      mockExtension.app.appUrl,
      mockExtension.app.id,
    );
    expect(ExtensionsUrls.resolveDashboardUrlFromAppCompleteUrl).not.toHaveBeenCalled();
  });

  it("should return no menu items if no extensions are provided", () => {
    const result = mapToExtensionsItems([], mockHeader, true);

    expect(result).toHaveLength(0);
  });
});

describe("isMenuActive", () => {
  const mockMenuItem: SidebarMenuItem = {
    id: "test-item",
    label: "Test Item",
    url: "/test",
    type: "item",
  };

  it("should identify menu item as active when current path matches its URL", () => {
    const result = isMenuActive("/test", mockMenuItem);

    expect(result).toBe(true);
  });

  it("should identify menu item as active when current path matches one of its alternative URLs (matchUrls)", () => {
    const menuItemWithMatchUrls: SidebarMenuItem = {
      ...mockMenuItem,
      matchUrls: ["/test/alternative", "/test"],
    };
    const result = isMenuActive("/test/alternative", menuItemWithMatchUrls);

    expect(result).toBe(true);
  });

  it("should identify menu item as inactive when current path matches none of its URLs", () => {
    const result = isMenuActive("/different", mockMenuItem);

    expect(result).toBe(false);
  });

  it("should identify extension (dashboard extensions from apps) menu items as inactive", () => {
    const extensionMenuItem: SidebarMenuItem = {
      ...mockMenuItem,
      id: "extension-test",
    };
    const result = isMenuActive("/test", extensionMenuItem);

    expect(result).toBe(false);
  });

  it("should identify Order List item as inactive when on the Order Drafts page", () => {
    const orderMenuItem: SidebarMenuItem = {
      ...mockMenuItem,
      url: orderListUrl(),
    };
    const result = isMenuActive(orderDraftListUrl(), orderMenuItem);

    expect(result).toBe(false);
  });

  it("should correctly match paths regardless of '/dashboard' prefix in current location", () => {
    const result = isMenuActive("/dashboard/test", mockMenuItem);

    expect(result).toBe(true);
  });

  it("should correctly match paths by ignoring query parameters in current location and item URLs", () => {
    const result = isMenuActive("/test?param=value", mockMenuItem);

    expect(result).toBe(true);
  });

  it("should identify Home menu item (URL '/') as active when current path is root ('/')", () => {
    const homeMenuItem: SidebarMenuItem = {
      ...mockMenuItem,
      url: "/",
    };
    const result = isMenuActive("/", homeMenuItem);

    expect(result).toBe(true);
  });

  it("should identify item as inactive if its main URL is undefined and no alternative URLs match", () => {
    const menuItemWithOnlyMatchUrls: SidebarMenuItem = {
      id: "test-item-match",
      label: "Test Item Match",
      matchUrls: ["/foo", "/bar"],
      type: "item",
    };
    const result = isMenuActive("/baz", menuItemWithOnlyMatchUrls);

    expect(result).toBe(false);
  });

  it("should identify item as active if its main URL is undefined and an alternative URL matches", () => {
    const menuItemWithOnlyMatchUrls: SidebarMenuItem = {
      id: "test-item-match",
      label: "Test Item Match",
      matchUrls: ["/foo", "/bar"],
      type: "item",
    };
    const result = isMenuActive("/foo", menuItemWithOnlyMatchUrls);

    expect(result).toBe(true);
  });

  it("should identify item as inactive if it has no main URL or alternative URLs defined", () => {
    const menuItemWithoutUrls: SidebarMenuItem = {
      id: "test-item-no-urls",
      label: "Test Item No URLs",
      type: "item",
    };
    const result = isMenuActive("/anywhere", menuItemWithoutUrls);

    expect(result).toBe(false);
  });

  it("should identify Order List item as active when on the Order List page", () => {
    const orderMenuItem: SidebarMenuItem = {
      ...mockMenuItem,
      url: orderListUrl(),
    };
    const result = isMenuActive(orderListUrl(), orderMenuItem);

    expect(result).toBe(true);
  });
});

describe("getMenuItemExtension", () => {
  const mockAppDefinition: Extension["app"] = {
    __typename: "App",
    id: "app-1",
    appUrl: "https://app.example.com",
  };

  const baseMockExtension: Extension = {
    id: "base-id",
    label: "Base Label",
    app: mockAppDefinition,
    url: "/base-url",
    permissions: [] as PermissionEnum[],
    open: jest.fn(),
    accessToken: "mock-token",
    mount: AppExtensionMountEnum.NAVIGATION_CATALOG,
  };

  const mockExtension: Extension = {
    ...baseMockExtension,
    id: "test-extension",
    label: "Test Extension",
    app: mockAppDefinition,
    url: "/test",
  };

  const mockExtensionsRecord: Record<AppExtensionMountEnum, Extension[]> = {
    [AppExtensionMountEnum.NAVIGATION_CATALOG]: [mockExtension],
    [AppExtensionMountEnum.CUSTOMER_DETAILS_MORE_ACTIONS]: [],
    [AppExtensionMountEnum.CUSTOMER_OVERVIEW_CREATE]: [],
    [AppExtensionMountEnum.CUSTOMER_OVERVIEW_MORE_ACTIONS]: [],
    [AppExtensionMountEnum.NAVIGATION_CUSTOMERS]: [],
    [AppExtensionMountEnum.NAVIGATION_DISCOUNTS]: [],
    [AppExtensionMountEnum.NAVIGATION_ORDERS]: [],
    [AppExtensionMountEnum.NAVIGATION_PAGES]: [],
    [AppExtensionMountEnum.NAVIGATION_TRANSLATIONS]: [],
    [AppExtensionMountEnum.ORDER_DETAILS_MORE_ACTIONS]: [],
    [AppExtensionMountEnum.ORDER_OVERVIEW_CREATE]: [],
    [AppExtensionMountEnum.ORDER_OVERVIEW_MORE_ACTIONS]: [],
    [AppExtensionMountEnum.PRODUCT_DETAILS_MORE_ACTIONS]: [],
    [AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE]: [],
    [AppExtensionMountEnum.PRODUCT_OVERVIEW_MORE_ACTIONS]: [],
  };

  const emptyExtensionsRecord: Record<AppExtensionMountEnum, Extension[]> = {
    [AppExtensionMountEnum.NAVIGATION_CATALOG]: [],
    [AppExtensionMountEnum.CUSTOMER_DETAILS_MORE_ACTIONS]: [],
    [AppExtensionMountEnum.CUSTOMER_OVERVIEW_CREATE]: [],
    [AppExtensionMountEnum.CUSTOMER_OVERVIEW_MORE_ACTIONS]: [],
    [AppExtensionMountEnum.NAVIGATION_CUSTOMERS]: [],
    [AppExtensionMountEnum.NAVIGATION_DISCOUNTS]: [],
    [AppExtensionMountEnum.NAVIGATION_ORDERS]: [],
    [AppExtensionMountEnum.NAVIGATION_PAGES]: [],
    [AppExtensionMountEnum.NAVIGATION_TRANSLATIONS]: [],
    [AppExtensionMountEnum.ORDER_DETAILS_MORE_ACTIONS]: [],
    [AppExtensionMountEnum.ORDER_OVERVIEW_CREATE]: [],
    [AppExtensionMountEnum.ORDER_OVERVIEW_MORE_ACTIONS]: [],
    [AppExtensionMountEnum.PRODUCT_DETAILS_MORE_ACTIONS]: [],
    [AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE]: [],
    [AppExtensionMountEnum.PRODUCT_OVERVIEW_MORE_ACTIONS]: [],
  };

  it("should return the corresponding Extension object when a menu item ID represents a registered extension", () => {
    const result = getMenuItemExtension(mockExtensionsRecord, "extension-test-extension");

    expect(result).toBe(mockExtension);
  });

  it("should return undefined if a prefixed menu item ID (e.g., 'extension-non-existent') does not match any registered extension", () => {
    const result = getMenuItemExtension(mockExtensionsRecord, "extension-non-existent");

    expect(result).toBeUndefined();
  });

  it("should return undefined if the list of all available extensions is empty", () => {
    const result = getMenuItemExtension(emptyExtensionsRecord, "extension-test-extension");

    expect(result).toBeUndefined();
  });

  it("should find the specific extension when multiple extensions are registered within the same category (mount point)", () => {
    const anotherExtension: Extension = {
      ...baseMockExtension,
      id: "another-extension",
      label: "Another Extension",
      app: { ...mockAppDefinition, id: "app-2" },
      url: "/another",
      mount: AppExtensionMountEnum.NAVIGATION_CATALOG,
    };
    const extensionsWithMultiple = {
      ...emptyExtensionsRecord,
      [AppExtensionMountEnum.NAVIGATION_CATALOG]: [mockExtension, anotherExtension],
    };
    const result = getMenuItemExtension(extensionsWithMultiple, "extension-another-extension");

    expect(result).toBe(anotherExtension);
  });

  it("should find the specific extension even if it's registered in a different category (mount point) than other extensions", () => {
    const catalogExtensionApp: Extension["app"] = {
      __typename: "App",
      id: "app-2",
      appUrl: "https://app2.example.com",
    };
    const catalogExtension: Extension = {
      ...baseMockExtension,
      id: "catalog-ext",
      label: "Catalog Extension",
      app: catalogExtensionApp,
      url: "/catalog-test",
      mount: AppExtensionMountEnum.NAVIGATION_PAGES,
    };
    const extensionsWithMultipleMounts = {
      ...emptyExtensionsRecord,
      [AppExtensionMountEnum.NAVIGATION_CATALOG]: [mockExtension],
      [AppExtensionMountEnum.NAVIGATION_PAGES]: [catalogExtension],
    };
    const result = getMenuItemExtension(extensionsWithMultipleMounts, "extension-catalog-ext");

    expect(result).toBe(catalogExtension);
  });

  it("should return undefined for a prefixed menu item ID (e.g., 'extension-does-not-exist') that doesn't match any registered extension", () => {
    const result = getMenuItemExtension(mockExtensionsRecord, "extension-does-not-exist");

    expect(result).toBeUndefined();
  });

  it("should return undefined for a menu item ID that is not prefixed with 'extension-', confirming it's not an extension type", () => {
    const result = getMenuItemExtension(mockExtensionsRecord, "test-extension"); // Same id as mockExtension, but no prefix

    expect(result).toBeUndefined();
  });
});
