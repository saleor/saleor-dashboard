import { useAppFailedPendingWebhooksLazyQuery } from "@dashboard/graphql";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import { renderHook } from "@testing-library/react-hooks";

import { useAppsFailedDeliveries } from "./useAppsFailedDeliveries";

jest.mock("@dashboard/hooks/useHasManagedAppsPermission");
jest.mock("@dashboard/graphql");

const fetchingFunction = jest.fn();

const hasPermissions = {
  hasManagedAppsPermission: true,
};

const doesntHavePermissions = {
  hasManagedAppsPermission: false,
};

describe("useAppsFailedDeliveries", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle null webhook data", () => {
    // Arrange
    (useHasManagedAppsPermission as jest.Mock).mockReturnValue(hasPermissions);
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

  it("should return hasFailed: false when user has no permissions", () => {
    // Arrange
    (useHasManagedAppsPermission as jest.Mock).mockReturnValue(doesntHavePermissions);
    (useAppFailedPendingWebhooksLazyQuery as jest.Mock).mockReturnValue([
      fetchingFunction,
      { data: null },
    ]);

    // Act
    const { result } = renderHook(() => useAppsFailedDeliveries());

    result.current.fetchAppsWebhooks();

    // Assert
    expect(result.current.hasFailed).toEqual(false);
  });

  it("should not flag as fails if there are no failed webhooks", () => {
    // Arrange
    (useHasManagedAppsPermission as jest.Mock).mockReturnValue(hasPermissions);
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
    (useHasManagedAppsPermission as jest.Mock).mockReturnValue(hasPermissions);
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
    (useHasManagedAppsPermission as jest.Mock).mockReturnValue(hasPermissions);
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
    (useHasManagedAppsPermission as jest.Mock).mockReturnValue(hasPermissions);
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
