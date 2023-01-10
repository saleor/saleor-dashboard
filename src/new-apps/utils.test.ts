import { intlMock } from "@test/intl";

import { GetV2SaleorAppsResponse } from "./marketplace.types";
import { getAppDetails } from "./utils";

type AppDetails = ReturnType<typeof getAppDetails>;

describe("App utils", () => {
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
    const details = getAppDetails(
      intlMock,
      app,
      () => undefined,
      () => undefined,
    );

    // Assert
    const expectedDetails: AppDetails = {
      releaseDate: undefined,
      installHandler: expect.any(Function),
      vercelDeployHandler: expect.any(Function),
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
    const details = getAppDetails(intlMock, app);

    // Assert
    const expectedDetails: AppDetails = {
      releaseDate: "2019-12-16",
      installHandler: undefined,
      vercelDeployHandler: undefined,
      links: [],
    };
    expect(details).toEqual(expectedDetails);
  });
});
