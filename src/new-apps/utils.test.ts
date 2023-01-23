import { AppInstallationFragment, JobStatusEnum } from "@dashboard/graphql";

import { appsInProgress, releasedApp } from "./fixtures";
import { resolveInstallationOfMarketplaceApp } from "./utils";

describe("App utils resolve apps installations", () => {
  it("should return app installation that has manifest related to passed app details when app installation list and app details are passed", () => {
    // Arrange
    const releasedAppInstallation: AppInstallationFragment = {
      __typename: "AppInstallation",
      id: "test-installation-id",
      appName: releasedApp.name.en,
      status: JobStatusEnum.PENDING,
      message: "Test message",
      manifestUrl: releasedApp.manifestUrl,
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
