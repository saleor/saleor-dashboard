import { AppInstallationFragment, JobStatusEnum } from "@dashboard/graphql";
import { renderHook } from "@testing-library/react-hooks";

import { AppListContextValues } from "../context";
import { GetV2SaleorAppsResponse } from "../marketplace.types";
import useAppActions from "./useAppActions";

type AppActions = ReturnType<typeof useAppActions>;

jest.mock("@dashboard/new-apps/context", () => ({
  useAppListContext: jest.fn(
    () =>
      ({
        openAppSettings: jest.fn(),
        removeAppInstallation: jest.fn(),
        retryAppInstallation: jest.fn(),
        openAppInstallPage: jest.fn(),
        openVercelDeploymentPage: jest.fn(),
      } as AppListContextValues),
  ),
}));

describe("App hooks useAppActions", () => {
  it("should return app details when required released app data passed", () => {
    // Arrange
    const app: GetV2SaleorAppsResponse.ReleasedSaleorApp = {
      name: {
        en: "Test app",
      },
      description: {
        en: "Test app description",
      },
      logo: {
        source: "https://www.example.com/logo",
        color: "#000000",
      },
      integrations: [],
      manifestUrl: "https://www.example.com/manifest",
      privacyUrl: "https://www.example.com/privacy",
      supportUrl: "https://www.example.com/support",
      repositoryUrl: "https://www.example.com/repository",
      vercelDeploymentUrl: "https://www.example.com/deployment",
    };

    // Act
    const {
      result: { current },
    } = renderHook(() =>
      useAppActions({
        app,
        appInstallation: undefined,
      }),
    );

    // Assert
    const expectedDetails: AppActions = {
      releaseDate: undefined,
      installHandler: expect.any(Function),
      vercelDeployHandler: expect.any(Function),
      installationPending: false,
      removeInstallHandler: undefined,
      retryInstallHandler: undefined,
    };
    expect(current).toEqual(expectedDetails);
  });

  it("should return app details when required coming soon app data passed", () => {
    // Arrange
    const app: GetV2SaleorAppsResponse.ComingSoonSaleorApp = {
      name: {
        en: "Test app",
      },
      description: {
        en: "Test app description",
      },
      logo: {
        source: "https://www.example.com/logo",
        color: "#000000",
      },
      integrations: [],
      releaseDate: "2019-12-16",
    };

    // Act
    const {
      result: { current },
    } = renderHook(() =>
      useAppActions({
        app,
        appInstallation: undefined,
      }),
    );

    // Assert
    const expectedDetails: AppActions = {
      releaseDate: "2019-12-16",
      installHandler: undefined,
      vercelDeployHandler: undefined,
      installationPending: false,
      removeInstallHandler: undefined,
      retryInstallHandler: undefined,
    };
    expect(current).toEqual(expectedDetails);
  });

  it("should return app details when required app pending installation data passed", () => {
    // Arrange
    const app: GetV2SaleorAppsResponse.ReleasedSaleorApp = {
      name: {
        en: "Test app",
      },
      description: {
        en: "Test app description",
      },
      logo: {
        source: "https://www.example.com/logo",
        color: "#000000",
      },
      integrations: [],
      manifestUrl: "https://www.example.com/manifest",
      privacyUrl: "https://www.example.com/privacy",
      supportUrl: "https://www.example.com/support",
      repositoryUrl: "https://www.example.com/repository",
      vercelDeploymentUrl: "https://www.example.com/deployment",
    };
    const appInstallation: AppInstallationFragment = {
      __typename: "AppInstallation",
      id: "test-installation-id",
      appName: "Test app",
      status: JobStatusEnum.PENDING,
      message: "Test message",
      manifestUrl: "https://www.example.com/manifest",
    };

    // Act
    const {
      result: { current },
    } = renderHook(() =>
      useAppActions({
        app,
        appInstallation,
      }),
    );

    // Assert
    const expectedDetails: AppActions = {
      releaseDate: undefined,
      installHandler: undefined,
      vercelDeployHandler: undefined,
      installationPending: true,
      removeInstallHandler: undefined,
      retryInstallHandler: undefined,
    };
    expect(current).toEqual(expectedDetails);
  });

  it("should return app details when required app failed installation data passed", () => {
    // Arrange
    const app: GetV2SaleorAppsResponse.ReleasedSaleorApp = {
      name: {
        en: "Test app",
      },
      description: {
        en: "Test app description",
      },
      logo: {
        source: "https://www.example.com/logo",
        color: "#000000",
      },
      integrations: [],
      manifestUrl: "https://www.example.com/manifest",
      privacyUrl: "https://www.example.com/privacy",
      supportUrl: "https://www.example.com/support",
      repositoryUrl: "https://www.example.com/repository",
      vercelDeploymentUrl: "https://www.example.com/deployment",
    };
    const appInstallation: AppInstallationFragment = {
      __typename: "AppInstallation",
      id: "test-installation-id",
      appName: "Test app",
      status: JobStatusEnum.FAILED,
      message: "Test message",
      manifestUrl: "https://www.example.com/manifest",
    };

    // Act
    const {
      result: { current },
    } = renderHook(() =>
      useAppActions({
        app,
        appInstallation,
      }),
    );

    // Assert
    const expectedDetails: AppActions = {
      releaseDate: undefined,
      installHandler: undefined,
      vercelDeployHandler: undefined,
      installationPending: false,
      removeInstallHandler: expect.any(Function),
      retryInstallHandler: expect.any(Function),
    };
    expect(current).toEqual(expectedDetails);
  });
});
