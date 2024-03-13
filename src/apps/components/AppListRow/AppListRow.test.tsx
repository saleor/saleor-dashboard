import { AppstoreApi } from "@dashboard/apps/appstore.types";
import * as context from "@dashboard/apps/context";
import {
  comingSoonApp,
  failedAppInProgress,
  pendingAppInProgress,
  releasedApp,
} from "@dashboard/apps/fixtures";
import { appInstallationStatusMessages } from "@dashboard/apps/messages";
import Wrapper from "@test/wrapper";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import AppListRow from "./AppListRow";

jest.mock("@dashboard/apps/context", () => ({
  useAppListContext: jest.fn(() => ({
    openAppSettings: jest.fn(),
    removeAppInstallation: jest.fn(),
    retryAppInstallation: jest.fn(),
  })),
}));

jest.mock("@dashboard/config", () => {
  const original = jest.requireActual("@dashboard/config");

  return {
    __esModule: true,
    ...original,
    IS_CLOUD_INSTANCE: true,
  };
});

describe("Apps AppListRow", () => {
  it("displays released app details when released app data passed", () => {
    // Arrange
    const integrationImages = releasedApp.integrations.map(
      integration => integration.logo.light.source,
    );
    render(
      <Wrapper>
        <AppListRow app={releasedApp} />
      </Wrapper>,
    );
    const name = screen.queryAllByText(releasedApp.name.en);
    const description = screen.queryAllByText(releasedApp.description.en);
    const images = screen.getAllByRole("img");
    const links = screen.getAllByRole("link");

    // Assert
    expect(name[0]).toBeTruthy();
    expect(description[0]).toBeTruthy();
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
        <AppListRow
          app={releasedApp}
          navigateToAppInstallPage={navigateToAppInstallPage}
          navigateToGithubForkPage={navigateToVercelDeploymentPage}
        />
      </Wrapper>,
    );
    const user = userEvent.setup();
    const installButton = screen.getAllByTestId("app-install-button");
    const deployToVercelButton = screen.getAllByTestId(
      "app-fork-on-github-button",
    );

    // Act
    await user.click(installButton[0]);
    await user.click(deployToVercelButton[0]);

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
        <AppListRow app={comingSoonApp} />
      </Wrapper>,
    );
    const name = screen.queryAllByText(comingSoonApp.name.en);
    const description = screen.queryAllByText(comingSoonApp.description.en);
    const images = screen.getAllByRole("img");
    const links = screen.queryAllByRole("link");
    const releaseDate = screen.queryAllByText(comingSoonApp.releaseDate, {
      exact: false,
    });

    // Assert
    expect(name[0]).toBeTruthy();
    expect(description[0]).toBeTruthy();
    const expectedImages = [comingSoonApp.logo.source, ...integrationImages];
    images.forEach(image =>
      expect(expectedImages).toContain(image.getAttribute("src")),
    );
    expect(links).toHaveLength(0);
    expect(releaseDate[0]).toBeTruthy();
  });

  it("displays placeholder initial when no released app logo passed", () => {
    // Arrange
    const app: AppstoreApi.ReleasedSaleorApp = {
      ...releasedApp,
      logo: {
        ...releasedApp.logo,
        source: null,
      },
    };
    render(
      <Wrapper>
        <AppListRow app={app} />
      </Wrapper>,
    );
    const logo = screen.getAllByTestId("app-logo");
    const logoPlaceholder = within(logo[0]).queryByTestId(
      "app-logo-placeholder",
    );
    const logoImage = within(logo[0]).queryByRole("img");

    // Assert
    expect(logoPlaceholder).toBeTruthy();
    expect(logoPlaceholder?.textContent).toBe(app.name.en[0]);
    expect(logoImage).toBeFalsy();
  });

  it("displays placeholder initial when no coming soon app logo passed", () => {
    // Arrange
    const app: AppstoreApi.ComingSoonSaleorApp = {
      ...comingSoonApp,
      logo: {
        ...comingSoonApp.logo,
        source: null,
      },
    };
    render(
      <Wrapper>
        <AppListRow app={app} />
      </Wrapper>,
    );
    const logo = screen.getAllByTestId("app-logo");
    const logoPlaceholder = within(logo[0]).queryByTestId(
      "app-logo-placeholder",
    );
    const logoImage = within(logo[0]).queryByRole("img");

    // Assert
    expect(logoPlaceholder).toBeTruthy();
    expect(logoPlaceholder?.textContent).toBe(app.name.en[0]);
    expect(logoImage).toBeFalsy();
  });

  it("displays app installation details when failed installation data passed", () => {
    // Arrange
    render(
      <Wrapper>
        <AppListRow
          app={releasedApp}
          appInstallationList={[failedAppInProgress]}
        />
      </Wrapper>,
    );
    const status = screen.getAllByTestId("app-installation-failed");
    const statusDetails = within(status[0]).queryByText(
      appInstallationStatusMessages.failed.defaultMessage,
    );

    // Assert
    expect(statusDetails).toBeTruthy();
  });

  it("displays app installation details when pending installation data passed", () => {
    // Arrange
    render(
      <Wrapper>
        <AppListRow
          app={releasedApp}
          appInstallationList={[pendingAppInProgress]}
        />
      </Wrapper>,
    );
    const status = screen.getAllByTestId("app-installation-pending");
    const statusText = within(status[0]).queryByText(
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
        <AppListRow
          app={releasedApp}
          appInstallationList={[failedAppInProgress]}
        />
      </Wrapper>,
    );
    const user = userEvent.setup();
    const retryButton = screen.getAllByTestId("app-retry-install-button");
    const removeButton = screen.getAllByTestId("app-remove-install-button");

    // Act
    await user.click(retryButton[0]);
    await user.click(removeButton[0]);

    // Assert
    expect(retryAppInstallation).toHaveBeenCalledWith(failedAppInProgress.id);
    expect(retryAppInstallation).toHaveBeenCalledTimes(1);
    expect(removeAppInstallation).toHaveBeenCalledWith(failedAppInProgress.id);
    expect(removeAppInstallation).toHaveBeenCalledTimes(1);
  });
});
