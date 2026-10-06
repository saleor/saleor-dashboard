import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ComponentProps } from "react";

import { WarehouseSetupChecklist } from "./WarehouseSetupChecklist";

jest.mock("@dashboard/components/ProductAnalytics/useAnalytics", () => ({
  useAnalytics: (): { trackEvent: jest.Mock } => ({ trackEvent: jest.fn() }),
}));

const renderChecklist = (
  props: Partial<ComponentProps<typeof WarehouseSetupChecklist>> = {},
): ReturnType<typeof render> =>
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
      screen.getByText("Stock here can't be sold until this location is added to a channel."),
    ).toBeInTheDocument();
    expect(onAddChannel).toHaveBeenCalledTimes(1);
  });

  it("hides the action when the user cannot manage channels", () => {
    // Arrange
    renderChecklist({ canManage: false });

    // Assert
    expect(screen.queryByTestId("warehouse-setup-add-channel")).not.toBeInTheDocument();
  });

  it("marks the channel step done and can be dismissed", async () => {
    // Arrange
    const onDismiss = jest.fn();

    renderChecklist({ inChannel: true, onDismiss });

    // Assert
    expect(screen.queryByTestId("warehouse-setup-add-channel")).not.toBeInTheDocument();
    expect(screen.getByText("Required steps are complete.")).toBeInTheDocument();

    // Act
    await userEvent.click(screen.getByTestId("setup-dismiss"));

    // Assert
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("lists shipping zones to review only in the older stock mode", async () => {
    // Arrange
    const onOpenShippingZones = jest.fn();

    const { rerender } = renderChecklist({
      inChannel: true,
      showShippingZones: true,
      zoneCount: 0,
      onOpenShippingZones,
    });

    // Act
    await userEvent.click(screen.getByTestId("setup-checklist-review-shipping-zones"));

    // Assert
    expect(screen.getByText("Worth reviewing")).toBeInTheDocument();
    expect(screen.getByText("No shipping zone")).toBeInTheDocument();
    expect(onOpenShippingZones).toHaveBeenCalledTimes(1);

    rerender(
      <Wrapper>
        <WarehouseSetupChecklist
          canManage
          inChannel
          showShippingZones={false}
          onAddChannel={jest.fn()}
          onOpenShippingZones={onOpenShippingZones}
        />
      </Wrapper>,
    );

    expect(screen.queryByText("Worth reviewing")).not.toBeInTheDocument();
  });
});
