import { AppListContextValues } from "@dashboard/new-apps/context";
import {
  comingSoonApp,
  failedAppInProgress,
  pendingAppInProgress,
  releasedApp,
} from "@dashboard/new-apps/fixtures";
import { render } from "@testing-library/react";
import React from "react";

import AppListCardActions from "./AppListCardActions";
import { ComingSoonTextProps } from "./ComingSoonText";
import { InstallCallActionsProps } from "./InstallCallActions";
import { InstallErrorActionsProps } from "./InstallErrorActions";

const mockOpenAppSettings = jest.fn();
const mockRemoveAppInstallation = jest.fn();
const mockRetryAppInstallation = jest.fn();
const mockOpenAppInstallPage = jest.fn();
const mockOpenVercelDeploymentPage = jest.fn();

jest.mock("@dashboard/new-apps/context", () => ({
  useAppListContext: jest.fn(
    () =>
      ({
        openAppSettings: mockOpenAppSettings,
        removeAppInstallation: mockRemoveAppInstallation,
        retryAppInstallation: mockRetryAppInstallation,
        openAppInstallPage: mockOpenAppInstallPage,
        openVercelDeploymentPage: mockOpenVercelDeploymentPage,
      } as AppListContextValues),
  ),
}));

const mockInstallCallComponent = jest.fn();
const mockInstallErrorComponent = jest.fn();
const mockInstallPendingComponent = jest.fn();
const mockComingSoonComponent = jest.fn();

jest.mock("./InstallCallActions", () => props => {
  mockInstallCallComponent(props);
  return <></>;
});
jest.mock("./InstallErrorActions", () => props => {
  mockInstallErrorComponent(props);
  return <></>;
});
jest.mock("./InstallPendingText", () => props => {
  mockInstallPendingComponent(props);
  return <></>;
});
jest.mock("./ComingSoonText", () => props => {
  mockComingSoonComponent(props);
  return <></>;
});

beforeEach(() => {
  mockInstallCallComponent.mockClear();
  mockInstallErrorComponent.mockClear();
  mockInstallPendingComponent.mockClear();
  mockComingSoonComponent.mockClear();
});

describe("Apps AppListCardActions", () => {
  it("displays install call actions when app is not installed", () => {
    // Act
    render(<AppListCardActions app={releasedApp} />);

    // Assert
    expect(mockInstallCallComponent).toHaveBeenCalledWith({
      install: expect.any(Function),
      vercelDeploy: expect.any(Function),
    } as InstallCallActionsProps);
    expect(mockInstallErrorComponent).not.toHaveBeenCalled();
    expect(mockInstallPendingComponent).not.toHaveBeenCalled();
    expect(mockComingSoonComponent).not.toHaveBeenCalled();

    // Act
    mockInstallCallComponent.mock.calls[0][0].install();
    mockInstallCallComponent.mock.calls[0][0].vercelDeploy();

    // Assert
    expect(mockOpenAppInstallPage).toHaveBeenCalledWith(
      releasedApp.manifestUrl,
    );
    expect(mockOpenVercelDeploymentPage).toHaveBeenCalledWith(
      releasedApp.vercelDeploymentUrl,
    );
  });

  it("displays install error actions when app installation is in error state", () => {
    // Act
    render(
      <AppListCardActions
        app={releasedApp}
        appInstallation={failedAppInProgress}
      />,
    );

    // Assert
    expect(mockInstallCallComponent).not.toHaveBeenCalled();
    expect(mockInstallErrorComponent).toHaveBeenCalledWith({
      appInstallation: failedAppInProgress,
      removeInstall: expect.any(Function),
      retryInstall: expect.any(Function),
    } as InstallErrorActionsProps);
    expect(mockInstallPendingComponent).not.toHaveBeenCalled();
    expect(mockComingSoonComponent).not.toHaveBeenCalled();

    // Act
    mockInstallErrorComponent.mock.calls[0][0].retryInstall();
    mockInstallErrorComponent.mock.calls[0][0].removeInstall();

    // Assert
    expect(mockRetryAppInstallation).toHaveBeenCalledWith(
      failedAppInProgress.id,
    );
    expect(mockRemoveAppInstallation).toHaveBeenCalledWith(
      failedAppInProgress.id,
    );
  });

  it("displays install pending when app installation is in progress state", () => {
    // Act
    render(
      <AppListCardActions
        app={releasedApp}
        appInstallation={pendingAppInProgress}
      />,
    );

    // Assert
    expect(mockInstallCallComponent).not.toHaveBeenCalled();
    expect(mockInstallErrorComponent).not.toHaveBeenCalled();
    expect(mockInstallPendingComponent).toHaveBeenCalled();
    expect(mockComingSoonComponent).not.toHaveBeenCalled();
  });

  it("displays coming soon when app is not released", () => {
    // Act
    render(<AppListCardActions app={comingSoonApp} />);

    // Assert
    expect(mockInstallCallComponent).not.toHaveBeenCalled();
    expect(mockInstallErrorComponent).not.toHaveBeenCalled();
    expect(mockInstallPendingComponent).not.toHaveBeenCalled();
    expect(mockComingSoonComponent).toHaveBeenCalledWith({
      releaseDate: comingSoonApp.releaseDate,
    } as ComingSoonTextProps);
  });
});
