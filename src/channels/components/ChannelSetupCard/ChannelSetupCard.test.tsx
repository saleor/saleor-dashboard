import { channelSectionIds } from "@dashboard/channels/components/ChannelSectionNav/channelSectionIds";
import { ChannelSectionScrollProvider } from "@dashboard/channels/components/ChannelSectionNav/ChannelSectionScrollContext";
import { ExtensionsPaths } from "@dashboard/extensions/urls";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { ChannelSetupCard } from "./ChannelSetupCard";

const navigate = jest.fn();

jest.mock("@dashboard/hooks/useNavigator", () => () => navigate);

const baseProps = {
  taxConfigurationId: "taxConf1",
  chargeTaxes: true,
  warehouseCount: 0,
  shippingZoneCount: 0,
  availableWarehousesCount: 0,
  availableShippingZonesCount: 0,
  paymentAppsCount: 0,
  publishedProductCount: 0,
  totalProductCount: 128,
  canCreateWarehouse: true,
  canAssignWarehouse: true,
  onAssignWarehouse: jest.fn(),
  onCreateWarehouse: jest.fn(),
  onAssignShipping: jest.fn(),
  onCreateShipping: jest.fn(),
};

describe("ChannelSetupCard", () => {
  beforeEach(() => {
    navigate.mockClear();
  });

  it("shows create warehouse when the shop has no warehouses", () => {
    // Arrange & Act
    render(<ChannelSetupCard {...baseProps} />, { wrapper: Wrapper });

    // Assert
    expect(screen.getByTestId("setup-create-warehouse")).toBeInTheDocument();
    expect(screen.queryByTestId("setup-assign-warehouse")).not.toBeInTheDocument();
    expect(screen.getByTestId("setup-checklist-progress")).toHaveTextContent("0 of 2");
  });

  it("shows assign warehouse when unassigned warehouses exist", () => {
    // Arrange & Act
    render(<ChannelSetupCard {...baseProps} availableWarehousesCount={2} />, {
      wrapper: Wrapper,
    });

    // Assert
    expect(screen.getByTestId("setup-assign-warehouse")).toBeInTheDocument();
    expect(screen.queryByTestId("setup-create-warehouse")).not.toBeInTheDocument();
  });

  it("locks shipping until a warehouse is assigned without a disabled CTA", () => {
    // Arrange & Act
    render(<ChannelSetupCard {...baseProps} availableWarehousesCount={1} />, {
      wrapper: Wrapper,
    });

    // Assert
    expect(screen.getByTestId("setup-checklist-task-shipping")).toHaveAttribute(
      "data-status",
      "locked",
    );
    expect(screen.getByText("Requires a stock location")).toBeInTheDocument();
    expect(screen.queryByTestId("setup-shipping-needs-warehouse")).not.toBeInTheDocument();
    expect(screen.queryByTestId("setup-create-shipping")).not.toBeInTheDocument();
  });

  it("shows assign shipping when warehouse is ready and zones exist", () => {
    // Arrange & Act
    render(
      <ChannelSetupCard
        {...baseProps}
        warehouseCount={1}
        availableWarehousesCount={1}
        availableShippingZonesCount={3}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByTestId("setup-assign-shipping")).toBeInTheDocument();
    expect(screen.queryByTestId("setup-create-shipping")).not.toBeInTheDocument();
    expect(screen.getByTestId("setup-checklist-progress")).toHaveTextContent("1 of 2");
    expect(screen.getByTestId("setup-checklist-task-shipping")).toHaveAttribute(
      "data-status",
      "active",
    );
  });

  it("keeps the checklist after required steps and shows dismiss", () => {
    // Arrange & Act
    render(
      <ChannelSetupCard
        {...baseProps}
        warehouseCount={1}
        shippingZoneCount={1}
        availableWarehousesCount={1}
        availableShippingZonesCount={1}
        onDismiss={jest.fn()}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByTestId("channel-setup-card")).toBeInTheDocument();
    expect(screen.getByTestId("setup-dismiss")).toHaveTextContent("Dismiss");
    expect(screen.getByTestId("setup-checklist-progress")).toHaveTextContent("2 of 2");
  });

  it("shows Activate channel disabled until required steps are done", () => {
    // Arrange & Act
    render(<ChannelSetupCard {...baseProps} onDismiss={jest.fn()} onActivate={jest.fn()} />, {
      wrapper: Wrapper,
    });

    // Assert
    expect(screen.getByTestId("setup-dismiss")).toHaveTextContent("Skip for now");
    expect(screen.getByTestId("setup-activate-channel")).toBeDisabled();
  });

  it("enables Activate channel when warehouse and shipping are ready", () => {
    // Arrange
    const onActivate = jest.fn();

    // Act
    render(
      <ChannelSetupCard
        {...baseProps}
        warehouseCount={1}
        shippingZoneCount={1}
        availableWarehousesCount={1}
        availableShippingZonesCount={1}
        onDismiss={jest.fn()}
        onActivate={onActivate}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    const activateButton = screen.getByTestId("setup-activate-channel");

    expect(activateButton).toBeEnabled();
    activateButton.click();
    expect(onActivate).toHaveBeenCalled();
  });

  it("keeps Activate disabled when checklist is staged but activateReady is false", () => {
    // Arrange & Act — local counts complete; saved server state not ready yet
    render(
      <ChannelSetupCard
        {...baseProps}
        warehouseCount={1}
        shippingZoneCount={1}
        availableWarehousesCount={1}
        availableShippingZonesCount={1}
        activateReady={false}
        onDismiss={jest.fn()}
        onActivate={jest.fn()}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByTestId("setup-checklist-progress")).toHaveTextContent("2 of 2");
    expect(screen.getByTestId("setup-activate-channel")).toBeDisabled();
  });

  it("hides Activate channel when the channel is already active", () => {
    // Arrange & Act
    render(
      <ChannelSetupCard
        {...baseProps}
        isActive
        warehouseCount={1}
        shippingZoneCount={1}
        onDismiss={jest.fn()}
        onActivate={jest.fn()}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.queryByTestId("setup-activate-channel")).not.toBeInTheDocument();
    expect(screen.getByTestId("setup-dismiss")).toBeInTheDocument();
  });

  it("renders worth-reviewing rows with tax, payments, and product status", () => {
    // Arrange & Act
    render(
      <ChannelSetupCard
        {...baseProps}
        paymentAppsCount={2}
        publishedProductCount={3}
        warehouseCount={1}
        availableWarehousesCount={2}
      />,
      {
        wrapper: Wrapper,
      },
    );

    // Assert
    expect(screen.getByTestId("setup-checklist-tasks-section")).toHaveTextContent(
      "Required by checkout",
    );
    expect(screen.getByTestId("setup-checklist-review")).toBeInTheDocument();
    expect(screen.getByText("Worth reviewing")).toBeInTheDocument();
    expect(screen.getByText("Review before activating")).toBeInTheDocument();
    expect(screen.getByTestId("setup-checklist-review-tax")).toHaveTextContent("Flat rates");
    expect(screen.getByTestId("setup-checklist-review-payments")).toHaveTextContent("2 installed");
    expect(screen.getByTestId("setup-checklist-review-payments")).toHaveTextContent(
      "Installed payment apps still need to be set up for checkout.",
    );
    expect(screen.getByTestId("setup-checklist-review-catalog")).toHaveTextContent(
      "3 of 128 published",
    );
  });

  it("shows assign-warehouse catalog status when the channel has no warehouses", () => {
    // Arrange & Act
    render(
      <ChannelSetupCard
        {...baseProps}
        warehouseCount={0}
        availableWarehousesCount={2}
        publishedProductCount={0}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByTestId("setup-checklist-review-catalog")).toHaveTextContent(
      "Assign warehouse",
    );
    expect(screen.getByTestId("setup-checklist-review-catalog")).toHaveTextContent(
      "Add products and prices now. Assign a warehouse to this channel for checkout inventory.",
    );
  });

  it("uses install-oriented payments copy when no payment apps are installed", () => {
    // Arrange & Act
    render(<ChannelSetupCard {...baseProps} paymentAppsCount={0} />, { wrapper: Wrapper });

    // Assert
    expect(screen.getByTestId("setup-checklist-review-payments")).toHaveTextContent(
      "No payment apps",
    );
    expect(screen.getByTestId("setup-checklist-review-payments")).toHaveTextContent(
      "Install a payment app so customers can pay at checkout.",
    );
  });

  it("hides warehouse CTAs and shows permission guidance without product access", () => {
    // Arrange & Act
    render(
      <ChannelSetupCard {...baseProps} canCreateWarehouse={false} canAssignWarehouse={false} />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.queryByTestId("setup-create-warehouse")).not.toBeInTheDocument();
    expect(screen.queryByTestId("setup-assign-warehouse")).not.toBeInTheDocument();
    expect(screen.getByTestId("setup-checklist-task-warehouse")).toHaveAttribute(
      "data-status",
      "locked",
    );
    expect(screen.getByText("Missing permission to manage products")).toBeInTheDocument();
  });

  it("allows assigning warehouses without create when only assign is permitted", () => {
    // Arrange & Act
    render(
      <ChannelSetupCard
        {...baseProps}
        canCreateWarehouse={false}
        canAssignWarehouse
        availableWarehousesCount={2}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByTestId("setup-assign-warehouse")).toBeInTheDocument();
    expect(screen.queryByTestId("setup-create-warehouse")).not.toBeInTheDocument();
  });

  it("locks shipping with permission guidance when zones cannot be loaded", () => {
    // Arrange & Act
    render(<ChannelSetupCard {...baseProps} warehouseCount={1} shippingZoneCount={undefined} />, {
      wrapper: Wrapper,
    });

    // Assert
    expect(screen.getByTestId("setup-checklist-task-shipping")).toHaveAttribute(
      "data-status",
      "locked",
    );
    expect(screen.getByText("Missing permission to manage shipping")).toBeInTheDocument();
    expect(screen.queryByTestId("setup-create-shipping")).not.toBeInTheDocument();
    expect(screen.queryByTestId("setup-assign-shipping")).not.toBeInTheDocument();
  });

  it("scrolls to payment gateways when the section is scrollable on the page", () => {
    // Arrange
    const selectSection = jest.fn();

    // Act
    render(
      <ChannelSectionScrollProvider selectSection={selectSection}>
        <ChannelSetupCard
          {...baseProps}
          paymentAppsCount={2}
          scrollableSectionIds={[channelSectionIds.paymentGateways]}
        />
      </ChannelSectionScrollProvider>,
      { wrapper: Wrapper },
    );
    screen.getByTestId("setup-checklist-review-payments").click();

    // Assert
    expect(selectSection).toHaveBeenCalledWith(channelSectionIds.paymentGateways);
    expect(navigate).not.toHaveBeenCalled();
  });

  it("navigates to installed extensions when payment gateways are not scrollable on the page", () => {
    // Arrange
    const selectSection = jest.fn();

    // Act
    render(
      <ChannelSectionScrollProvider selectSection={selectSection}>
        <ChannelSetupCard
          {...baseProps}
          paymentAppsCount={2}
          scrollableSectionIds={[channelSectionIds.catalog, channelSectionIds.taxes]}
        />
      </ChannelSectionScrollProvider>,
      { wrapper: Wrapper },
    );
    screen.getByTestId("setup-checklist-review-payments").click();

    // Assert
    expect(selectSection).not.toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(ExtensionsPaths.installedExtensions);
  });

  it("scrolls to taxes when the section is scrollable on the page", () => {
    // Arrange
    const selectSection = jest.fn();

    // Act
    render(
      <ChannelSectionScrollProvider selectSection={selectSection}>
        <ChannelSetupCard
          {...baseProps}
          paymentAppsCount={2}
          scrollableSectionIds={[channelSectionIds.taxes]}
        />
      </ChannelSectionScrollProvider>,
      { wrapper: Wrapper },
    );
    screen.getByTestId("setup-checklist-review-tax").click();

    // Assert
    expect(selectSection).toHaveBeenCalledWith(channelSectionIds.taxes);
    expect(navigate).not.toHaveBeenCalled();
  });
});
