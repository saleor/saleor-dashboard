import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { PermissionEnum, useAppFailedPendingWebhooksQuery } from "@dashboard/graphql";
import { renderHook } from "@testing-library/react-hooks";

import { useAllAppsAlert } from "./useAllAppsAlert";

jest.mock("@dashboard/auth/hooks/useUserPermissions");
jest.mock("@dashboard/graphql");

describe("useAllAppsAlert", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle null webhook data", () => {
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

    const { result } = renderHook(() => useAllAppsAlert());

    expect(result.current).toEqual({ hasFailed: false, hasPending: false });
  });

  it("should handle undefined permissions", () => {
    (useUserPermissions as jest.Mock).mockReturnValue(undefined);
    (useAppFailedPendingWebhooksQuery as jest.Mock).mockReturnValue({ data: null });

    const { result } = renderHook(() => useAllAppsAlert());

    expect(result.current).toEqual({ hasFailed: false, hasPending: false });
  });

  it("should return default counts when user has no permissions", () => {
    (useUserPermissions as jest.Mock).mockReturnValue([]);
    (useAppFailedPendingWebhooksQuery as jest.Mock).mockReturnValue({ data: null });

    const { result } = renderHook(() => useAllAppsAlert());

    expect(result.current).toEqual({ hasFailed: false, hasPending: false });
    expect(useAppFailedPendingWebhooksQuery).toHaveBeenCalledWith({
      skip: true,
    });
  });

  it("should count webhooks correctly when user has permissions", () => {
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
                    pendingDelivers: { edges: [1] },
                  },
                  {
                    failedDelivers: { edges: [1] },
                    pendingDelivers: { edges: [1, 2] },
                  },
                ],
              },
            },
          ],
        },
      },
    });

    const { result } = renderHook(() => useAllAppsAlert());

    expect(result.current).toEqual({ hasFailed: true, hasPending: true });
    expect(useAppFailedPendingWebhooksQuery).toHaveBeenCalledWith({
      skip: false,
    });
  });
});
