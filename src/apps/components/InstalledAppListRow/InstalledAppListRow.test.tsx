import { AppListContext, AppListContextValues } from "@dashboard/apps/context";
import { activeApp, appWithFailedEventDeliveries } from "@dashboard/apps/fixtures";
import { InstalledApp } from "@dashboard/apps/types";
import { getAppsConfig } from "@dashboard/config";
import { useFlag } from "@dashboard/featureFlags";
import Wrapper from "@test/wrapper";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter as Router } from "react-router-dom";

import InstalledAppListRow from "./InstalledAppListRow";

jest.mock("@dashboard/featureFlags");
(useFlag as jest.Mock).mockReturnValue({ enabled: true });

const Component = ({ data, context }: { data: InstalledApp; context: AppListContextValues }) => (
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
    const removeAppInstallation = jest.fn();
    const retryAppInstallation = jest.fn();

    render(
      <Component
        data={{
          app: activeApp,
          isExternal: false,
        }}
        context={{
          removeAppInstallation,
          retryAppInstallation,
        }}
      />,
    );

    const name = screen.queryByText(activeApp.name as string);
    // TODO: Uncomment this when manifests are added back in the UI
    // const manifestDomain = screen.queryByText(
    //   new URL(activeApp.manifestUrl as string).host,
    // );
    const externalLabel = screen.queryByTestId("app-external-label");
    const tunnelLabel = screen.queryByTestId("app-tunnel-label");

    // Assert
    expect(name).toBeTruthy();
    // TODO: Uncomment this when manifests are added back in the UI
    // expect(manifestDomain).toBeTruthy();
    expect(externalLabel).toBeFalsy();
    expect(tunnelLabel).toBeFalsy();
  });
  it("displays external label when app is external", () => {
    // Arrange
    const removeAppInstallation = jest.fn();
    const retryAppInstallation = jest.fn();

    render(
      <Component
        data={{
          app: activeApp,
          isExternal: true,
        }}
        context={{
          removeAppInstallation,
          retryAppInstallation,
        }}
      />,
    );

    const externalLabel = screen.queryByTestId("app-external-label");

    // Assert
    expect(externalLabel).toBeTruthy();
  });
  it("displays tunnel label when app is served via tunnel", () => {
    // Arrange
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
          removeAppInstallation,
          retryAppInstallation,
        }}
      />,
    );

    const tunnelLabel = screen.queryByTestId("app-tunnel-label");

    // Assert
    expect(tunnelLabel).toBeTruthy();
  });
  it("displays a warning dot when app has issues, TC_ID: D_INT_02", async () => {
    // Arrange
    const removeAppInstallation = jest.fn();
    const retryAppInstallation = jest.fn();

    // Act
    render(
      <Component
        data={{
          app: appWithFailedEventDeliveries,
          isExternal: false,
        }}
        context={{
          removeAppInstallation,
          retryAppInstallation,
        }}
      />,
    );

    fireEvent.focus(screen.getByTestId("app-warning-dot"));

    // Assert
    expect(screen.queryAllByRole("link").at(-1)?.getAttribute("href")).toBe(
      `/apps/${appWithFailedEventDeliveries.id}`,
    );
  });
});
