import { LatestWebhookDeliveryWithMoment } from "@dashboard/extensions/components/AppAlerts/utils";
import { EventDeliveryStatusEnum } from "@dashboard/graphql";
import { render, screen } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import moment from "moment-timezone";
import * as React from "react";

import { getExtensionInfo, useInstalledExtensions } from "./useInstalledExtensions";

jest.mock("@dashboard/components/Link", () => {
  // eslint-disable-next-line react/display-name
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

jest.mock("@dashboard/hooks/useHasManagedAppsPermission", () => ({
  useHasManagedAppsPermission: jest.fn(() => ({
    hasManagedAppsPermission: true,
  })),
}));

const useUserPermissionsMock = jest.fn(() => [{ code: "MANAGE_PLUGINS" }, { code: "MANAGE_APPS" }]);

jest.mock("@dashboard/auth/hooks/useUserPermissions", () => ({
  useUserPermissions: () => useUserPermissionsMock(),
}));

jest.mock("@dashboard/graphql", () => ({
  ...(jest.requireActual("@dashboard/graphql") as object),
  useInstalledAppsListQuery: jest.fn(() => ({
    data: {
      apps: {
        edges: [
          {
            node: {
              id: "1",
              name: "Test App",
              isActive: true,
              type: "THIRDPARTY",
            },
          },
          {
            node: {
              id: "2",
              name: "Test App 2",
              isActive: false,
              type: "THIRDPARTY",
            },
          },
        ],
      },
    },
    refetch: jest.fn(),
  })),
  useEventDeliveryQuery: jest.fn(() => ({
    data: {
      apps: {
        edges: [
          {
            node: {
              id: "1",
              createdAt: new Date().toISOString(),
            },
          },
        ],
      },
    },
  })),
  usePluginsQuery: jest.fn(() => ({
    data: {
      plugins: {
        edges: [
          {
            node: {
              id: "plug1",
              name: "Test Plugin",
              globalConfiguration: {
                active: true,
              },
              channelConfigurations: [],
            },
          },
          {
            node: {
              id: "plug2",
              name: "Test Plugin 2",
              globalConfiguration: {
                active: false,
              },
              channelConfigurations: [],
            },
          },
        ],
      },
    },
  })),
}));

// TODO: Remove this mock when the feature flag is removed
jest.mock("@dashboard/featureFlags", () => ({
  useFlag: jest.fn(() => ({
    enabled: true,
  })),
}));

describe("InstalledExtensions / hooks / useInstalledExtensions", () => {
  afterEach(() => {
    useUserPermissionsMock.mockClear();
  });

  it("should return list of installed extensions with plugins when user has MANAGE_PLUGINS permission", () => {
    // Arrange
    useUserPermissionsMock.mockReturnValue([{ code: "MANAGE_PLUGINS" }, { code: "MANAGE_APPS" }]);

    const { result } = renderHook(() => useInstalledExtensions());

    // Assert
    expect(result.current).toEqual({
      installedExtensions: [
        {
          id: "1",
          name: "Test App",
          logo: expect.any(Object),
          info: null,
          href: expect.any(String),
        },
        {
          id: "2",
          name: "Test App 2",
          logo: expect.any(Object),
          info: expect.any(Object),
          href: expect.any(String),
        },
        {
          id: "plug1",
          name: "Test Plugin",
          logo: expect.any(Object),
          info: null,
          href: expect.any(String),
        },
      ],
      installedAppsLoading: false,
      refetchInstalledApps: expect.any(Function),
    });
  });

  it("should not return plugins when user doesn't have MANAGE_PLUGINS permission", () => {
    // Arrange
    useUserPermissionsMock.mockReturnValue([{ code: "MANAGE_CHANNELS" }]);

    const { result } = renderHook(() => useInstalledExtensions());

    // Assert
    // Should only return apps, not plugins
    expect(result.current.installedExtensions).toHaveLength(2);
    expect(result.current.installedExtensions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "1", name: "Test App" }),
        expect.objectContaining({ id: "2", name: "Test App 2" }),
      ]),
    );

    // Should not include any plugins
    expect(result.current.installedExtensions.some(ext => ext.id === "plug1")).toBe(false);
    expect(result.current.installedExtensions.some(ext => ext.id.startsWith("plug"))).toBe(false);

    // Loading state should be false when apps are loaded, even without MANAGE_PLUGINS permission
    expect(result.current.installedAppsLoading).toBe(false);
  });
});

describe("InstalledExtensions / hooks / useInstalledExtensions / getExtensionInfo", () => {
  it("should return disabled info when extension is not active", () => {
    // Arrange
    const extension = {
      id: "1",
      isActive: false,
      loading: false,
      lastFailedAttempt: null,
    };

    render(getExtensionInfo(extension)!);

    // Assert
    expect(
      screen.getByText("Extension disabled. Activate the extension from the settings."),
    ).toBeInTheDocument();
  });

  it("should return installation pending info when loading is true", () => {
    // Arrange
    const extension = {
      id: "1",
      isActive: true,
      loading: true,
      lastFailedAttempt: null,
    };

    render(getExtensionInfo(extension)!);

    // Assert
    expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
  });

  it("should return webhook warning when last failed attempt is not null", () => {
    // Arrange
    const extension = {
      id: "1",
      isActive: true,
      loading: false,
      lastFailedAttempt: {
        id: "1",
        status: EventDeliveryStatusEnum.FAILED,
        createdAt: moment("2023-10-03T00:00:00Z"),
      } as LatestWebhookDeliveryWithMoment,
    };

    render(getExtensionInfo(extension)!);

    // Assert
    expect(screen.getByText("Webhook errors detected.")).toBeInTheDocument();
  });
});
