import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { PermissionEnum, useAppFailedPendingWebhooksQuery } from "@dashboard/graphql";
import { renderHook } from "@testing-library/react-hooks";

import { useAppsFailedDeliveries } from "./useAppsFailedDeliveries";

jest.mock("@dashboard/auth/hooks/useUserPermissions");
jest.mock("@dashboard/graphql");

describe("useAppsFailedDeliveries", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle null webhook data", () => {
    // Arrange
    (useUserPermissions as jest.Mock).mockReturnValue([{ code: PermissionEnum.MANAGE_APPS }]);
    (useAppFailedPendingWebhooksQuery as jest.Mock).mockReturnValue({
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
    });

    // Act
    const { result } = renderHook(() => useAppsFailedDeliveries());

    // Assert
    expect(result.current).toEqual({ hasFailed: false, hasPending: false });
  });

  it("should handle undefined permissions", () => {
    // Arrange
    (useUserPermissions as jest.Mock).mockReturnValue(undefined);
    (useAppFailedPendingWebhooksQuery as jest.Mock).mockReturnValue({ data: null });

    // Act
    const { result } = renderHook(() => useAppsFailedDeliveries());

    expect(result.current).toEqual({ hasFailed: false, hasPending: false });
  });

  it("should return default counts when user has no permissions", () => {
    // Arrange
    (useUserPermissions as jest.Mock).mockReturnValue([]);
    (useAppFailedPendingWebhooksQuery as jest.Mock).mockReturnValue({ data: null });

    // Act
    const { result } = renderHook(() => useAppsFailedDeliveries());

    // Assert
    expect(result.current).toEqual({ hasFailed: false, hasPending: false });
    expect(useAppFailedPendingWebhooksQuery).toHaveBeenCalledWith({
      skip: true,
    });
  });

  it("should check webhooks correctly for pending deliveries when user has permissions", () => {
    // Arrange
    (useUserPermissions as jest.Mock).mockReturnValue([{ code: PermissionEnum.MANAGE_APPS }]);
    (useAppFailedPendingWebhooksQuery as jest.Mock).mockReturnValue({
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
    });

    // Act
    const { result } = renderHook(() => useAppsFailedDeliveries());

    // rerender();

    // Assert
    expect(result.current.hasPendingFailed).toEqual(true);
    expect(useAppFailedPendingWebhooksQuery).toHaveBeenCalledWith({
      skip: false,
    });
  });

  it("should check webhooks correctly when user has permissions", () => {
    // Arrange
    (useUserPermissions as jest.Mock).mockReturnValue([{ code: PermissionEnum.MANAGE_APPS }]);
    (useAppFailedPendingWebhooksQuery as jest.Mock).mockReturnValue({
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
                    failedDelivers: { edges: [1] },
                    pendingDelivers: [],
                  },
                ],
              },
            },
          ],
        },
      },
    });

    // Act
    const { result } = renderHook(() => useAppsFailedDeliveries());

    // Assert
    expect(result.current.hasFailed).toEqual(true);
    expect(useAppFailedPendingWebhooksQuery).toHaveBeenCalledWith({
      skip: false,
    });
  });
});
