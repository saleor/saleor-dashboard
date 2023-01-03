import { comingSoonApp, releasedApp } from "@saleor/new-apps/fixtures";
import { GetV2SaleorAppsResponse } from "@saleor/new-apps/marketplace.types";
import Wrapper from "@test/wrapper";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import AppListCard from "./AppListCard";

describe("Apps AppListCard", () => {
  it("displays released app details when released app data passed", () => {
    // Arrange
    const integrationImages = releasedApp.integrations.map(
      integration => integration.logo.light.source,
    );
    render(
      <Wrapper>
        <AppListCard app={releasedApp} />
      </Wrapper>,
    );
    const name = screen.queryByText(releasedApp.name.en);
    const description = screen.queryByText(releasedApp.description.en);
    const images = screen.getAllByRole("img");
    const links = screen.getAllByRole("link");

    // Assert
    expect(name).toBeTruthy();
    expect(description).toBeTruthy();
    const expectedImages = [releasedApp.logo.source, ...integrationImages];
    images.forEach(image =>
      expect(expectedImages).toContain(image.getAttribute("src")),
    );
    const expectedLinks = [
      releasedApp.privacyUrl,
      releasedApp.repositoryUrl,
      releasedApp.supportUrl,
    ];
    links.forEach(link =>
      expect(expectedLinks).toContain(link.getAttribute("href")),
    );
  });

  it("calls handlers when released app data passed and buttons clicked", async () => {
    // Arrange
    const navigateToAppInstallPage = jest.fn();
    const navigateToVercelDeploymentPage = jest.fn();
    render(
      <Wrapper>
        <AppListCard
          app={releasedApp}
          navigateToAppInstallPage={navigateToAppInstallPage}
          navigateToVercelDeploymentPage={navigateToVercelDeploymentPage}
        />
      </Wrapper>,
    );
    const user = userEvent.setup();
    const installButton = screen.getByTestId("app-install-button");
    const deployToVercelButton = screen.getByTestId(
      "app-deploy-to-vercel-button",
    );

    // Act
    await user.click(installButton);
    await user.click(deployToVercelButton);

    // Assert
    expect(navigateToAppInstallPage).toBeCalledTimes(1);
    expect(navigateToVercelDeploymentPage).toBeCalledTimes(1);
  });

  it("displays coming soon app details when coming soon app data passed", () => {
    // Arrange
    const integrationImages = comingSoonApp.integrations.map(
      integration => integration.logo.light.source,
    );
    render(
      <Wrapper>
        <AppListCard app={comingSoonApp} />
      </Wrapper>,
    );
    const name = screen.queryByText(comingSoonApp.name.en);
    const description = screen.queryByText(comingSoonApp.description.en);
    const images = screen.getAllByRole("img");
    const links = screen.queryAllByRole("link");
    const releaseDate = screen.queryByText(comingSoonApp.releaseDate, {
      exact: false,
    });

    // Assert
    expect(name).toBeTruthy();
    expect(description).toBeTruthy();
    const expectedImages = [comingSoonApp.logo.source, ...integrationImages];
    images.forEach(image =>
      expect(expectedImages).toContain(image.getAttribute("src")),
    );
    expect(links).toHaveLength(0);
    expect(releaseDate).toBeTruthy();
  });

  it("displays placeholder initial when no released app logo passed", () => {
    // Arrange
    const app: GetV2SaleorAppsResponse.ReleasedSaleorApp = {
      ...releasedApp,
      logo: {
        ...releasedApp.logo,
        source: null,
      },
    };
    render(
      <Wrapper>
        <AppListCard app={app} />
      </Wrapper>,
    );
    const logo = screen.getByTestId("app-logo");
    const logoPlaceholder = within(logo).queryByTestId("app-logo-placeholder");
    const logoImage = within(logo).queryByRole("img");

    // Assert
    expect(logoPlaceholder).toBeTruthy();
    expect(logoPlaceholder?.textContent).toBe(app.name.en[0]);
    expect(logoImage).toBeFalsy();
  });

  it("displays placeholder initial when no coming soon app logo passed", () => {
    // Arrange
    const app: GetV2SaleorAppsResponse.ComingSoonSaleorApp = {
      ...comingSoonApp,
      logo: {
        ...comingSoonApp.logo,
        source: null,
      },
    };
    render(
      <Wrapper>
        <AppListCard app={app} />
      </Wrapper>,
    );
    const logo = screen.getByTestId("app-logo");
    const logoPlaceholder = within(logo).queryByTestId("app-logo-placeholder");
    const logoImage = within(logo).queryByRole("img");

    // Assert
    expect(logoPlaceholder).toBeTruthy();
    expect(logoPlaceholder?.textContent).toBe(app.name.en[0]);
    expect(logoImage).toBeFalsy();
  });
});
