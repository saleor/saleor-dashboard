import { appDetails } from "@dashboard/apps/fixtures";
import { render } from "@testing-library/react";
import React from "react";

import Header from "./Header";

const mockHeaderOptions = jest.fn();
const mockTopNav = jest.fn();
const mockButton = jest.fn();

jest.mock("@dashboard/components/AppLayout/TopNav", () => ({
  TopNav: props => {
    mockTopNav(props);
    return <>{props.children}</>;
  },
}));
jest.mock("@saleor/macaw-ui/next", () => ({
  Button: props => {
    mockButton(props);
    return <>{props.children}</>;
  },
}));
jest.mock("../DeactivatedText", () => () => "deactivated");
jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
  FormattedMessage: ({ defaultMessage }) => <>{defaultMessage}</>,
}));
jest.mock("./HeaderOptions", () => props => {
  mockHeaderOptions(props);
  return <></>;
});

beforeEach(() => {
  mockHeaderOptions.mockClear();
  mockTopNav.mockClear();
  mockButton.mockClear();
});

describe("Apps AppDetailsPage Header", () => {
  it("displays app details options when active app data passed", () => {
    // Arrange
    const navigateToApp = jest.fn();
    const onAppActivateOpen = jest.fn();
    const onAppDeactivateOpen = jest.fn();
    const onAppDeleteOpen = jest.fn();

    // Act
    render(
      <Header
        data={appDetails}
        navigateToApp={navigateToApp}
        onAppActivateOpen={onAppActivateOpen}
        onAppDeactivateOpen={onAppDeactivateOpen}
        onAppDeleteOpen={onAppDeleteOpen}
      />,
    );
    const title = render(mockTopNav.mock.calls[0][0].title);

    // Assert
    expect(mockHeaderOptions).toHaveBeenCalledWith({
      data: appDetails,
      onAppActivateOpen,
      onAppDeactivateOpen,
      onAppDeleteOpen,
    });
    expect(mockButton).toHaveBeenCalledWith(
      expect.objectContaining({
        onClick: navigateToApp,
      }),
    );
    expect(mockTopNav).toHaveBeenCalled();
    expect(title.container).toHaveTextContent(appDetails.name as string);
  });

  it("displays app details options when inactive app data passed", () => {
    // Arrange
    const navigateToApp = jest.fn();
    const onAppActivateOpen = jest.fn();
    const onAppDeactivateOpen = jest.fn();
    const onAppDeleteOpen = jest.fn();

    // Act
    render(
      <Header
        data={{ ...appDetails, isActive: false }}
        navigateToApp={navigateToApp}
        onAppActivateOpen={onAppActivateOpen}
        onAppDeactivateOpen={onAppDeactivateOpen}
        onAppDeleteOpen={onAppDeleteOpen}
      />,
    );
    const title = render(mockTopNav.mock.calls[0][0].title);

    // Assert
    expect(mockHeaderOptions).toHaveBeenCalledWith({
      data: { ...appDetails, isActive: false },
      onAppActivateOpen,
      onAppDeactivateOpen,
      onAppDeleteOpen,
    });
    expect(mockButton).toHaveBeenCalledWith(
      expect.objectContaining({
        onClick: navigateToApp,
      }),
    );
    expect(mockTopNav).toHaveBeenCalled();
    expect(title.container).toHaveTextContent(`${appDetails.name} deactivated`);
  });
});
