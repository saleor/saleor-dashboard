import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { ExtensionWithParams } from "@dashboard/extensions/types";
import { ExtensionListQuery, PermissionEnum, useExtensionListQuery } from "@dashboard/graphql";
import { renderHook } from "@testing-library/react-hooks";

import { useExtensions } from "./useExtensions";

const mockOpenApp = jest.fn();

jest.mock("../new-tab-actions", () => ({
  newTabActions: {
    openGETinNewTab: jest.fn(),
    openPOSTinNewTab: jest.fn(),
  },
}));

jest.mock("@dashboard/auth/hooks/useUserPermissions", () => ({
  useUserPermissions: jest.fn(),
}));

jest.mock("@dashboard/graphql", () => ({
  ...(jest.requireActual("@dashboard/graphql") as jest.Mocked<typeof import("@dashboard/graphql")>),
  useExtensionListQuery: jest.fn(),
}));

jest.mock("../components/AppExtensionContext/AppExtensionContextProvider", () => ({
  useActiveAppExtension: jest.fn(),
}));

import { useActiveAppExtension } from "../components/AppExtensionContext/AppExtensionContextProvider";
import { newTabActions } from "../new-tab-actions";

const useUserPermissionsMock = jest.fn();
const useExtensionListQueryMock = jest.fn();
const useActiveAppExtensionMock = jest.fn();

// Set up the mocks
(useUserPermissions as jest.Mock).mockImplementation(useUserPermissionsMock);
(useExtensionListQuery as jest.Mock).mockImplementation(useExtensionListQueryMock);
(useActiveAppExtension as jest.Mock).mockImplementation(useActiveAppExtensionMock);

describe("Extensions / hooks / useExtensions", () => {
  const mockExtensionsData = {
    appExtensions: {
      edges: [
        {
          node: {
            __typename: "AppExtension",
            id: "ext1",
            accessToken: "token1",
            permissions: [{ code: PermissionEnum.MANAGE_ORDERS, __typename: "Permission" }],
            url: "https://example.com/ext1",
            label: "Extension 1",
            mountName: "PRODUCT_OVERVIEW_CREATE",
            targetName: "POPUP",
            settings: {},
            app: {
              id: "app1",
              name: "Test App 1",
              __typename: "App",
              appUrl: "https://example.com",
              brand: null,
            },
          },
          __typename: "AppExtensionCountableEdge",
        },
        {
          node: {
            id: "ext2",
            accessToken: "token2",
            permissions: [{ code: PermissionEnum.MANAGE_PRODUCTS, __typename: "Permission" }],
            url: "https://example.com/ext2",
            label: "Extension 2",
            mountName: "PRODUCT_DETAILS_MORE_ACTIONS",
            targetName: "APP_PAGE",
            app: {
              id: "app2",
              name: "Test App 2",
              __typename: "App",
              appUrl: "https://example.com",
              brand: null,
            },
            __typename: "AppExtension",
            settings: {},
          },
          __typename: "AppExtensionCountableEdge",
        },
        {
          __typename: "AppExtensionCountableEdge",
          node: {
            id: "ext3",
            accessToken: null,
            permissions: [{ code: PermissionEnum.MANAGE_CHANNELS, __typename: "Permission" }],
            url: "https://example.com/ext3",
            label: "Extension 3",
            mountName: "PRODUCT_OVERVIEW_CREATE",
            targetName: "POPUP",
            app: {
              id: "app3",
              name: "Test App 3",
              __typename: "App",
              appUrl: "https://example.com",
              brand: null,
            },
            __typename: "AppExtension",
            settings: {},
          },
        },
        {
          __typename: "AppExtensionCountableEdge",
          node: {
            id: "ext4",
            accessToken: "token4",
            permissions: [{ code: PermissionEnum.MANAGE_PRODUCTS, __typename: "Permission" }],
            url: "https://example.com/ext4",
            label: "Extension 4",
            mountName: "PRODUCT_OVERVIEW_CREATE",
            targetName: "NEW_TAB",
            app: {
              id: "app4",
              __typename: "App",
              appUrl: "https://example.com",
              brand: null,
              name: "Test App 4",
            },
            __typename: "AppExtension",
            settings: {},
          },
        },
        {
          __typename: "AppExtensionCountableEdge",
          node: {
            id: "ext5",
            accessToken: "token5",
            permissions: [{ code: PermissionEnum.MANAGE_PRODUCTS, __typename: "Permission" }],
            url: "https://example.com/ext5",
            label: "Extension 5",
            mountName: "PRODUCT_OVERVIEW_CREATE",
            targetName: "NEW_TAB",
            app: {
              id: "app5",
              __typename: "App",
              appUrl: "https://example.com",
              brand: null,
              name: "Test App 5",
            },
            settings: {
              newTabTarget: { method: "POST" },
            },
            __typename: "AppExtension",
          },
        },
        {
          __typename: "AppExtensionCountableEdge",
          node: {
            id: "ext6",
            accessToken: "token6",
            permissions: [{ code: PermissionEnum.MANAGE_PRODUCTS, __typename: "Permission" }],
            url: "/ext6",
            label: "Extension 6",
            mountName: "PRODUCT_OVERVIEW_CREATE",
            targetName: "NEW_TAB",
            app: {
              id: "app6",
              __typename: "App",
              brand: null,
              name: "Test App 6",
              appUrl: "https://app6.example.com",
            },
            settings: {
              newTabTarget: { method: "GET" },
            },
            __typename: "AppExtension",
          },
        },
        {
          __typename: "AppExtensionCountableEdge",
          node: {
            id: "ext7",
            accessToken: "token7",
            permissions: [{ code: PermissionEnum.MANAGE_PRODUCTS, __typename: "Permission" }],
            url: "/ext7",
            label: "Extension 7",
            mountName: "PRODUCT_OVERVIEW_CREATE",
            targetName: "NEW_TAB",
            app: {
              __typename: "App",
              brand: null,
              id: "app7",
              name: "Test App 7",
              appUrl: "https://app7.example.com",
            },
            settings: {
              newTabTarget: { method: "POST" },
            },
            __typename: "AppExtension",
          },
        },
      ],
      __typename: "AppExtensionCountableConnection",
    },
    __typename: "Query",
  } satisfies ExtensionListQuery;

  beforeEach(() => {
    jest.clearAllMocks();
    useActiveAppExtensionMock.mockReturnValue({ activate: mockOpenApp });
  });

  it("should fetch and return extensions grouped by mount", () => {
    // Arrange
    useUserPermissionsMock.mockReturnValue([
      { code: PermissionEnum.MANAGE_APPS },
      { code: PermissionEnum.MANAGE_ORDERS },
    ]);
    useExtensionListQueryMock.mockReturnValue({ data: mockExtensionsData });

    const mountList = ["PRODUCT_OVERVIEW_CREATE", "PRODUCT_DETAILS_MORE_ACTIONS"] as const;

    // Act
    const { result } = renderHook(() => useExtensions(mountList));

    // Assert
    expect(useExtensionListQueryMock).toHaveBeenCalledWith({
      fetchPolicy: "cache-first",
      variables: {
        filter: {
          mountName: mountList,
        },
      },
    });

    expect(result.current).toEqual({
      ["PRODUCT_OVERVIEW_CREATE"]: [
        expect.objectContaining({
          id: "ext1",
          accessToken: "token1",
          permissions: [PermissionEnum.MANAGE_ORDERS],
          url: "https://example.com/ext1",
          label: "Extension 1",
          mountName: "PRODUCT_OVERVIEW_CREATE",
          targetName: "POPUP",
          settings: {},
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
          mountName: "PRODUCT_OVERVIEW_CREATE",
          targetName: "POPUP",
          settings: {},
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
          mountName: "PRODUCT_OVERVIEW_CREATE",
          targetName: "NEW_TAB",
          settings: {},
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
          mountName: "PRODUCT_OVERVIEW_CREATE",
          targetName: "NEW_TAB",
          settings: { newTabTarget: { method: "POST" } },
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
          mountName: "PRODUCT_OVERVIEW_CREATE",
          targetName: "NEW_TAB",
          settings: { newTabTarget: { method: "GET" } },
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
          mountName: "PRODUCT_OVERVIEW_CREATE",
          targetName: "NEW_TAB",
          settings: { newTabTarget: { method: "POST" } },
          app: expect.objectContaining({
            id: "app7",
            name: "Test App 7",
            appUrl: "https://app7.example.com",
          }),
          open: expect.any(Function),
        }),
      ],
      ["PRODUCT_DETAILS_MORE_ACTIONS"]: [
        expect.objectContaining({
          id: "ext2",
          accessToken: "token2",
          permissions: [PermissionEnum.MANAGE_PRODUCTS],
          url: "https://example.com/ext2",
          label: "Extension 2",
          mountName: "PRODUCT_DETAILS_MORE_ACTIONS",
          targetName: "APP_PAGE",
          settings: {},
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

    const mountList = ["PRODUCT_OVERVIEW_CREATE"] as const;

    // Act
    const { result } = renderHook(() => useExtensions(mountList));

    // Assert
    expect(result.current).toEqual({
      ["PRODUCT_OVERVIEW_CREATE"]: [],
    });
  });

  it("should handle undefined data from GraphQL", () => {
    // Arrange
    useUserPermissionsMock.mockReturnValue([{ code: PermissionEnum.MANAGE_APPS }]);
    useExtensionListQueryMock.mockReturnValue({ data: undefined });

    const mountList = ["PRODUCT_OVERVIEW_CREATE"] as const;

    // Act
    const { result } = renderHook(() => useExtensions(mountList));

    // Assert
    expect(result.current).toEqual({
      ["PRODUCT_OVERVIEW_CREATE"]: [],
    });
  });

  it("should call openApp with correct parameters when extension.open is called", () => {
    // Arrange
    useUserPermissionsMock.mockReturnValue([{ code: PermissionEnum.MANAGE_APPS }]);
    useExtensionListQueryMock.mockReturnValue({ data: mockExtensionsData });

    const mountList = ["PRODUCT_OVERVIEW_CREATE"] as const;
    const mockParams = { productIds: ["test-id"] };

    // Act
    const { result } = renderHook(() => useExtensions(mountList));
    const extension = result.current["PRODUCT_OVERVIEW_CREATE"][0] as ExtensionWithParams;

    extension.open(mockParams);

    // Assert
    expect(mockOpenApp).toHaveBeenCalledWith({
      id: "app1",
      appToken: "token1",
      src: "https://example.com/ext1",
      label: "Extension 1",
      targetName: "POPUP",
      params: mockParams,
      formState: {},
    });
  });

  it("should handle extension with null accessToken", () => {
    // Arrange
    useUserPermissionsMock.mockReturnValue([{ code: PermissionEnum.MANAGE_APPS }]);
    useExtensionListQueryMock.mockReturnValue({ data: mockExtensionsData });

    const mountList = ["PRODUCT_OVERVIEW_CREATE"] as const;

    // Act
    const { result } = renderHook(() => useExtensions(mountList));
    const extension = result.current["PRODUCT_OVERVIEW_CREATE"][1] as ExtensionWithParams; // ext3 has null accessToken

    extension.open({});

    // Assert
    expect(mockOpenApp).toHaveBeenCalledWith({
      id: "app3",
      appToken: "", // Should use empty string for null accessToken
      src: "https://example.com/ext3",
      label: "Extension 3",
      targetName: "POPUP",
      params: {},
      formState: {},
    });
  });

  it("should initialize empty arrays for all provided mount points as default value", () => {
    // Arrange
    useUserPermissionsMock.mockReturnValue([{ code: PermissionEnum.MANAGE_APPS }]);
    useExtensionListQueryMock.mockReturnValue({ data: { appExtensions: { edges: [] } } });

    const mountList = [
      "PRODUCT_OVERVIEW_CREATE",
      "PRODUCT_DETAILS_MORE_ACTIONS",
      "NAVIGATION_CATALOG",
    ] as const;

    // Act
    const { result } = renderHook(() => useExtensions(mountList));

    // Assert
    expect(result.current).toEqual({
      ["PRODUCT_OVERVIEW_CREATE"]: [],
      ["PRODUCT_DETAILS_MORE_ACTIONS"]: [],
      ["NAVIGATION_CATALOG"]: [],
    });
  });

  it("should use cache-first fetch policy", () => {
    // Arrange
    useUserPermissionsMock.mockReturnValue([{ code: PermissionEnum.MANAGE_APPS }]);
    useExtensionListQueryMock.mockReturnValue({ data: mockExtensionsData });

    const mountList = ["PRODUCT_OVERVIEW_CREATE"] as const;

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

    const mountList = ["PRODUCT_OVERVIEW_CREATE"] as const;

    // Act
    const { result } = renderHook(() => useExtensions(mountList));

    // Assert
    const extension = result.current["PRODUCT_OVERVIEW_CREATE"][0];

    expect(extension.permissions).toEqual([PermissionEnum.MANAGE_ORDERS]);
  });

  it("should call newTabActions.openGETinNewTab for NEW_TAB GET extension", () => {
    useUserPermissionsMock.mockReturnValue([{ code: PermissionEnum.MANAGE_APPS }]);
    useExtensionListQueryMock.mockReturnValue({ data: mockExtensionsData });

    const mountList = ["PRODUCT_OVERVIEW_CREATE"] as const;
    const { result } = renderHook(() => useExtensions(mountList));
    const extension = result.current["PRODUCT_OVERVIEW_CREATE"].find(
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

    const mountList = ["PRODUCT_OVERVIEW_CREATE"] as const;
    const { result } = renderHook(() => useExtensions(mountList));
    const extension = result.current["PRODUCT_OVERVIEW_CREATE"].find(
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

    const mountList = ["PRODUCT_OVERVIEW_CREATE"] as const;
    const { result } = renderHook(() => useExtensions(mountList));
    const extension = result.current["PRODUCT_OVERVIEW_CREATE"].find(
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

    const mountList = ["PRODUCT_OVERVIEW_CREATE"] as const;
    const { result } = renderHook(() => useExtensions(mountList));
    const extension = result.current["PRODUCT_OVERVIEW_CREATE"].find(
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
