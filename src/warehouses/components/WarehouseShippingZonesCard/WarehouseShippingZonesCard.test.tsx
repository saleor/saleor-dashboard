import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";

import { WarehouseShippingZonesCard } from "./WarehouseShippingZonesCard";

type CardProps = ComponentProps<typeof WarehouseShippingZonesCard>;

const baseProps: CardProps = {
  legacyStockAvailability: true,
  zones: [],
  totalCount: 0,
  membershipStatus: "ready",
  warehouseChannelIds: ["channel-1"],
  channelNames: ["Brazil"],
  pickupEnabled: false,
  canManage: true,
  onRequestAssign: jest.fn(),
  onRemove: jest.fn(),
};

const renderCard = (props: CardProps): ReturnType<typeof render> =>
  render(
    <Wrapper>
      <MemoryRouter>
        <WarehouseShippingZonesCard {...props} />
      </MemoryRouter>
    </Wrapper>,
  );

describe("WarehouseShippingZonesCard", () => {
  it("offers to add a shipping zone once the location is in a channel", async () => {
    // Arrange
    const onRequestAssign = jest.fn();

    renderCard({ ...baseProps, onRequestAssign });

    // Act
    await userEvent.click(screen.getByTestId("warehouse-zones-add"));

    // Assert
    expect(screen.getByTestId("assign-list-required-meta")).toHaveTextContent("Required to sell");
    expect(screen.getByText("No shipping zone")).toBeInTheDocument();
    expect(onRequestAssign).toHaveBeenCalledTimes(1);
  });

  it("waits for a channel before a zone can be added", () => {
    // Arrange
    const props: CardProps = { ...baseProps, warehouseChannelIds: [], channelNames: [] };

    // Act
    renderCard(props);

    // Assert
    expect(screen.queryByTestId("warehouse-zones-add")).not.toBeInTheDocument();
    expect(screen.queryByTestId("assign-list-required-meta")).not.toBeInTheDocument();
    expect(
      screen.getByText(
        "Add this warehouse to a channel first. Stock here can't be sold until then.",
      ),
    ).toBeInTheDocument();
  });

  it("still requires a zone when linked zones share no channel", () => {
    // Arrange
    const props: CardProps = {
      ...baseProps,
      zones: [{ id: "z-eu", name: "Europe", channelIds: ["other-channel"] }],
      totalCount: 1,
      warehouseChannelIds: ["channel-1"],
      channelNames: ["Brazil"],
    };

    // Act
    renderCard(props);

    // Assert
    expect(screen.getByTestId("assign-list-required-meta")).toHaveTextContent("Required to sell");
    expect(screen.getByText("Europe")).toBeInTheDocument();
    expect(screen.getByText("Not in this warehouse's channels")).toBeInTheDocument();
    expect(screen.getByTestId("warehouse-zones-add")).toBeInTheDocument();
  });

  it("hides Add when the warehouse has no channel to offer zones from", () => {
    // Arrange
    const props: CardProps = {
      ...baseProps,
      legacyStockAvailability: false,
      zones: [{ id: "z-eu", name: "Europe", channelIds: ["channel-eu"] }],
      totalCount: 1,
      warehouseChannelIds: [],
      channelNames: [],
    };

    // Act
    renderCard(props);

    // Assert
    expect(screen.getByText("Europe")).toBeInTheDocument();
    expect(screen.queryByTestId("warehouse-zones-add")).not.toBeInTheDocument();
  });
});
