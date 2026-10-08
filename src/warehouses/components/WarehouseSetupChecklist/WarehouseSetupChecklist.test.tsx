import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ComponentProps } from "react";

import { WarehouseSetupChecklist } from "./WarehouseSetupChecklist";

type ChecklistProps = Partial<ComponentProps<typeof WarehouseSetupChecklist>>;

jest.mock("@dashboard/components/ProductAnalytics/useAnalytics", () => ({
  useAnalytics: (): { trackEvent: jest.Mock } => ({ trackEvent: jest.fn() }),
}));

const renderChecklist = (props: ChecklistProps = {}): ReturnType<typeof render> =>
  render(
    <Wrapper>
      <WarehouseSetupChecklist canManage onAddChannel={jest.fn()} {...props} />
    </Wrapper>,
  );

describe("WarehouseSetupChecklist", () => {
  it("asks to add a channel before stock can be sold", async () => {
    // Arrange
    const onAddChannel = jest.fn();

    renderChecklist({ onAddChannel });

    // Act
    await userEvent.click(screen.getByTestId("warehouse-setup-add-channel"));

    // Assert
    expect(
      screen.getByText("Stock here can't be sold until this warehouse is added to a channel."),
    ).toBeInTheDocument();
    expect(onAddChannel).toHaveBeenCalledTimes(1);
  });

  it("hides the action when the user cannot manage channels", () => {
    // Arrange
    const props: ChecklistProps = { canManage: false };

    // Act
    renderChecklist(props);

    // Assert
    expect(screen.queryByTestId("warehouse-setup-add-channel")).not.toBeInTheDocument();
  });

  it("marks the channel step done and can be dismissed when shipping is not required", async () => {
    // Arrange
    const onDismiss = jest.fn();
    const props: ChecklistProps = { inChannel: true, onDismiss };

    // Act
    renderChecklist(props);

    // Assert
    expect(screen.queryByTestId("warehouse-setup-add-channel")).not.toBeInTheDocument();
    expect(screen.getByText("Required steps are complete.")).toBeInTheDocument();

    // Act
    await userEvent.click(screen.getByTestId("setup-dismiss"));

    // Assert
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("requires a shipping zone in the older stock mode after a channel is assigned", async () => {
    // Arrange
    const onAddShippingZone = jest.fn();
    const props: ChecklistProps = {
      inChannel: true,
      showShippingZones: true,
      zoneCount: 0,
      hasUsableShippingZone: false,
      canManageShipping: true,
      onAddShippingZone,
    };

    // Act
    renderChecklist(props);

    // Assert
    expect(screen.getByText("Link a shipping zone")).toBeInTheDocument();
    expect(screen.queryByText("Worth reviewing")).not.toBeInTheDocument();
    expect(screen.getByText(/Next up:/)).toBeInTheDocument();
    expect(screen.queryByTestId("setup-dismiss")).not.toBeInTheDocument();

    // Act
    await userEvent.click(screen.getByTestId("warehouse-setup-add-shipping-zone"));

    // Assert
    expect(onAddShippingZone).toHaveBeenCalledTimes(1);
  });

  it("keeps the shipping zone step open when linked zones share no channel", () => {
    // Arrange
    const props: ChecklistProps = {
      inChannel: true,
      showShippingZones: true,
      zoneCount: 0,
      hasUsableShippingZone: false,
      canManageShipping: true,
      onAddShippingZone: jest.fn(),
    };

    // Act
    renderChecklist(props);

    // Assert
    expect(screen.getByTestId("setup-checklist-task-shipping-zones")).toHaveAttribute(
      "data-status",
      "active",
    );
    expect(screen.getByTestId("warehouse-setup-add-shipping-zone")).toBeInTheDocument();
  });

  it("locks the shipping zone step until a channel is assigned", () => {
    // Arrange
    const props: ChecklistProps = {
      showShippingZones: true,
      canManageShipping: true,
      onAddShippingZone: jest.fn(),
    };

    // Act
    renderChecklist(props);

    // Assert
    expect(screen.getByTestId("setup-checklist-task-shipping-zones")).toHaveAttribute(
      "data-status",
      "locked",
    );
    expect(screen.getByText("Add to a channel first")).toBeInTheDocument();
    expect(screen.queryByTestId("warehouse-setup-add-shipping-zone")).not.toBeInTheDocument();
  });

  it("omits the shipping zone step in the default stock mode", () => {
    // Arrange
    const props: ChecklistProps = {
      inChannel: true,
      showShippingZones: false,
      onAddShippingZone: jest.fn(),
    };

    // Act
    renderChecklist(props);

    // Assert
    expect(screen.queryByText("Link a shipping zone")).not.toBeInTheDocument();
    expect(screen.getByText("Required steps are complete.")).toBeInTheDocument();
  });
});
