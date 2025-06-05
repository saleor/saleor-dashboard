/* eslint-disable @typescript-eslint/no-var-requires */
import { AppExtensionMountEnum, PermissionEnum } from "@dashboard/graphql";
import { renderHook } from "@testing-library/react-hooks";

import { useExtensions } from "./useExtensions";

const mockOpenApp = jest.fn();

jest.mock("@dashboard/auth/hooks/useUserPermissions");
jest.mock("@dashboard/graphql");
jest.mock("../components/ExternalAppContext", () => ({
  useExternalApp: () => ({
    openApp: mockOpenApp,
  }),
}));

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
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return empty extensions map when user doesn't have MANAGE_APPS permission", () => {
    // Arrange
    useUserPermissionsMock.mockReturnValue([{ code: PermissionEnum.MANAGE_ORDERS }]);
    useExtensionListQueryMock.mockReturnValue({ data: undefined });

    const mountList = [
      AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE,
      AppExtensionMountEnum.PRODUCT_DETAILS_MORE_ACTIONS,
    ];

    // Act
    const { result } = renderHook(() => useExtensions(mountList));

    // Assert
    expect(result.current).toEqual({
      [AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE]: [],
      [AppExtensionMountEnum.PRODUCT_DETAILS_MORE_ACTIONS]: [],
    });

    expect(useExtensionListQueryMock).toHaveBeenCalledWith({
      fetchPolicy: "cache-first",
      variables: {
        filter: {
          mount: mountList,
        },
      },
      skip: true, // Should skip when no MANAGE_APPS permission
    });
  });

  it("should fetch and return extensions grouped by mount when user has MANAGE_APPS permission", () => {
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
      skip: false, // Should not skip when user has MANAGE_APPS permission
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
          app: {
            id: "app1",
            name: "Test App 1",
          },
          open: expect.any(Function),
        }),
        expect.objectContaining({
          id: "ext3",
          accessToken: "", // Should default to empty string when null
          permissions: [PermissionEnum.MANAGE_CHANNELS],
          url: "https://example.com/ext3",
          label: "Extension 3",
          mount: AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE,
          app: {
            id: "app3",
            name: "Test App 3",
          },
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
          app: {
            id: "app2",
            name: "Test App 2",
          },
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
});
