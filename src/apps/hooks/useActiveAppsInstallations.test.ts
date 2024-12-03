import { AppsInstallationsQuery } from "@dashboard/graphql";
import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import { waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

import useActiveAppsInstallations from "./useActiveAppsInstallations";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
}));

jest.mock("@apollo/client", () => ({
  gql: jest.fn(),
  useApolloClient: jest.fn(),
}));

jest.mock("@dashboard/hooks/useLocalStorage");

describe("useActiveAppsInstallations", () => {
  it("install app notify should not be called when apps in progress data loading", () => {
    // Arrange
    const mockedActiveInstallations = [
      {
        id: "1",
        name: "app1",
      },
    ];
    const appInProgressLoading = true;
    const appsInProgressData = {
      appInstallations: [],
    } as unknown as AppsInstallationsQuery;
    const mockNotify = jest.fn();

    (useLocalStorage as jest.Mock).mockReturnValue([mockedActiveInstallations, jest.fn()]);

    renderHook(() =>
      useActiveAppsInstallations({
        appsInProgressData,
        appsInProgressRefetch: jest.fn(),
        appInProgressLoading,
        appsRefetch: jest.fn(),
        installedAppNotify: mockNotify,
        removeInProgressAppNotify: jest.fn(),
        onInstallSuccess: jest.fn(),
        onInstallError: jest.fn(),
        onRemoveInProgressAppSuccess: jest.fn(),
      }),
    );

    expect(mockNotify).not.toHaveBeenCalled();
  });

  it("should call install app notify when apps in progress data loaded and no item found", async () => {
    // Arrange
    const mockedActiveInstallations = [
      {
        id: "1",
        name: "app1",
      },
    ];
    const appsInProgressData = {
      appsInstallations: [
        {
          id: "1",
          appName: "app1",
          status: "PENDING",
        },
      ],
    } as unknown as AppsInstallationsQuery;
    const mockNotify = jest.fn();

    jest.useFakeTimers();

    (useLocalStorage as jest.Mock).mockReturnValue([mockedActiveInstallations, jest.fn()]);

    const { rerender } = renderHook(
      ({ appsInProgressData, appInProgressLoading }) =>
        useActiveAppsInstallations({
          appsInProgressData,
          appsInProgressRefetch: jest.fn(),
          appInProgressLoading,
          appsRefetch: jest.fn(),
          installedAppNotify: mockNotify,
          removeInProgressAppNotify: jest.fn(),
          onInstallSuccess: jest.fn(),
          onInstallError: jest.fn(),
          onRemoveInProgressAppSuccess: jest.fn(),
        }),
      {
        initialProps: {
          appsInProgressData: undefined,
          appInProgressLoading: true,
        } as {
          appsInProgressData: AppsInstallationsQuery | undefined;
          appInProgressLoading: boolean;
        },
      },
    );

    rerender({
      appsInProgressData,
      appInProgressLoading: false,
    });

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalled();
    });

    jest.useRealTimers();
  });
});
