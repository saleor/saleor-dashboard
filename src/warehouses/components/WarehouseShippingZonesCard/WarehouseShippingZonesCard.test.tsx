import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { WarehouseShippingZonesCard } from "./WarehouseShippingZonesCard";

const baseProps = {
  legacyStockAvailability: true,
  zones: [],
  totalCount: 0,
  membershipStatus: "ready" as const,
  warehouseChannelIds: ["channel-1"],
  channelNames: ["Brazil"],
  pickupEnabled: false,
  canManage: true,
  onRequestAssign: jest.fn(),
  onRemove: jest.fn(),
};

describe("WarehouseShippingZonesCard", () => {
  it("offers to add a shipping zone once the location is in a channel", async () => {
    // Arrange
    const onRequestAssign = jest.fn();

    render(
      <Wrapper>
        <WarehouseShippingZonesCard {...baseProps} onRequestAssign={onRequestAssign} />
      </Wrapper>,
    );

    // Act
    await userEvent.click(screen.getByTestId("warehouse-zones-add"));

    // Assert
    expect(screen.getByText("No shipping zone")).toBeInTheDocument();
    expect(onRequestAssign).toHaveBeenCalledTimes(1);
  });

  it("waits for a channel before a zone can be added", () => {
    // Arrange
    render(
      <Wrapper>
        <WarehouseShippingZonesCard {...baseProps} warehouseChannelIds={[]} channelNames={[]} />
      </Wrapper>,
    );

    // Assert
    expect(screen.queryByTestId("warehouse-zones-add")).not.toBeInTheDocument();
    expect(
      screen.getByText(
        "Add this location to a channel first. Stock here can't be sold until then.",
      ),
    ).toBeInTheDocument();
  });
});
