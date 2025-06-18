/* eslint-disable @typescript-eslint/no-var-requires */
import { ExtensionWithParams } from "@dashboard/extensions/types";
import { AppExtensionMountEnum, PermissionEnum } from "@dashboard/graphql";
import { renderHook } from "@testing-library/react-hooks";

import { useExtensions } from "./useExtensions";

const mockOpenApp = jest.fn();

jest.mock("../new-tab-actions", () => ({
  newTabActions: {
    openGETinNewTab: jest.fn(),
    openPOSTinNewTab: jest.fn(),
  },
}));

jest.mock("@dashboard/auth/hooks/useUserPermissions");
jest.mock("@dashboard/graphql");
jest.mock("../components/ExternalAppContext", () => ({
  useExternalApp: () => ({
    openApp: mockOpenApp,
  }),
}));

import { newTabActions } from "../new-tab-actions";

const useUserPermissionsMock = jest.fn();
const useExtensionListQueryMock = jest.fn();

// Import the mocked modules
const { useUserPermissions } = require("@dashboard/auth/hooks/useUserPermissions");
const { useExtensionListQuery } = require("@dashboard/graphql");

// Set up the mocks
useUserPermissions.mockImplementation(useUserPermissionsMock);
useExtensionListQuery.mockImplementation(useExtensionListQueryMock);

describe("Extensions / hooks / useExtensions", () => {
  const mockExtensionsData = {
    appExtensions: {
      edges: [
        {
          node: {
            id: "ext1",
            accessToken: "token1",
            permissions: [{ code: PermissionEnum.MANAGE_ORDERS }],
            url: "https://example.com/ext1",
            label: "Extension 1",
            mount: AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE,
            target: "POPUP",
            app: {
              id: "app1",
              name: "Test App 1",
            },
          },
        },
        {
          node: {
            id: "ext2",
            accessToken: "token2",
            permissions: [{ code: PermissionEnum.MANAGE_PRODUCTS }],
            url: "https://example.com/ext2",
            label: "Extension 2",
            mount: AppExtensionMountEnum.PRODUCT_DETAILS_MORE_ACTIONS,
            target: "APP_PAGE",
            app: {
              id: "app2",
              name: "Test App 2",
            },
          },
        },
        {
          node: {
            id: "ext3",
            accessToken: null,
            permissions: [{ code: PermissionEnum.MANAGE_CHANNELS }],
            url: "https://example.com/ext3",
            label: "Extension 3",
            mount: AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE,
            target: "POPUP",
            app: {
              id: "app3",
              name: "Test App 3",
            },
          },
        },
        {
          node: {
            id: "ext4",
            accessToken: "token4",
            permissions: [{ code: PermissionEnum.MANAGE_PRODUCTS }],
            url: "https://example.com/ext4",
            label: "Extension 4",
            mount: AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE,
            target: "NEW_TAB",
            app: {
              id: "app4",
              name: "Test App 4",
            },
          },
        },
        {
          node: {
            id: "ext5",
            accessToken: "token5",
            permissions: [{ code: PermissionEnum.MANAGE_PRODUCTS }],
            url: "https://example.com/ext5",
            label: "Extension 5",
            mount: AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE,
            target: "NEW_TAB",
            app: {
              id: "app5",
              name: "Test App 5",
            },
            options: {
              __typename: "AppExtensionOptionsNewTab",
              newTabTarget: { method: "POST" },
            },
          },
        },
        {
          node: {
            id: "ext6",
            accessToken: "token6",
            permissions: [{ code: PermissionEnum.MANAGE_PRODUCTS }],
            url: "/ext6",
            label: "Extension 6",
            mount: AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE,
            target: "NEW_TAB",
            app: {
              id: "app6",
              name: "Test App 6",
              appUrl: "https://app6.example.com",
            },
            options: {
              __typename: "AppExtensionOptionsNewTab",
              newTabTarget: { method: "GET" },
            },
          },
        },
        {
          node: {
            id: "ext7",
            accessToken: "token7",
            permissions: [{ code: PermissionEnum.MANAGE_PRODUCTS }],
            url: "/ext7",
            label: "Extension 7",
            mount: AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE,
            target: "NEW_TAB",
            app: {
              id: "app7",
              name: "Test App 7",
              appUrl: "https://app7.example.com",
            },
            options: {
              __typename: "AppExtensionOptionsNewTab",
              newTabTarget: { method: "POST" },
            },
          },
        },
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch and return extensions grouped by mount", () => {
    // Arrange
    useUserPermissionsMock.mockReturnValue([
      { code: PermissionEnum.MANAGE_APPS },
      { code: PermissionEnum.MANAGE_ORDERS },
    ]);
    useExtensionListQueryMock.mockReturnValue({ data: mockExtensionsData });

    const mountList = [
      AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE,
      AppExtensionMountEnum.PRODUCT_DETAILS_MORE_ACTIONS,
    ];

    // Act
    const { result } = renderHook(() => useExtensions(mountList));

    // Assert
    expect(useExtensionListQueryMock).toHaveBeenCalledWith({
      fetchPolicy: "cache-first",
      variables: {
        filter: {
          mount: mountList,
        },
      },
    });

    expect(result.current).toEqual({
      [AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE]: [
        expect.objectContaining({
          id: "ext1",
          accessToken: "token1",
          permissions: [PermissionEnum.MANAGE_ORDERS],
          url: "https://example.com/ext1",
          label: "Extension 1",
          mount: AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE,
          app: expect.objectContaining({
            id: "app1",
            name: "Test App 1",
          }),
          open: expect.any(Function),
        }),
        expect.objectContaining({
          id: "ext3",
          accessToken: "", // Should default to empty string when null
          permissions: [PermissionEnum.MANAGE_CHANNELS],
          url: "https://example.com/ext3",
          label: "Extension 3",
          mount: AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE,
          app: expect.objectContaining({
            id: "app3",
            name: "Test App 3",
          }),
          open: expect.any(Function),
        }),
        expect.objectContaining({
          id: "ext4",
          accessToken: "token4",
          permissions: [PermissionEnum.MANAGE_PRODUCTS],
          url: "https://example.com/ext4",
          label: "Extension 4",
          mount: AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE,
          app: expect.objectContaining({
            id: "app4",
            name: "Test App 4",
          }),
          open: expect.any(Function),
        }),
        expect.objectContaining({
          id: "ext5",
          accessToken: "token5",
          permissions: [PermissionEnum.MANAGE_PRODUCTS],
          url: "https://example.com/ext5",
          label: "Extension 5",
          mount: AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE,
          app: expect.objectContaining({
            id: "app5",
            name: "Test App 5",
          }),
          open: expect.any(Function),
        }),
        expect.objectContaining({
          id: "ext6",
          accessToken: "token6",
          permissions: [PermissionEnum.MANAGE_PRODUCTS],
          url: "/ext6",
          label: "Extension 6",
          mount: AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE,
          app: expect.objectContaining({
            id: "app6",
            name: "Test App 6",
            appUrl: "https://app6.example.com",
          }),
          open: expect.any(Function),
        }),
        expect.objectContaining({
          id: "ext7",
          accessToken: "token7",
          permissions: [PermissionEnum.MANAGE_PRODUCTS],
          url: "/ext7",
          label: "Extension 7",
          mount: AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE,
          app: expect.objectContaining({
            id: "app7",
            name: "Test App 7",
            appUrl: "https://app7.example.com",
          }),
          open: expect.any(Function),
        }),
      ],
      [AppExtensionMountEnum.PRODUCT_DETAILS_MORE_ACTIONS]: [
        expect.objectContaining({
          id: "ext2",
          accessToken: "token2",
          permissions: [PermissionEnum.MANAGE_PRODUCTS],
          url: "https://example.com/ext2",
          label: "Extension 2",
          mount: AppExtensionMountEnum.PRODUCT_DETAILS_MORE_ACTIONS,
          app: expect.objectContaining({
            id: "app2",
            name: "Test App 2",
          }),
          open: expect.any(Function),
        }),
      ],
    });
  });

  it("should handle empty extensions data from GraphQL", () => {
    // Arrange
    useUserPermissionsMock.mockReturnValue([{ code: PermissionEnum.MANAGE_APPS }]);
    useExtensionListQueryMock.mockReturnValue({ data: { appExtensions: { edges: [] } } });

    const mountList = [AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE];

    // Act
    const { result } = renderHook(() => useExtensions(mountList));

    // Assert
    expect(result.current).toEqual({
      [AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE]: [],
    });
  });

  it("should handle undefined data from GraphQL", () => {
    // Arrange
    useUserPermissionsMock.mockReturnValue([{ code: PermissionEnum.MANAGE_APPS }]);
    useExtensionListQueryMock.mockReturnValue({ data: undefined });

    const mountList = [AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE];

    // Act
    const { result } = renderHook(() => useExtensions(mountList));

    // Assert
    expect(result.current).toEqual({
      [AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE]: [],
    });
  });

  it("should call openApp with correct parameters when extension.open is called", () => {
    // Arrange
    useUserPermissionsMock.mockReturnValue([{ code: PermissionEnum.MANAGE_APPS }]);
    useExtensionListQueryMock.mockReturnValue({ data: mockExtensionsData });

    const mountList = [AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE];
    const mockParams = { productIds: ["test-id"] };

    // Act
    const { result } = renderHook(() => useExtensions(mountList));
    const extension = result.current[AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE][0];

    // @ts-expect-error - there are broken types in useExtensions - this hook should return either Extension or ExtensionWithParams
    extension.open(mockParams);

    // Assert
    expect(mockOpenApp).toHaveBeenCalledWith({
      id: "app1",
      appToken: "token1",
      src: "https://example.com/ext1",
      label: "Extension 1",
      target: "POPUP",
      params: mockParams,
    });
  });

  it("should handle extension with null accessToken", () => {
    // Arrange
    useUserPermissionsMock.mockReturnValue([{ code: PermissionEnum.MANAGE_APPS }]);
    useExtensionListQueryMock.mockReturnValue({ data: mockExtensionsData });

    const mountList = [AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE];

    // Act
    const { result } = renderHook(() => useExtensions(mountList));
    const extension = result.current[AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE][1]; // ext3 has null accessToken

    extension.open();

    // Assert
    expect(mockOpenApp).toHaveBeenCalledWith({
      id: "app3",
      appToken: "", // Should use empty string for null accessToken
      src: "https://example.com/ext3",
      label: "Extension 3",
      target: "POPUP",
      params: undefined,
    });
  });

  it("should initialize empty arrays for all provided mount points as default value", () => {
    // Arrange
    useUserPermissionsMock.mockReturnValue([{ code: PermissionEnum.MANAGE_APPS }]);
    useExtensionListQueryMock.mockReturnValue({ data: { appExtensions: { edges: [] } } });

    const mountList = [
      AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE,
      AppExtensionMountEnum.PRODUCT_DETAILS_MORE_ACTIONS,
      AppExtensionMountEnum.NAVIGATION_CATALOG,
    ];

    // Act
    const { result } = renderHook(() => useExtensions(mountList));

    // Assert
    expect(result.current).toEqual({
      [AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE]: [],
      [AppExtensionMountEnum.PRODUCT_DETAILS_MORE_ACTIONS]: [],
      [AppExtensionMountEnum.NAVIGATION_CATALOG]: [],
    });
  });

  it("should use cache-first fetch policy", () => {
    // Arrange
    useUserPermissionsMock.mockReturnValue([{ code: PermissionEnum.MANAGE_APPS }]);
    useExtensionListQueryMock.mockReturnValue({ data: mockExtensionsData });

    const mountList = [AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE];

    // Act
    renderHook(() => useExtensions(mountList));

    // Assert
    expect(useExtensionListQueryMock).toHaveBeenCalledWith(
      expect.objectContaining({
        fetchPolicy: "cache-first",
      }),
    );
  });

  it("should map permissions correctly from code objects to enum values", () => {
    // Arrange
    useUserPermissionsMock.mockReturnValue([{ code: PermissionEnum.MANAGE_APPS }]);
    useExtensionListQueryMock.mockReturnValue({ data: mockExtensionsData });

    const mountList = [AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE];

    // Act
    const { result } = renderHook(() => useExtensions(mountList));

    // Assert
    const extension = result.current[AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE][0];

    expect(extension.permissions).toEqual([PermissionEnum.MANAGE_ORDERS]);
  });

  it("should call newTabActions.openGETinNewTab for NEW_TAB GET extension", () => {
    useUserPermissionsMock.mockReturnValue([{ code: PermissionEnum.MANAGE_APPS }]);
    useExtensionListQueryMock.mockReturnValue({ data: mockExtensionsData });

    const mountList = [AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE];
    const { result } = renderHook(() => useExtensions(mountList));
    const extension = result.current[AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE].find(
      e => e.id === "ext4",
    ) as ExtensionWithParams;

    extension.open({ orderId: "1234" });
    expect(newTabActions.openGETinNewTab).toHaveBeenCalledWith(
      "https://example.com/ext4?orderId=1234",
    );
  });

  it("should call newTabActions.openPOSTinNewTab for NEW_TAB POST extension", () => {
    useUserPermissionsMock.mockReturnValue([{ code: PermissionEnum.MANAGE_APPS }]);
    useExtensionListQueryMock.mockReturnValue({ data: mockExtensionsData });

    const mountList = [AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE];
    const { result } = renderHook(() => useExtensions(mountList));
    const extension = result.current[AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE].find(
      e => e.id === "ext5",
    ) as ExtensionWithParams;

    const params = { productId: "2137" };

    extension.open(params);
    expect(newTabActions.openPOSTinNewTab).toHaveBeenCalledWith({
      appParams: params,
      accessToken: "token5",
      appId: "app5",
      extensionUrl: "https://example.com/ext5",
    });
  });

  it("should call newTabActions.openGETinNewTab for NEW_TAB GET extension with relative url", () => {
    useUserPermissionsMock.mockReturnValue([{ code: PermissionEnum.MANAGE_APPS }]);
    useExtensionListQueryMock.mockReturnValue({ data: mockExtensionsData });

    const mountList = [AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE];
    const { result } = renderHook(() => useExtensions(mountList));
    const extension = result.current[AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE].find(
      e => e.id === "ext6",
    ) as ExtensionWithParams;

    extension.open({ orderId: "1234" });
    expect(newTabActions.openGETinNewTab).toHaveBeenCalledWith(
      "https://app6.example.com/ext6?orderId=1234",
    );
  });

  it("should call newTabActions.openPOSTinNewTab for NEW_TAB POST extension with relative url", () => {
    useUserPermissionsMock.mockReturnValue([{ code: PermissionEnum.MANAGE_APPS }]);
    useExtensionListQueryMock.mockReturnValue({ data: mockExtensionsData });

    const mountList = [AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE];
    const { result } = renderHook(() => useExtensions(mountList));
    const extension = result.current[AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE].find(
      e => e.id === "ext7",
    ) as ExtensionWithParams;
    const params = { productId: "2137" };

    extension.open(params);
    expect(newTabActions.openPOSTinNewTab).toHaveBeenCalledWith({
      appParams: params,
      accessToken: "token7",
      appId: "app7",
      extensionUrl: "https://app7.example.com/ext7",
    });
  });
});
