import { getAppsConfig } from "@dashboard/config";
import {
  AppListContext,
  AppListContextValues,
} from "@dashboard/new-apps/context";
import { activeApp } from "@dashboard/new-apps/fixtures";
import { InstalledApp } from "@dashboard/new-apps/types";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { MemoryRouter as Router } from "react-router-dom";

import InstalledAppListRow from "./InstalledAppListRow";

const Component = ({
  data,
  context,
}: {
  data: InstalledApp;
  context: AppListContextValues;
}) => (
  <Wrapper>
    <Router>
      <AppListContext.Provider value={context}>
        <InstalledAppListRow {...data} />
      </AppListContext.Provider>
    </Router>
  </Wrapper>
);

describe("Apps InstalledAppListRow", () => {
  it("displays app details when basic app data passed", () => {
    // Arrange
    const openAppSettings = jest.fn();
    const removeAppInstallation = jest.fn();
    const retryAppInstallation = jest.fn();
    render(
      <Component
        data={{
          app: activeApp,
          isExternal: false,
        }}
        context={{
          openAppSettings,
          removeAppInstallation,
          retryAppInstallation,
        }}
      />,
    );
    const name = screen.queryByText(activeApp.name as string);
    const version = screen.queryByText(activeApp.version as string, {
      exact: false,
    });
    // TODO: Uncomment this when manifests are added back in the UI
    // const manifestDomain = screen.queryByText(
    //   new URL(activeApp.manifestUrl as string).host,
    // );
    const externalLabel = screen.queryByTestId("app-external-label");
    const tunnelLabel = screen.queryByTestId("app-tunnel-label");

    // Assert
    expect(name).toBeTruthy();
    expect(version).toBeTruthy();
    // TODO: Uncomment this when manifests are added back in the UI
    // expect(manifestDomain).toBeTruthy();
    expect(externalLabel).toBeFalsy();
    expect(tunnelLabel).toBeFalsy();
  });

  it("displays external label when app is external", () => {
    // Arrange
    const openAppSettings = jest.fn();
    const removeAppInstallation = jest.fn();
    const retryAppInstallation = jest.fn();
    render(
      <Component
        data={{
          app: activeApp,
          isExternal: true,
        }}
        context={{
          openAppSettings,
          removeAppInstallation,
          retryAppInstallation,
        }}
      />,
    );
    const externalLabel = screen.queryByTestId("app-external-label");

    // Assert
    expect(externalLabel).toBeTruthy();
  });

  it("displays tunnnel label when app is served via tunnnel", () => {
    // Arrange
    const openAppSettings = jest.fn();
    const removeAppInstallation = jest.fn();
    const retryAppInstallation = jest.fn();
    const AppsConfig = getAppsConfig();
    render(
      <Component
        data={{
          app: {
            ...activeApp,
            appUrl: `https://example${AppsConfig.tunnelUrlKeywords[0]}`,
            manifestUrl: `https://example${AppsConfig.tunnelUrlKeywords[0]}/api/manifest`,
          },
          isExternal: false,
        }}
        context={{
          openAppSettings,
          removeAppInstallation,
          retryAppInstallation,
        }}
      />,
    );
    const tunnelLabel = screen.queryByTestId("app-tunnel-label");

    // Assert
    expect(tunnelLabel).toBeTruthy();
  });

  it("calls handlers when app data passed and buttons clicked", async () => {
    // Arrange
    const openAppSettings = jest.fn();
    const removeAppInstallation = jest.fn();
    const retryAppInstallation = jest.fn();
    render(
      <Component
        data={{
          app: activeApp,
          isExternal: false,
        }}
        context={{
          openAppSettings,
          removeAppInstallation,
          retryAppInstallation,
        }}
      />,
    );
    const user = userEvent.setup();
    const settingsButton = screen.getByTestId("app-settings-button");

    // Act
    await user.click(settingsButton);

    // Assert
    expect(openAppSettings).toHaveBeenCalledWith(activeApp.id);
    expect(openAppSettings).toHaveBeenCalledTimes(1);
  });
});
