import { useUser } from "@dashboard/auth";
import { PermissionEnum, useAppFailedPendingWebhooksLazyQuery } from "@dashboard/graphql";
import { renderHook } from "@testing-library/react-hooks";

import { useAppsFailedDeliveries } from "./useAppsFailedDeliveries";

jest.mock("@dashboard/auth");
jest.mock("@dashboard/graphql");

const fetchingFunction = jest.fn();

const userWithPermissions = {
  user: {
    userPermissions: [{ code: PermissionEnum.MANAGE_APPS }],
  },
};

const userWithoutPermissions = {
  user: {
    userPermissions: [],
  },
};

describe("useAppsFailedDeliveries", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle null webhook data", () => {
    // Arrange
    (useUser as jest.Mock).mockReturnValue(userWithPermissions);
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

  it("should handle undefined user", () => {
    // Arrange
    (useUser as jest.Mock).mockReturnValue({ user: undefined });
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
    (useUser as jest.Mock).mockReturnValue(userWithoutPermissions);
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
    (useUser as jest.Mock).mockReturnValue(userWithPermissions);
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
    (useUser as jest.Mock).mockReturnValue(userWithPermissions);
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
    (useUser as jest.Mock).mockReturnValue(userWithPermissions);
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
    (useUser as jest.Mock).mockReturnValue(userWithPermissions);
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
