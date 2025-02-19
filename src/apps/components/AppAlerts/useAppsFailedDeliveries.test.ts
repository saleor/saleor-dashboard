import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { PermissionEnum, useAppFailedPendingWebhooksLazyQuery } from "@dashboard/graphql";
import { renderHook } from "@testing-library/react-hooks";

import { useAppsFailedDeliveries } from "./useAppsFailedDeliveries";

jest.mock("@dashboard/auth/hooks/useUserPermissions");
jest.mock("@dashboard/graphql");

const fetchingFunction = jest.fn();

describe("useAppsFailedDeliveries", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle null webhook data", () => {
    // Arrange
    (useUserPermissions as jest.Mock).mockReturnValue([{ code: PermissionEnum.MANAGE_APPS }]);
    (useAppFailedPendingWebhooksLazyQuery as jest.Mock).mockReturnValue([
      fetchingFunction,
      {
        data: {
          apps: {
            edges: [
              {
                node: {
                  webhooks: null,
                },
              },
            ],
          },
        },
      },
    ]);

    // Act
    const { result } = renderHook(() => useAppsFailedDeliveries());

    result.current.fetchAppsWebhooks();

    // Assert
    expect(result.current.hasFailed).toEqual(false);
  });

  it("should handle undefined permissions", () => {
    // Arrange
    (useUserPermissions as jest.Mock).mockReturnValue(undefined);
    (useAppFailedPendingWebhooksLazyQuery as jest.Mock).mockReturnValue([
      fetchingFunction,
      { data: null },
    ]);

    // Act
    const { result } = renderHook(() => useAppsFailedDeliveries());

    expect(result.current.hasFailed).toEqual(false);
  });

  it("should return default counts when user has no permissions", () => {
    // Arrange
    (useUserPermissions as jest.Mock).mockReturnValue([]);
    (useAppFailedPendingWebhooksLazyQuery as jest.Mock).mockReturnValue([
      fetchingFunction,
      { data: null },
    ]);

    // Act
    const { result } = renderHook(() => useAppsFailedDeliveries());

    result.current.fetchAppsWebhooks();

    // Assert
    expect(fetchingFunction).not.toHaveBeenCalled();
    expect(result.current.hasFailed).toEqual(false);
  });

  it("should not flag as fails if there are no failed webhooks", () => {
    // Arrange
    (useUserPermissions as jest.Mock).mockReturnValue([{ code: PermissionEnum.MANAGE_APPS }]);
    (useAppFailedPendingWebhooksLazyQuery as jest.Mock).mockReturnValue([
      fetchingFunction,
      {
        data: {
          apps: {
            edges: [
              {
                node: {
                  webhooks: [
                    {
                      failedDelivers: { edges: [] },
                      pendingDelivers: {
                        edges: [],
                      },
                    },
                    {
                      failedDelivers: { edges: [] },
                      pendingDelivers: { edges: [] },
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    ]);

    // Act
    const { result } = renderHook(() => useAppsFailedDeliveries());

    result.current.fetchAppsWebhooks();

    // Assert
    expect(fetchingFunction).toHaveBeenCalled();
    expect(result.current.hasFailed).toEqual(false);
  });

  it("should check webhooks correctly for pending deliveries when user has permissions", () => {
    // Arrange
    (useUserPermissions as jest.Mock).mockReturnValue([{ code: PermissionEnum.MANAGE_APPS }]);
    (useAppFailedPendingWebhooksLazyQuery as jest.Mock).mockReturnValue([
      fetchingFunction,
      {
        data: {
          apps: {
            edges: [
              {
                node: {
                  webhooks: [
                    {
                      failedDelivers: { edges: [] },
                      pendingDelivers: {
                        edges: [
                          {
                            node: {
                              attempts: {
                                edges: [{ node: { status: "FAILED" } }],
                              },
                            },
                          },
                        ],
                      },
                    },
                    {
                      failedDelivers: { edges: [] },
                      pendingDelivers: null,
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    ]);

    // Act
    const { result } = renderHook(() => useAppsFailedDeliveries());

    result.current.fetchAppsWebhooks();

    // Assert
    expect(fetchingFunction).toHaveBeenCalled();
    expect(result.current.hasFailed).toEqual(true);
  });

  it("should check webhooks correctly when user has permissions", () => {
    // Arrange
    (useUserPermissions as jest.Mock).mockReturnValue([{ code: PermissionEnum.MANAGE_APPS }]);
    (useAppFailedPendingWebhooksLazyQuery as jest.Mock).mockReturnValue([
      fetchingFunction,
      {
        data: {
          apps: {
            edges: [
              {
                node: {
                  webhooks: [
                    {
                      failedDelivers: { edges: [1, 2] },
                      pendingDelivers: [],
                    },
                    {
                      failedDelivers: null,
                      pendingDelivers: {
                        edges: [
                          {
                            node: {
                              attempts: {
                                edges: [{ node: { status: "FAILED" } }],
                              },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    ]);

    // Act
    const { result } = renderHook(() => useAppsFailedDeliveries());

    result.current.fetchAppsWebhooks();

    // Assert
    expect(fetchingFunction).toHaveBeenCalled();
    expect(result.current.hasFailed).toEqual(true);
  });

  it("should check webhooks correctly for both delivery fail types", () => {
    // Arrange
    (useUserPermissions as jest.Mock).mockReturnValue([{ code: PermissionEnum.MANAGE_APPS }]);
    (useAppFailedPendingWebhooksLazyQuery as jest.Mock).mockReturnValue([
      fetchingFunction,
      {
        data: {
          apps: {
            edges: [
              {
                node: {
                  webhooks: [
                    {
                      failedDelivers: { edges: [1, 2] },
                      pendingDelivers: {
                        edges: [
                          {
                            node: {
                              attempts: {
                                edges: [{ node: { status: "FAILED" } }],
                              },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    ]);

    // Act
    const { result } = renderHook(() => useAppsFailedDeliveries());

    result.current.fetchAppsWebhooks();

    // Assert
    expect(fetchingFunction).toHaveBeenCalled();
    expect(result.current.hasFailed).toEqual(true);
  });
});
