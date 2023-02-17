import { AppInstallationFragment, JobStatusEnum } from "@dashboard/graphql";
import { intlMock } from "@test/intl";

import { appsInProgress, releasedApp } from "./fixtures";
import { GetV2SaleorAppsResponse } from "./marketplace.types";
import { getAppDetails, resolveInstallationOfMarketplaceApp } from "./utils";

type AppDetails = ReturnType<typeof getAppDetails>;

describe("App utils app details", () => {
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
      githubForkUrl: "https://www.example.com/repository/fork",
    };

    // Act
    const details = getAppDetails({
      intl: intlMock,
      app,
      appInstallation: undefined,
      navigateToAppInstallPage: () => undefined,
      navigateToGithubForkPage: () => undefined,
      removeAppInstallation: () => undefined,
      retryAppInstallation: () => undefined,
    });

    // Assert
    const expectedDetails: AppDetails = {
      releaseDate: undefined,
      installHandler: expect.any(Function),
      githubForkHandler: expect.any(Function),
      installationPending: undefined,
      removeInstallHandler: undefined,
      retryInstallHandler: undefined,
      links: [
        {
          name: expect.any(String),
          url: "https://www.example.com/repository",
        },
        {
          name: expect.any(String),
          url: "https://www.example.com/support",
        },
        {
          name: expect.any(String),
          url: "https://www.example.com/privacy",
        },
      ],
    };
    expect(details).toEqual(expectedDetails);
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
    const details = getAppDetails({
      intl: intlMock,
      app,
      appInstallation: undefined,
      navigateToAppInstallPage: () => undefined,
      navigateToGithubForkPage: () => undefined,
      removeAppInstallation: () => undefined,
      retryAppInstallation: () => undefined,
    });

    // Assert
    const expectedDetails: AppDetails = {
      releaseDate: "2019-12-16",
      installHandler: undefined,
      githubForkHandler: undefined,
      links: [],
      installationPending: undefined,
      removeInstallHandler: undefined,
      retryInstallHandler: undefined,
    };
    expect(details).toEqual(expectedDetails);
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
      githubForkUrl: "https://www.example.com/repository/fork",
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
    const details = getAppDetails({
      intl: intlMock,
      app,
      appInstallation,
      navigateToAppInstallPage: () => undefined,
      navigateToGithubForkPage: () => undefined,
      removeAppInstallation: () => undefined,
      retryAppInstallation: () => undefined,
    });

    // Assert
    const expectedDetails: AppDetails = {
      releaseDate: undefined,
      installHandler: undefined,
      githubForkHandler: undefined,
      links: [
        {
          name: expect.any(String),
          url: "https://www.example.com/repository",
        },
        {
          name: expect.any(String),
          url: "https://www.example.com/support",
        },
        {
          name: expect.any(String),
          url: "https://www.example.com/privacy",
        },
      ],
      installationPending: true,
      removeInstallHandler: undefined,
      retryInstallHandler: undefined,
    };
    expect(details).toEqual(expectedDetails);
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
      githubForkUrl: "https://www.example.com/repository/fork",
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
    const details = getAppDetails({
      intl: intlMock,
      app,
      appInstallation,
      navigateToAppInstallPage: () => undefined,
      navigateToGithubForkPage: () => undefined,
      removeAppInstallation: () => undefined,
      retryAppInstallation: () => undefined,
    });

    // Assert
    const expectedDetails: AppDetails = {
      releaseDate: undefined,
      installHandler: undefined,
      githubForkHandler: undefined,
      links: [
        {
          name: expect.any(String),
          url: "https://www.example.com/repository",
        },
        {
          name: expect.any(String),
          url: "https://www.example.com/support",
        },
        {
          name: expect.any(String),
          url: "https://www.example.com/privacy",
        },
      ],
      installationPending: false,
      removeInstallHandler: expect.any(Function),
      retryInstallHandler: expect.any(Function),
    };
    expect(details).toEqual(expectedDetails);
  });

  describe("App utils resolve apps installations", () => {
    it("should return app installation that has manifest related to passed app details when app installation list and app details are passed", () => {
      // Arrange
      const releasedAppInstallation: AppInstallationFragment = {
        __typename: "AppInstallation",
        id: "test-installation-id",
        appName: releasedApp.name.en,
        status: JobStatusEnum.PENDING,
        message: "Test message",
        manifestUrl: releasedApp.manifestUrl as string,
      };
      const appInstallationList: AppInstallationFragment[] = [
        releasedAppInstallation,
        ...appsInProgress,
      ];

      // Act
      const installation = resolveInstallationOfMarketplaceApp(
        releasedApp,
        appInstallationList,
      );

      // Assert
      expect(installation).toEqual(releasedAppInstallation);
    });
  });
});
