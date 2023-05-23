import { render } from "@testing-library/react";
import React from "react";

import { appDetails } from "../../fixtures";
import AppDetailsPage from "./AppDetailsPage";

const mockHeader = vi.fn();
vi.mock("./Header", () => ({
  default: props => {
    mockHeader(props);
    return <></>;
  },
}));

const mockAboutCard = vi.fn();
vi.mock("./AboutCard", () => ({
  default: props => {
    mockAboutCard(props);
    return <></>;
  },
}));

const mockPermissionsCard = vi.fn();
vi.mock("./PermissionsCard", () => ({
  default: props => {
    mockPermissionsCard(props);
    return <></>;
  },
}));

const mockDataPrivacyCard = vi.fn();
vi.mock("./DataPrivacyCard", () => ({
  default: props => {
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

describe("Apps AppDetailsPage", () => {
  it("displays app details when app data passed", () => {
    // Arrange
    const onAppActivateOpen = vi.fn();
    const onAppDeactivateOpen = vi.fn();
    const onAppDeleteOpen = vi.fn();

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
