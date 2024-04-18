import { render } from "@testing-library/react";
import React from "react";

import { appDetails } from "../../fixtures";
import { AppDetailsPage } from "./AppDetailsPage";

const mockHeader = jest.fn();
// eslint-disable-next-line react/display-name
jest.mock("./Header", () => (props: unknown) => {
  mockHeader(props);
  return <></>;
});

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
});
