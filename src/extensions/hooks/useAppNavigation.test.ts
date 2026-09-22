import {
  type InstalledAppSnapshotNode,
  writeInstalledAppsSnapshot,
} from "@dashboard/extensions/installed-apps-snapshot";
import { AppTypeEnum } from "@dashboard/graphql";
import { act, renderHook } from "@testing-library/react";

import { useAppNavigation } from "./useAppNavigation";

const mockApolloQuery = jest.fn();

jest.mock("@apollo/client", () => {
  const actualModule = jest.requireActual("@apollo/client");

  return {
    ...actualModule,
    useApolloClient: () => ({ query: mockApolloQuery }),
  };
});

const mockNavigate = jest.fn();

jest.mock("@dashboard/hooks/useNavigator", () => () => mockNavigate);

const targetApp: InstalledAppSnapshotNode = {
  __typename: "App",
  id: "target-app-id",
  identifier: "target.app",
  isActive: true,
  type: AppTypeEnum.THIRDPARTY,
  appUrl: "https://target.example.com/app",
};

describe("useAppNavigation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockApolloQuery.mockResolvedValue({ data: { apps: { edges: [{ node: targetApp }] } } });
  });

  it("Resolves app id from the cached apps, without hitting the API", async () => {
    // Arrange
    writeInstalledAppsSnapshot([targetApp]);

    const { result } = renderHook(() => useAppNavigation());

    // Act
    const appId = await act(() => result.current.resolveAppIdFromIdentifier("target.app"));

    // Assert
    expect(appId).toBe("target-app-id");
    expect(mockApolloQuery).not.toHaveBeenCalled();
  });

  it("Falls back to the API and refreshes the cache when identifier is not cached", async () => {
    // Arrange
    const { result } = renderHook(() => useAppNavigation());

    // Act
    const appId = await act(() => result.current.resolveAppIdFromIdentifier("target.app"));

    // Assert
    expect(appId).toBe("target-app-id");
    expect(mockApolloQuery).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem("dashboard-installed-apps-snapshot")).toContain("target-app-id");
  });

  it("Navigates to the app URL with appended path", async () => {
    // Arrange
    writeInstalledAppsSnapshot([targetApp]);

    const { result } = renderHook(() => useAppNavigation());

    // Act
    const navigated = await act(() =>
      result.current.navigateToApp({ identifier: "target.app", path: "/settings" }),
    );

    // Assert
    expect(navigated).toBe(true);
    expect(mockNavigate).toHaveBeenCalledWith("/extensions/app/target-app-id/settings?", {
      replace: undefined,
    });
  });

  it("Navigates to the app root when no path is passed", async () => {
    // Arrange
    writeInstalledAppsSnapshot([targetApp]);

    const { result } = renderHook(() => useAppNavigation());

    // Act
    await act(() => result.current.navigateToApp({ identifier: "target.app", replace: true }));

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith("/extensions/app/target-app-id?", { replace: true });
  });

  it("Does not navigate when no app with such identifier is installed", async () => {
    // Arrange
    const { result } = renderHook(() => useAppNavigation());

    // Act
    const navigated = await act(() =>
      result.current.navigateToApp({ identifier: "not.installed.app" }),
    );

    // Assert
    expect(navigated).toBe(false);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
