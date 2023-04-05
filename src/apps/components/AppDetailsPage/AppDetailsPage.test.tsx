import { render } from "@testing-library/react";
import React from "react";

import { appDetails } from "../../fixtures";
import AppDetailsPage from "./AppDetailsPage";

const mockHeader = jest.fn();
jest.mock("./Header", () => props => {
  mockHeader(props);
  return <></>;
});

const mockAboutCard = jest.fn();
jest.mock("./AboutCard", () => props => {
  mockAboutCard(props);
  return <></>;
});

const mockPermissionsCard = jest.fn();
jest.mock("./PermissionsCard", () => props => {
  mockPermissionsCard(props);
  return <></>;
});

const mockDataPrivacyCard = jest.fn();
jest.mock("./DataPrivacyCard", () => props => {
  mockDataPrivacyCard(props);
  return <></>;
});

beforeEach(() => {
  mockHeader.mockClear();
  mockAboutCard.mockClear();
  mockPermissionsCard.mockClear();
  mockDataPrivacyCard.mockClear();
});

describe("Apps AppDetailsPage", () => {
  it("displays app details when app data passed", () => {
    // Arrange
    const navigateToApp = jest.fn();
    const onAppActivateOpen = jest.fn();
    const onAppDeactivateOpen = jest.fn();
    const onAppDeleteOpen = jest.fn();

    // Act
    render(
      <AppDetailsPage
        data={appDetails}
        loading={false}
        navigateToApp={navigateToApp}
        onAppActivateOpen={onAppActivateOpen}
        onAppDeactivateOpen={onAppDeactivateOpen}
        onAppDeleteOpen={onAppDeleteOpen}
      />,
    );

    // Assert
    expect(mockHeader).toHaveBeenCalledWith({
      data: appDetails,
      navigateToApp,
      onAppActivateOpen,
      onAppDeactivateOpen,
      onAppDeleteOpen,
    });
    expect(mockAboutCard).toHaveBeenCalledWith({
      aboutApp: appDetails.aboutApp,
      loading: false,
    });
    expect(mockPermissionsCard).toHaveBeenCalledWith({
      permissions: appDetails.permissions,
      loading: false,
    });
    expect(mockDataPrivacyCard).toHaveBeenCalledWith({
      dataPrivacyUrl: appDetails.dataPrivacyUrl,
      loading: false,
    });
  });
});
