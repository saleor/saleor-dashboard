import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { WarehouseChannelsCard } from "./WarehouseChannelsCard";

const renderCard = (
  props: Partial<{
    status: "loading" | "error" | "ready";
    channels: Array<{ id: string; name: string }>;
    canManage: boolean;
  }> = {},
): ReturnType<typeof render> =>
  render(
    <Wrapper>
      <MemoryRouter>
        <WarehouseChannelsCard
          status={props.status ?? "ready"}
          channels={props.channels ?? []}
          availableChannels={[{ id: "ch-eu", name: "Europe" }]}
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
    renderCard();

    // Assert
    expect(screen.getByText("Stock here can't be sold yet")).toBeInTheDocument();
    expect(screen.getByTestId("warehouse-channels-add")).toBeInTheDocument();
  });

  it("lists assigned channels", () => {
    // Arrange
    renderCard({ channels: [{ id: "ch-eu", name: "Europe" }] });

    // Assert
    expect(screen.getByText("Europe")).toBeInTheDocument();
    expect(screen.queryByTestId("warehouse-channels-empty")).not.toBeInTheDocument();
  });

  it("hides add and remove when the user cannot manage channels", () => {
    // Arrange
    renderCard({
      canManage: false,
      channels: [{ id: "ch-eu", name: "Europe" }],
    });

    // Assert
    expect(screen.queryByTestId("warehouse-channels-add")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Remove from Europe" })).not.toBeInTheDocument();
  });

  it("does not claim the location is outside every channel when channels failed to load", () => {
    // Arrange
    renderCard({ status: "error" });

    // Assert
    expect(screen.getByText("Couldn't load channels.")).toBeInTheDocument();
    expect(screen.queryByText("Stock here can't be sold yet")).not.toBeInTheDocument();
    expect(screen.queryByText("Not in a channel")).not.toBeInTheDocument();
  });
});
