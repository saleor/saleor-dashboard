import { useAppsInstallationsQuery } from "@dashboard/graphql";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import { renderHook } from "@testing-library/react-hooks";

import { usePendingInstallation } from "./usePendingInstallation";

jest.mock("@dashboard/graphql", () => ({
  ...(jest.requireActual("@dashboard/graphql") as object),
  useAppsInstallationsQuery: jest.fn(() => ({
    data: {
      appsInstallations: [
        {
          id: "1",
          status: "PENDING",
          appName: "Test App",
          brand: {
            name: "Test Brand",
            id: "test-brand-id",
          },
        },
        {
          id: "2",
          status: "FAILED",
          appName: "Failed App",
          brand: {
            name: "Failed Brand",
            id: "failed-brand-id",
          },
        },
      ],
    },
    loading: false,
    refetch: jest.fn(),
  })),
}));

jest.mock("./useActiveAppsInstallations", () => ({
  useActiveAppsInstallations: jest.fn(() => ({
    handleRemoveInProgress: jest.fn(),
    deleteInProgressAppOpts: {
      deleteInProgressAppStatus: "PENDING",
    },
    handleAppInstallRetry: jest.fn(),
  })),
}));

jest.mock("@dashboard/hooks/useHasManagedAppsPermission", () => ({
  useHasManagedAppsPermission: jest.fn(() => ({
    useHasManagedAppsPermission: true,
  })),
}));

describe("InstalledExtensions / hooks / usePendingInstallation", () => {
  it("should skip fetching app installations when user doesn't have MANAGE_APP permissions", () => {
    (useHasManagedAppsPermission as jest.Mock).mockReturnValueOnce(false);

    const refetchExtensions = jest.fn();
    const onCloseModal = jest.fn();
    const onFailedInstallationRemove = jest.fn();
    const searchQuery = "";

    renderHook(() =>
      usePendingInstallation({
        refetchExtensions,
        onCloseModal,
        onFailedInstallationRemove,
        searchQuery,
      }),
    );

    expect(useAppsInstallationsQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: true,
      }),
    );
  });

  it("should return list of pending installations", () => {
    // Arrange
    const refetchExtensions = jest.fn();
    const onCloseModal = jest.fn();
    const onFailedInstallationRemove = jest.fn();
    const searchQuery = "";

    const { result } = renderHook(() =>
      usePendingInstallation({
        refetchExtensions,
        onCloseModal,
        onFailedInstallationRemove,
        searchQuery,
      }),
    );

    // Assert
    expect(result.current).toEqual({
      pendingInstallations: [
        {
          id: "1",
          name: "Test App",
          actions: expect.any(Object),
          info: expect.any(Object),
          logo: expect.any(Object),
        },
        {
          id: "2",
          name: "Failed App",
          actions: expect.any(Object),
          info: expect.any(Object),
          logo: expect.any(Object),
        },
      ],
      pendingInstallationsLoading: undefined,
      handleRemoveInProgress: expect.any(Function),
      deleteInProgressAppStatus: undefined,
    });
  });
});
