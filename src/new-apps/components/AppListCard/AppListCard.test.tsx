import * as context from "@dashboard/new-apps/context";
import {
  comingSoonApp,
  failedAppInProgress,
  pendingAppInProgress,
  releasedApp,
} from "@dashboard/new-apps/fixtures";
import { GetV2SaleorAppsResponse } from "@dashboard/new-apps/marketplace.types";
import { appInstallationStatusMessages } from "@dashboard/new-apps/messages";
import Wrapper from "@test/wrapper";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import AppListCard from "./AppListCard";

jest.mock("@dashboard/new-apps/context", () => ({
  useAppListContext: jest.fn(() => ({
    openAppSettings: jest.fn(),
    removeAppInstallation: jest.fn(),
    retryAppInstallation: jest.fn(),
  })),
}));

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
    images.forEach(image => expect(expectedImages).toContain(image.getAttribute("src")));
    const expectedLinks = [
      releasedApp.privacyUrl,
      releasedApp.repositoryUrl,
      releasedApp.supportUrl,
    ];
    links.forEach(link => expect(expectedLinks).toContain(link.getAttribute("href")));
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
          navigateToGithubForkPage={navigateToVercelDeploymentPage}
        />
      </Wrapper>,
    );
    const user = userEvent.setup();
    const installButton = screen.getByTestId("app-install-button");
    const deployToVercelButton = screen.getByTestId("app-fork-on-github-button");

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
    images.forEach(image => expect(expectedImages).toContain(image.getAttribute("src")));
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

  it("displays app installation details when failed installation data passed", () => {
    // Arrange
    render(
      <Wrapper>
        <AppListCard app={releasedApp} appInstallation={failedAppInProgress} />
      </Wrapper>,
    );
    const status = screen.getByTestId("app-installation-failed");
    const statusDetails = within(status).queryByText(
      appInstallationStatusMessages.failed.defaultMessage,
    );

    // Assert
    expect(statusDetails).toBeTruthy();
  });

  it("displays app installation details when pending installation data passed", () => {
    // Arrange
    render(
      <Wrapper>
        <AppListCard app={releasedApp} appInstallation={pendingAppInProgress} />
      </Wrapper>,
    );
    const status = screen.getByTestId("app-installation-pending");
    const statusText = within(status).queryByText(
      appInstallationStatusMessages.pending.defaultMessage,
    );

    // Assert
    expect(statusText).toBeTruthy();
  });

  it("calls handlers when failed installation data passed and buttons clicked", async () => {
    // Arrange
    const openAppSettings = jest.fn();
    const removeAppInstallation = jest.fn();
    const retryAppInstallation = jest.fn();
    jest.spyOn(context, "useAppListContext").mockImplementation(() => ({
      openAppSettings,
      removeAppInstallation,
      retryAppInstallation,
    }));
    render(
      <Wrapper>
        <AppListCard app={releasedApp} appInstallation={failedAppInProgress} />
      </Wrapper>,
    );
    const user = userEvent.setup();
    const retryButton = screen.getByTestId("app-retry-install-button");
    const removeButton = screen.getByTestId("app-remove-install-button");

    // Act
    await user.click(retryButton);
    await user.click(removeButton);

    // Assert
    expect(retryAppInstallation).toHaveBeenCalledWith(failedAppInProgress.id);
    expect(retryAppInstallation).toHaveBeenCalledTimes(1);
    expect(removeAppInstallation).toHaveBeenCalledWith(failedAppInProgress.id);
    expect(removeAppInstallation).toHaveBeenCalledTimes(1);
  });
});
