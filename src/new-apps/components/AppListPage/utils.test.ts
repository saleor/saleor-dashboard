import {
  AppListItemFragment,
  AppTypeEnum,
  PermissionEnum,
} from "@saleor/graphql";
import {
  comingSoonApp,
  installedAppsList,
  releasedApp,
} from "@saleor/new-apps/fixtures";

import { AppListPageSections } from "./types";
import {
  getVerifiedInstallableMarketplaceApps,
  getVerifiedInstalledApps,
  resolveSectionsAvailability,
} from "./utils";

describe("App List available sections util", () => {
  it("should return available app list sections when all data are passed", () => {
    // Arrange
    const appSectionsData: AppListPageSections = {
      installedApps: installedAppsList,
      installableMarketplaceApps: [releasedApp],
      comingSoonMarketplaceApps: [comingSoonApp],
    };

    // Act
    const sectionsAvailability = resolveSectionsAvailability(appSectionsData);

    // Assert
    const expectedSectionsAvailability = {
      installed: true,
      all: true,
      comingSoon: true,
    };
    expect(sectionsAvailability).toEqual(expectedSectionsAvailability);
  });

  it("should return no available app list sections when no data are passed", () => {
    // Arrange
    const appSectionsData: AppListPageSections = {
      installedApps: [],
      installableMarketplaceApps: [],
      comingSoonMarketplaceApps: [],
    };

    // Act
    const sectionsAvailability = resolveSectionsAvailability(appSectionsData);

    // Assert
    const expectedSectionsAvailability = {
      installed: false,
      all: false,
      comingSoon: false,
    };
    expect(sectionsAvailability).toEqual(expectedSectionsAvailability);
  });
});

describe("App List verified installed apps util", () => {
  it("should return installed apps list labeled as external properly when some of them are external", () => {
    // Arrange
    const installedApps: AppListItemFragment[] = [
      {
        __typename: "App",
        id: "QXBjPgE3Ng==",
        isActive: true,
        name: "app external",
        type: AppTypeEnum.THIRDPARTY,
        version: "1.0.0",
        appUrl: null,
        manifestUrl: "https://www.example.com/manifest",
        permissions: [
          {
            __typename: "Permission",
            code: PermissionEnum.MANAGE_USERS,
            name: "Manage customers.",
          },
        ],
      },
      {
        __typename: "App",
        id: "QXBwOjE3Ng==",
        isActive: false,
        name: "app local",
        type: AppTypeEnum.THIRDPARTY,
        version: "1.0.0",
        appUrl: "http://localhost:3000",
        manifestUrl: "http://localhost:3000/api/manifest",
        permissions: [
          {
            __typename: "Permission",
            code: PermissionEnum.MANAGE_ORDERS,
            name: "Manage orders.",
          },
          {
            __typename: "Permission",
            code: PermissionEnum.MANAGE_USERS,
            name: "Manage customers.",
          },
        ],
      },
    ];
    const installableMarketplaceApps = [
      {
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
      },
    ];

    // Act
    const verifiedInstalledApps = getVerifiedInstalledApps(
      installedApps,
      installableMarketplaceApps,
    );

    // Assert
    const expectedVerifiedInstalledApps = [
      {
        app: installedApps[0],
        isExternal: false,
      },
      {
        app: installedApps[1],
        isExternal: true,
      },
    ];
    expect(verifiedInstalledApps).toEqual(expectedVerifiedInstalledApps);
  });
});

describe("App List verified installable marketplace apps util", () => {
  it("should return filtered installable marketplace apps list when some of them are already installed", () => {
    // Arrange
    const installedApps: AppListItemFragment[] = [
      {
        __typename: "App",
        id: "QXBjPgE3Ng==",
        isActive: true,
        name: "app external",
        type: AppTypeEnum.THIRDPARTY,
        version: "1.0.0",
        appUrl: null,
        manifestUrl: "https://www.example.com/manifest",
        permissions: [
          {
            __typename: "Permission",
            code: PermissionEnum.MANAGE_USERS,
            name: "Manage customers.",
          },
        ],
      },
      {
        __typename: "App",
        id: "QXBwOjE3Ng==",
        isActive: false,
        name: "app local",
        type: AppTypeEnum.THIRDPARTY,
        version: "1.0.0",
        appUrl: "http://localhost:3000",
        manifestUrl: "http://localhost:3000/api/manifest",
        permissions: [
          {
            __typename: "Permission",
            code: PermissionEnum.MANAGE_ORDERS,
            name: "Manage orders.",
          },
          {
            __typename: "Permission",
            code: PermissionEnum.MANAGE_USERS,
            name: "Manage customers.",
          },
        ],
      },
    ];
    const installableMarketplaceApps = [
      {
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
      },
      {
        name: {
          en: "Test app",
        },
        description: {
          en: "Test app description",
        },
        logo: {
          source: "https://www.example-2.com/logo",
          color: "#000000",
        },
        integrations: [],
        manifestUrl: "https://www.example-2.com/manifest",
        privacyUrl: "https://www.example-2.com/privacy",
        supportUrl: "https://www.example-2.com/support",
        repositoryUrl: "https://www.example-2.com/repository",
        vercelDeploymentUrl: "https://www.example-2.com/deployment",
      },
    ];

    // Act
    const verifiedInstallableMarketplaceApps = getVerifiedInstallableMarketplaceApps(
      installedApps,
      installableMarketplaceApps,
    );

    // Assert
    const expectedVerifiedInstallableMarketplaceApps = [
      installableMarketplaceApps[1],
    ];
    expect(verifiedInstallableMarketplaceApps).toEqual(
      expectedVerifiedInstallableMarketplaceApps,
    );
  });
});
