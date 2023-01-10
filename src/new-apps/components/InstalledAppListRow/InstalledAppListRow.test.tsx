import { getAppsConfig } from "@saleor/config";
import { AppListContext, AppListContextValues } from "@saleor/new-apps/context";
import { activeApp, inactiveApp } from "@saleor/new-apps/fixtures";
import { InstalledApp } from "@saleor/new-apps/types";
import Wrapper from "@test/wrapper";
import { render, screen, within } from "@testing-library/react";
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
    const activateApp = jest.fn();
    const deactivateApp = jest.fn();
    const removeApp = jest.fn();
    render(
      <Component
        data={{
          app: activeApp,
          isExternal: false,
        }}
        context={{
          activateApp,
          deactivateApp,
          removeApp,
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
    const activateApp = jest.fn();
    const deactivateApp = jest.fn();
    const removeApp = jest.fn();
    render(
      <Component
        data={{
          app: activeApp,
          isExternal: true,
        }}
        context={{
          activateApp,
          deactivateApp,
          removeApp,
        }}
      />,
    );
    const externalLabel = screen.queryByTestId("app-external-label");

    // Assert
    expect(externalLabel).toBeTruthy();
  });

  it("displays tunnnel label when app is served via tunnnel", () => {
    // Arrange
    const activateApp = jest.fn();
    const deactivateApp = jest.fn();
    const removeApp = jest.fn();
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
          activateApp,
          deactivateApp,
          removeApp,
        }}
      />,
    );
    const tunnelLabel = screen.queryByTestId("app-tunnel-label");

    // Assert
    expect(tunnelLabel).toBeTruthy();
  });

  it("calls handlers when active app data passed and buttons clicked", async () => {
    // Arrange
    const activateApp = jest.fn();
    const deactivateApp = jest.fn();
    const removeApp = jest.fn();
    render(
      <Component
        data={{
          app: activeApp,
          isExternal: false,
        }}
        context={{
          activateApp,
          deactivateApp,
          removeApp,
        }}
      />,
    );
    const user = userEvent.setup();
    const activeSwitch = within(
      screen.getByTestId("app-active-switch"),
    ).getByRole("checkbox");
    const removeButton = screen.getByTestId("app-remove-button");

    // Assert
    expect(activeSwitch).toBeChecked();

    // Act
    await user.click(activeSwitch);
    await user.click(removeButton);

    // Assert
    expect(deactivateApp).toHaveBeenCalledWith(activeApp.id);
    expect(deactivateApp).toHaveBeenCalledTimes(1);
    expect(activateApp).not.toHaveBeenCalled();
    expect(removeApp).toHaveBeenCalledWith(activeApp.id);
    expect(removeApp).toHaveBeenCalledTimes(1);
  });

  it("calls handlers when inactive app data passed and buttons clicked", async () => {
    // Arrange
    const activateApp = jest.fn();
    const deactivateApp = jest.fn();
    const removeApp = jest.fn();
    render(
      <Component
        data={{
          app: inactiveApp,
          isExternal: false,
        }}
        context={{
          activateApp,
          deactivateApp,
          removeApp,
        }}
      />,
    );
    const user = userEvent.setup();
    const activeSwitch = within(
      screen.getByTestId("app-active-switch"),
    ).getByRole("checkbox");
    const removeButton = screen.getByTestId("app-remove-button");

    // Assert
    expect(activeSwitch).not.toBeChecked();

    // Act
    await user.click(activeSwitch);
    await user.click(removeButton);

    // Assert
    expect(activateApp).toHaveBeenCalledWith(inactiveApp.id);
    expect(activateApp).toHaveBeenCalledTimes(1);
    expect(deactivateApp).not.toHaveBeenCalled();
    expect(removeApp).toHaveBeenCalledWith(inactiveApp.id);
    expect(removeApp).toHaveBeenCalledTimes(1);
  });
});
