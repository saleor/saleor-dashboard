import { appDetails } from "@dashboard/extensions/fixtures";
import { AppTypeEnum } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { type ComponentProps } from "react";

import { AppDetailsPage } from "./AppDetailsPage";
import { installedAppStory } from "./storyFixtures";

const mockHeader = jest.fn();

jest.mock("./Header", () => ({
  Header: (props: unknown) => {
    mockHeader(props);

    return <></>;
  },
}));

jest.mock("../AppWebhooksDisplay/AppWebhooksDisplay", () => ({
  AppWebhooksDisplay: () => <div data-test-id="webhook-deliveries" />,
}));

jest.mock("@dashboard/hooks/useHasManagedAppsPermission", () => ({
  useHasManagedAppsPermission: () => ({ hasManagedAppsPermission: true }),
}));

const renderPage = (props: Partial<ComponentProps<typeof AppDetailsPage>> = {}) => {
  const defaults: ComponentProps<typeof AppDetailsPage> = {
    data: appDetails,
    activeTab: undefined,
    onTabChange: jest.fn(),
    onAppActivateOpen: jest.fn(),
    onAppDeactivateOpen: jest.fn(),
    onAppDeleteOpen: jest.fn(),
  };

  render(<AppDetailsPage {...defaults} {...props} />, { wrapper: Wrapper });
};

beforeEach(() => {
  mockHeader.mockClear();
});

describe("Apps AppDetailsPage", () => {
  it("shows the installed app on the Details tab", () => {
    // Arrange & Act
    renderPage();

    // Assert
    expect(screen.getByText("Lorem ipsum")).toBeInTheDocument();
    expect(screen.getByText("Manage orders.")).toBeInTheDocument();
    expect(screen.getByTestId("app-edit-permissions-button")).toBeInTheDocument();
    expect(screen.getByTestId("app-manage-tab-details")).toHaveAttribute("aria-selected", "true");
  });

  it("copies a webhook's subscription query decoded and formatted as GraphQL", async () => {
    // Arrange
    const writeText = jest.fn().mockResolvedValue(undefined);

    Object.assign(navigator, { clipboard: { writeText } });
    renderPage({ data: installedAppStory });

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Copy subscription" }));

    // Assert
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    expect(writeText.mock.calls[0][0]).toBe(
      'subscription {\n  event {\n    ... on OrderCreated {\n      order {\n        id\n        metafield(key: "crm")\n      }\n    }\n  }\n}',
    );
  });

  it("shows webhook deliveries on their own tab", () => {
    // Arrange & Act
    renderPage({ activeTab: "deliveries" });

    // Assert
    expect(screen.getByTestId("webhook-deliveries")).toBeInTheDocument();
  });

  it("shows the no-configuration-screen notice for third-party apps without appUrl", () => {
    // Arrange & Act
    renderPage({ data: { ...appDetails, type: AppTypeEnum.THIRDPARTY, appUrl: null } });

    // Assert
    expect(screen.getByTestId("no-configuration-screen-info")).toBeInTheDocument();
    expect(screen.getByText("App does not include a configuration screen")).toBeInTheDocument();
  });

  it("does not show the notice when third-party app has appUrl", () => {
    // Arrange & Act
    renderPage({
      data: { ...appDetails, type: AppTypeEnum.THIRDPARTY, appUrl: "https://example.com" },
    });

    // Assert
    expect(screen.queryByTestId("no-configuration-screen-info")).not.toBeInTheDocument();
  });

  it("does not show the notice for LOCAL (custom) apps without appUrl", () => {
    // Arrange & Act
    renderPage({ data: { ...appDetails, type: AppTypeEnum.LOCAL, appUrl: null } });

    // Assert
    expect(screen.queryByTestId("no-configuration-screen-info")).not.toBeInTheDocument();
  });
});
