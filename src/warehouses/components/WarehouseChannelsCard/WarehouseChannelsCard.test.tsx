import { type WarehouseChannelRef } from "@dashboard/warehouses/hooks/useWarehouseChannelMembership";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import { type ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";

import { WarehouseChannelsCard } from "./WarehouseChannelsCard";

type CardProps = Partial<
  Pick<
    ComponentProps<typeof WarehouseChannelsCard>,
    "status" | "channels" | "canManage" | "availableChannels"
  >
>;

const europe: WarehouseChannelRef = { id: "ch-eu", name: "Europe" };

const renderCard = (props: CardProps = {}): ReturnType<typeof render> =>
  render(
    <Wrapper>
      <MemoryRouter>
        <WarehouseChannelsCard
          status={props.status ?? "ready"}
          channels={props.channels ?? []}
          availableChannels={props.availableChannels ?? [europe]}
          canManage={props.canManage ?? true}
          disabled={false}
          onRetry={jest.fn()}
          onRemove={jest.fn()}
          onRequestAssign={jest.fn()}
        />
      </MemoryRouter>
    </Wrapper>,
  );

describe("WarehouseChannelsCard", () => {
  it("says stock cannot be sold when the location is in no channel", () => {
    // Arrange
    const props: CardProps = { channels: [] };

    // Act
    renderCard(props);

    // Assert
    expect(screen.getByTestId("assign-list-required-meta")).toHaveTextContent("Required to sell");
    expect(screen.getByText("Stock here can't be sold yet")).toBeInTheDocument();
    expect(screen.getByTestId("warehouse-channels-add")).toBeInTheDocument();
  });

  it("lists assigned channels", () => {
    // Arrange
    const props: CardProps = { channels: [europe] };

    // Act
    renderCard(props);

    // Assert
    expect(screen.getByText("Europe")).toBeInTheDocument();
    expect(screen.queryByTestId("warehouse-channels-empty")).not.toBeInTheDocument();
  });

  it("hides add and remove when the user cannot manage channels", () => {
    // Arrange
    const props: CardProps = {
      canManage: false,
      channels: [europe],
    };

    // Act
    renderCard(props);

    // Assert
    expect(screen.queryByTestId("warehouse-channels-add")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Remove from Europe" })).not.toBeInTheDocument();
    expect(screen.getByText("Needs permission to manage channels")).toBeInTheDocument();
  });

  it("keeps the footer when every channel is already assigned", () => {
    // Arrange
    const props: CardProps = {
      channels: [europe],
      availableChannels: [],
    };

    // Act
    renderCard(props);

    // Assert
    expect(screen.queryByTestId("warehouse-channels-add")).not.toBeInTheDocument();
    expect(screen.getByTestId("warehouse-channels-footer")).toHaveTextContent(
      "All channels are assigned.",
    );
  });

  it("does not claim the location is outside every channel when channels failed to load", () => {
    // Arrange
    const props: CardProps = { status: "error" };

    // Act
    renderCard(props);

    // Assert
    expect(screen.getByText("Couldn't load channels.")).toBeInTheDocument();
    expect(screen.queryByText("Stock here can't be sold yet")).not.toBeInTheDocument();
    expect(screen.queryByText("Not in a channel")).not.toBeInTheDocument();
  });
});
