import {
  pendingAppInProgress,
  releasedApp,
} from "@dashboard/new-apps/fixtures";
import { render } from "@testing-library/react";
import React from "react";

import { AppListCardActionsProps } from "../AppListCardActions";
import AppListCard from "./AppListCard";
import { AppListCardDescriptionProps } from "./AppListCardDescription";
import { AppListCardIntegrationsProps } from "./AppListCardIntegrations";
import { AppListCardLinksProps } from "./AppListCardLinks";

const mockActionsComponent = jest.fn();
const mockDescriptionComponent = jest.fn();
const mockLinksComponent = jest.fn();
const mockIntegrationsComponent = jest.fn();

jest.mock("../AppListCardActions", () => props => {
  mockActionsComponent(props);
  return <></>;
});
jest.mock("./AppListCardDescription", () => props => {
  mockDescriptionComponent(props);
  return <></>;
});
jest.mock("./AppListCardLinks", () => props => {
  mockLinksComponent(props);
  return <></>;
});
jest.mock("./AppListCardIntegrations", () => props => {
  mockIntegrationsComponent(props);
  return <></>;
});

beforeEach(() => {
  mockActionsComponent.mockClear();
  mockDescriptionComponent.mockClear();
  mockLinksComponent.mockClear();
  mockIntegrationsComponent.mockClear();
});

describe("Apps AppListCard", () => {
  it("displays released app details when released app data passed", () => {
    // Act
    render(<AppListCard app={releasedApp} />);

    // Assert
    expect(mockDescriptionComponent).toHaveBeenCalledWith({
      app: releasedApp,
    } as AppListCardDescriptionProps);
    expect(mockLinksComponent).toHaveBeenCalledWith({
      app: releasedApp,
    } as AppListCardLinksProps);
    expect(mockIntegrationsComponent).toHaveBeenCalledWith({
      app: releasedApp,
    } as AppListCardIntegrationsProps);
    expect(mockActionsComponent).toHaveBeenCalledWith({
      app: releasedApp,
      appInstallation: undefined,
    } as AppListCardActionsProps);
  });

  it("displays pending app details when pending app data passed", () => {
    // Act
    render(
      <AppListCard app={releasedApp} appInstallation={pendingAppInProgress} />,
    );

    // Assert
    expect(mockDescriptionComponent).toHaveBeenCalledWith({
      app: releasedApp,
    } as AppListCardDescriptionProps);
    expect(mockLinksComponent).toHaveBeenCalledWith({
      app: releasedApp,
    } as AppListCardLinksProps);
    expect(mockIntegrationsComponent).toHaveBeenCalledWith({
      app: releasedApp,
    } as AppListCardIntegrationsProps);
    expect(mockActionsComponent).toHaveBeenCalledWith({
      app: releasedApp,
      appInstallation: pendingAppInProgress,
    } as AppListCardActionsProps);
  });
});
