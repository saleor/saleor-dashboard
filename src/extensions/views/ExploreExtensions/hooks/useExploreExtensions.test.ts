import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { PermissionEnum, useInstalledAppsQuery, usePluginsQuery } from "@dashboard/graphql";
import { renderHook } from "@testing-library/react-hooks";

import { useAppStoreExtensions } from "./useAppStoreExtensions";
import { useExploreExtensions } from "./useExploreExtensions";

jest.mock("./useAppStoreExtensions");
jest.mock("@dashboard/graphql", () => ({
  ...(jest.requireActual("@dashboard/graphql") as object),
  useInstalledAppsQuery: jest.fn(() => ({
    data: {
      apps: {
        edges: [],
      },
    },
  })),
  usePluginsQuery: jest.fn(() => ({
    data: {
      plugins: {
        edges: [],
      },
    },
  })),
}));

jest.mock("@dashboard/auth/hooks/useUserPermissions");
jest.mock("@dashboard/featureFlags", () => ({
  ...(jest.requireActual("@dashboard/featureFlags") as object),
  useFlag: jest.fn(() => ({ enabled: true })),
}));

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: (x: unknown) => x,
}));

const mockedAppStoreExtensionsAppsOnly = {
  payments: {
    title: "Payments",
    items: [
      {
        id: "app-id-1",
        type: "APP",
        name: "Stripe",
        manifestUrl: "http://example.com/api/manifest",
      },
      {
        id: "app-id-2",
        type: "APP",
        name: "Adyen",
        manifestUrl: "http://example-1.com/api/manifest",
      },
    ],
  },
  cms: {
    title: "CMS",
    items: [
      {
        id: "app-id-3",
        type: "APP",
        name: "Strapi",
        manifestUrl: "http://example-2.com/api/manifest",
      },
    ],
  },
  taxes: {
    title: "Taxes",
    items: [
      {
        id: "app-id-4",
        type: "APP",
        name: "TaxJar",
        manifestUrl: "http://example-3.com/api/manifest",
      },
    ],
  },
  automation: { title: "Automation", items: [] },
};

const mockedAppStoreExtensionsWithPlugins = {
  payments: {
    title: "Payments",
    items: [
      {
        id: "app-id-1",
        type: "APP",
        name: "Stripe",
        manifestUrl: "http://example.com/api/manifest",
      },
      {
        id: "app-id-2",
        type: "APP",
        name: "Adyen",
        manifestUrl: "http://example-1.com/api/manifest",
      },
      {
        id: "plugin-id-1",
        type: "PLUGIN",
        name: "Plugin Global Active",
      },
      {
        id: "plugin-id-2",
        type: "PLUGIN",
        name: "Plugin Global Inactive",
      },
      {
        id: "plugin-id-3",
        type: "PLUGIN",
        name: "Plugin Channel Active",
      },
      {
        id: "plugin-id-4",
        type: "PLUGIN",
        name: "Plugin Channel Inactive",
      },
    ],
  },
  cms: {
    title: "CMS",
    items: [
      {
        id: "app-id-3",
        type: "APP",
        name: "Strapi",
        manifestUrl: "http://example-2.com/api/manifest",
      },
    ],
  },
  taxes: {
    title: "Taxes",
    items: [
      {
        id: "app-id-4",
        type: "APP",
        name: "TaxJar",
        manifestUrl: "http://example-3.com/api/manifest",
      },
    ],
  },
  automation: { title: "Automation", items: [] },
};

describe("Extension / hooks / useExploreExtensions", () => {
  const pluginsQueryMock = usePluginsQuery as jest.Mock;

  afterEach(() => {
    pluginsQueryMock.mockClear();
  });

  it("should return loading state when fetching data", () => {
    // Arrange
    (useAppStoreExtensions as jest.Mock).mockReturnValue({
      data: {},
      loading: true,
      error: null,
    });
    (useInstalledAppsQuery as jest.Mock).mockReturnValue({
      data: {
        apps: {
          edges: [],
        },
      },
    });

    // Act
    const { result } = renderHook(() => useExploreExtensions());

    // Assert
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.extensions).toEqual({});
  });

  it("should return extensions data for installed apps ", () => {
    // Arrange
    (useAppStoreExtensions as jest.Mock).mockReturnValue({
      data: mockedAppStoreExtensionsAppsOnly,
      loading: false,
      error: null,
    });
    (useInstalledAppsQuery as jest.Mock).mockReturnValue({
      data: {
        apps: {
          edges: [
            {
              node: {
                id: "id-1",
                identifier: "app-id-1",
                isActive: true,
                manifestUrl: "http://example.com/api/manifest",
              },
            },
            {
              node: {
                id: "id-2",
                identifier: "app-id-2",
                isActive: true,
                manifestUrl: "http://something.com/api/manifest",
              },
            },
            {
              node: {
                id: "id-4",
                identifier: "app-id-4",
                isActive: false,
                manifestUrl: "http://example-3.com/api/manifest",
              },
            },
          ],
        },
      },
    });

    // Act
    const { result } = renderHook(() => useExploreExtensions());

    // Assert
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.extensions).toEqual({
      automation: { title: "Automation", items: [] },
      cms: {
        title: "CMS",
        items: [
          {
            id: "app-id-3",
            type: "APP",
            name: "Strapi",
            manifestUrl: "http://example-2.com/api/manifest",
          },
        ],
      },
      payments: {
        title: "Payments",
        items: [
          {
            id: "app-id-1",
            type: "APP",
            name: "Stripe",
            manifestUrl: "http://example.com/api/manifest",
            installed: true,
            disabled: false,
            isCustomApp: false,
            appId: "id-1",
          },
          {
            appId: "id-2",
            disabled: false,
            id: "app-id-2",
            installed: true,
            isCustomApp: true,
            manifestUrl: "http://example-1.com/api/manifest",
            name: "Adyen",
            type: "APP",
          },
        ],
      },
      taxes: {
        title: "Taxes",
        items: [
          {
            appId: "id-4",
            disabled: true,
            id: "app-id-4",
            installed: true,
            isCustomApp: false,
            manifestUrl: "http://example-3.com/api/manifest",
            name: "TaxJar",
            type: "APP",
          },
        ],
      },
    });
  });

  it("should correctly set 'installed' for PLUGIN extensions based on plugin active state (global and channel)", () => {
    // Arrange
    (useAppStoreExtensions as jest.Mock).mockReturnValue({
      data: mockedAppStoreExtensionsWithPlugins,
      loading: false,
      error: null,
    });
    (useInstalledAppsQuery as jest.Mock).mockReturnValue({
      data: {
        apps: {
          edges: [],
        },
      },
    });
    (usePluginsQuery as jest.Mock).mockReturnValue({
      data: {
        plugins: {
          edges: [
            {
              node: {
                id: "plugin-id-1",
                globalConfiguration: { active: true },
                channelConfigurations: null,
              },
            },
            {
              node: {
                id: "plugin-id-2",
                globalConfiguration: { active: false },
                channelConfigurations: null,
              },
            },
            {
              node: {
                id: "plugin-id-3",
                globalConfiguration: null,
                channelConfigurations: [
                  { channel: { id: "channel-1" }, active: true },
                  { channel: { id: "channel-2" }, active: false },
                ],
              },
            },
            {
              node: {
                id: "plugin-id-4",
                globalConfiguration: null,
                channelConfigurations: [
                  { channel: { id: "channel-1" }, active: false },
                  { channel: { id: "channel-2" }, active: false },
                ],
              },
            },
          ],
        },
      },
    });

    // Act
    const { result } = renderHook(() => useExploreExtensions());

    // Assert
    const pluginExtensions = result.current.extensions.payments.items.filter(
      ext => ext.type === "PLUGIN",
    );

    expect(pluginExtensions).toEqual([
      expect.objectContaining({ id: "plugin-id-1", installed: true }), // global active
      expect.objectContaining({ id: "plugin-id-2", installed: false }), // global inactive
      expect.objectContaining({ id: "plugin-id-3", installed: true }), // channel active
      expect.objectContaining({ id: "plugin-id-4", installed: false }), // channel inactive
    ]);
  });

  it("should not fetch plugins if user does not have MANAGE_PLUGINS permission", () => {
    // Arrange
    (useUserPermissions as jest.Mock).mockReturnValue([
      { __typename: "UserPermission", code: PermissionEnum.MANAGE_USERS, name: "Manage users" },
    ]);
    (useAppStoreExtensions as jest.Mock).mockReturnValue({
      data: mockedAppStoreExtensionsWithPlugins,
      loading: false,
      error: null,
    });
    (useInstalledAppsQuery as jest.Mock).mockReturnValue({
      data: {
        apps: {
          edges: [],
        },
      },
    });

    // Act
    renderHook(() => useExploreExtensions());

    // Assert
    expect(pluginsQueryMock).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: true,
      }),
    );
  });
});
