import { LatestWebhookDeliveryWithMoment } from "@dashboard/apps/components/AppAlerts/utils";
import { EventDeliveryStatusEnum } from "@dashboard/graphql";
import { render, screen } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import moment from "moment-timezone";
import React from "react";

import { getExtensionInfo, useInstalledExtensions } from "./useInstalledExtensions";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => <>{defaultMessage}</>,
  defineMessages: jest.fn(x => x),
}));

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
}));

describe("InstalledExtensions / hooks / useInstalledExtensions", () => {
  it("should return list of installed extensions", () => {
    // Arrange
    const { result } = renderHook(() => useInstalledExtensions());

    // Assert
    expect(result.current).toEqual({
      installedApps: [
        {
          id: "1",
          name: "Test App",
          logo: "",
          info: expect.any(Object),
          actions: expect.any(Object),
        },
        {
          id: "2",
          name: "Test App 2",
          logo: "",
          info: expect.any(Object),
          actions: expect.any(Object),
        },
      ],
      installedAppsLoading: false,
      refetchInstalledApps: expect.any(Function),
    });
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
      screen.getByText("App disabled. Activate the app from the settings."),
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
