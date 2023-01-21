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

// jest.mock("react-intl", () => ({
//   useIntl: jest.fn(() => ({
//     formatMessage: jest.fn(x => x.defaultMessage),
//   })),
//   defineMessages: jest.fn(x => x),
//   // FormattedMessage: jest.fn(x => x.defaultMessage),
// }));

// jest.mock("@saleor/macaw-ui", () => ({
//   makeStyles: jest.fn(() => () => ({})),
//   Avatar: jest.fn(() => () => <></>),
//   IconButton: jest.fn(() => () => <></>),
//   DeleteIcon: jest.fn(() => () => <></>),
//   ImageIcon: jest.fn(() => () => <></>),
//   Button: jest.fn(() => props => <button {...props} />),
//   Indicator: jest.fn(() => () => <></>),
//   Tooltip: jest.fn(() => () => <></>),
//   TooltipMountWrapper: jest.fn(() => () => <></>),
//   useTheme: jest.fn(() => ({
//     themeType: "light",
//   })),
// }));

// jest.mock("@dashboard/new-apps/context", () => ({
//   useAppListContext: jest.fn(() => ({
//     openAppSettings: jest.fn(),
//     removeAppInstallation: jest.fn(),
//     retryAppInstallation: jest.fn(),
//   })),
// }));

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

//   it("calls handlers when released app data passed and buttons clicked", async () => {
//     // Arrange
//     const navigateToAppInstallPage = jest.fn();
//     const navigateToVercelDeploymentPage = jest.fn();
//     render(
//       <AppListCard
//         app={releasedApp}
//         navigateToAppInstallPage={navigateToAppInstallPage}
//         navigateToVercelDeploymentPage={navigateToVercelDeploymentPage}
//       />,
//     );

//     // Act
//     mockActionsComponent.mock.calls[1][0].installHandler();
//     mockActionsComponent.mock.calls[1][0].vercelDeployHandler();

//     // Assert
//     expect(mockActionsComponent).toHaveBeenCalledWith({
//       installHandler: expect.any(Function),
//       installationPending: undefined,
//       releaseDate: undefined,
//       removeInstallHandler: undefined,
//       retryInstallHandler: undefined,
//       vercelDeployHandler: expect.any(Function),
//     } as AppListCardActionsProps);
//     expect(navigateToAppInstallPage).toBeCalledTimes(1);
//     expect(navigateToVercelDeploymentPage).toBeCalledTimes(1);
//   });

//   it("displays coming soon app details when coming soon app data passed", () => {
//     // Act
//     render(<AppListCard app={comingSoonApp} />);

//     // Assert
//     expect(mockDescriptionComponent).toHaveBeenCalledWith({
//       app: comingSoonApp,
//     } as AppListCardDescriptionProps);
//     expect(mockActionsComponent).toHaveBeenCalledWith({
//       installHandler: undefined,
//       installationPending: undefined,
//       releaseDate: comingSoonApp.releaseDate,
//       removeInstallHandler: undefined,
//       retryInstallHandler: undefined,
//       vercelDeployHandler: undefined,
//     } as AppListCardActionsProps);
//   });

//   it("displays app installation details when failed installation data passed", () => {
//     // Arrange
//     render(
//       <AppListCard app={releasedApp} appInstallation={failedAppInProgress} />,
//     );

//     // Assert
//     expect(mockActionsComponent).toHaveBeenCalledWith({
//       installHandler: undefined,
//       installationPending: failedAppInProgress.status === JobStatusEnum.PENDING,
//       releaseDate: undefined,
//       removeInstallHandler: expect.any(Function),
//       retryInstallHandler: expect.any(Function),
//       vercelDeployHandler: undefined,
//     } as AppListCardActionsProps);
//   });

//   it("displays app installation details when pending installation data passed", () => {
//     // Arrange
//     render(
//       <AppListCard app={releasedApp} appInstallation={pendingAppInProgress} />,
//     );

//     // Assert
//     expect(mockActionsComponent).toHaveBeenCalledWith({
//       installHandler: undefined,
//       installationPending:
//         pendingAppInProgress.status === JobStatusEnum.PENDING,
//       releaseDate: undefined,
//       removeInstallHandler: undefined,
//       retryInstallHandler: undefined,
//       vercelDeployHandler: undefined,
//     } as AppListCardActionsProps);
//   });

//   it("calls handlers when failed installation data passed and buttons clicked", async () => {
//     // Arrange
//     const openAppSettings = jest.fn();
//     const removeAppInstallation = jest.fn();
//     const retryAppInstallation = jest.fn();
//     jest.spyOn(context, "useAppListContext").mockImplementation(() => ({
//       openAppSettings,
//       removeAppInstallation,
//       retryAppInstallation,
//     }));
//     render(
//       <AppListCard app={releasedApp} appInstallation={failedAppInProgress} />,
//     );

//     // Act
//     mockActionsComponent.mock.calls[5][0].removeInstallHandler(
//       failedAppInProgress.id,
//     );
//     mockActionsComponent.mock.calls[5][0].retryInstallHandler(
//       failedAppInProgress.id,
//     );

//     // Assert
//     expect(retryAppInstallation).toHaveBeenCalledWith(failedAppInProgress.id);
//     expect(retryAppInstallation).toHaveBeenCalledTimes(1);
//     expect(removeAppInstallation).toHaveBeenCalledWith(failedAppInProgress.id);
//     expect(removeAppInstallation).toHaveBeenCalledTimes(1);
//   });
// });
