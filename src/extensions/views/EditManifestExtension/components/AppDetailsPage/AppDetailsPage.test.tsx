import { appDetails } from "@dashboard/extensions/fixtures";
import { AppTypeEnum } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { AppDetailsPage } from "./AppDetailsPage";

const mockHeader = jest.fn();

jest.mock("./Header", () => ({
  Header: (props: unknown) => {
    mockHeader(props);

    return <></>;
  },
}));

const mockAboutCard = jest.fn();

jest.mock("./AboutCard", () => ({
  AboutCard: (props: unknown) => {
    mockAboutCard(props);

    return <></>;
  },
}));

const mockPermissionsCard = jest.fn();

jest.mock("./PermissionsCard", () => ({
  PermissionsCard: (props: unknown) => {
    mockPermissionsCard(props);

    return <></>;
  },
}));

const mockDataPrivacyCard = jest.fn();

jest.mock("./DataPrivacyCard", () => ({
  DataPrivacyCard: (props: unknown) => {
    mockDataPrivacyCard(props);

    return <></>;
  },
}));
beforeEach(() => {
  mockHeader.mockClear();
  mockAboutCard.mockClear();
  mockPermissionsCard.mockClear();
  mockDataPrivacyCard.mockClear();
});
/**
 * TODO Rewrite tests to actually render the tree
 */
describe("Apps AppDetailsPage", () => {
  it("displays app details when app data passed", () => {
    // Arrange
    const onAppActivateOpen = jest.fn();
    const onAppDeactivateOpen = jest.fn();
    const onAppDeleteOpen = jest.fn();

    // Act
    render(
      <AppDetailsPage
        data={appDetails}
        loading={false}
        onAppActivateOpen={onAppActivateOpen}
        onAppDeactivateOpen={onAppDeactivateOpen}
        onAppDeleteOpen={onAppDeleteOpen}
      />,
    );
    // Assert
    expect(mockHeader).toHaveBeenCalledWith({
      data: appDetails,
      onAppActivateOpen,
      onAppDeactivateOpen,
      onAppDeleteOpen,
    });
    expect(mockAboutCard).toHaveBeenCalledWith(
      expect.objectContaining({
        aboutApp: appDetails.aboutApp,
        loading: false,
      }),
    );
    expect(mockPermissionsCard).toHaveBeenCalledWith(
      expect.objectContaining({
        permissions: appDetails.permissions,
        loading: false,
      }),
    );
    expect(mockDataPrivacyCard).toHaveBeenCalledWith(
      expect.objectContaining({
        dataPrivacyUrl: appDetails.dataPrivacyUrl,
        loading: false,
      }),
    );
  });

  it("shows the no-configuration-screen notice for third-party apps without appUrl", () => {
    // Arrange
    const data = { ...appDetails, type: AppTypeEnum.THIRDPARTY, appUrl: null };

    // Act
    render(
      <AppDetailsPage
        data={data}
        loading={false}
        onAppActivateOpen={jest.fn()}
        onAppDeactivateOpen={jest.fn()}
        onAppDeleteOpen={jest.fn()}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByTestId("no-configuration-screen-info")).toBeInTheDocument();
    expect(screen.getByText("App does not include a configuration screen")).toBeInTheDocument();
  });

  it("does not show the notice when third-party app has appUrl", () => {
    // Arrange
    const data = { ...appDetails, type: AppTypeEnum.THIRDPARTY, appUrl: "https://example.com" };

    // Act
    render(
      <AppDetailsPage
        data={data}
        loading={false}
        onAppActivateOpen={jest.fn()}
        onAppDeactivateOpen={jest.fn()}
        onAppDeleteOpen={jest.fn()}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.queryByTestId("no-configuration-screen-info")).not.toBeInTheDocument();
  });

  it("does not show the notice for LOCAL (custom) apps without appUrl", () => {
    // Arrange
    const data = { ...appDetails, type: AppTypeEnum.LOCAL, appUrl: null };

    // Act
    render(
      <AppDetailsPage
        data={data}
        loading={false}
        onAppActivateOpen={jest.fn()}
        onAppDeactivateOpen={jest.fn()}
        onAppDeleteOpen={jest.fn()}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.queryByTestId("no-configuration-screen-info")).not.toBeInTheDocument();
  });
});
