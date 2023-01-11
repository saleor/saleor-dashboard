import { getAppsConfig } from "@saleor/config";
import { AppListContext, AppListContextValues } from "@saleor/new-apps/context";
import { activeApp } from "@saleor/new-apps/fixtures";
import { InstalledApp } from "@saleor/new-apps/types";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { MemoryRouter as Router } from "react-router-dom";

import NotInstalledAppListRow from "./NotInstalledAppListRow";

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
        <NotInstalledAppListRow {...data} />
      </AppListContext.Provider>
    </Router>
  </Wrapper>
);

describe("Apps NotInstalledAppListRow", () => {
  it("displays app details when basic app data passed", () => {
    // Arrange
    const openAppSettings = jest.fn();
    render(
      <Component
        data={{
          app: activeApp,
          isExternal: false,
        }}
        context={{
          openAppSettings,
        }}
      />,
    );
    const name = screen.queryByText(activeApp.name as string);
    const version = screen.queryByText(activeApp.version as string, {
      exact: false,
    });
    const manifestDomain = screen.queryByText(
      new URL(activeApp.manifestUrl as string).host,
    );
    const externalLabel = screen.queryByTestId("app-external-label");
    const tunnelLabel = screen.queryByTestId("app-tunnel-label");

    // Assert
    expect(name).toBeTruthy();
    expect(version).toBeTruthy();
    expect(manifestDomain).toBeTruthy();
    expect(externalLabel).toBeFalsy();
    expect(tunnelLabel).toBeFalsy();
  });

  it("displays external label when app is external", () => {
    // Arrange
    const openAppSettings = jest.fn();
    render(
      <Component
        data={{
          app: activeApp,
          isExternal: true,
        }}
        context={{
          openAppSettings,
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
    render(
      <Component
        data={{
          app: activeApp,
          isExternal: false,
        }}
        context={{
          openAppSettings,
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
