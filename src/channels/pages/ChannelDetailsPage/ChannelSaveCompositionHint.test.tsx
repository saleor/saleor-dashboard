import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { ChannelSaveCompositionHint } from "./ChannelSaveCompositionHint";
import { type ChannelSaveComposition } from "./saveComposition";

const renderHint = (composition?: ChannelSaveComposition | null) =>
  render(
    <Wrapper>
      <ChannelSaveCompositionHint composition={composition} />
    </Wrapper>,
  );

describe("ChannelSaveCompositionHint", () => {
  it("renders nothing when composition is empty", () => {
    // Arrange / Act
    renderHint({
      hasGeneral: false,
      hasOrders: false,
      hasPayments: false,
      hasInventory: false,
      hasDelivery: false,
    });

    // Assert
    expect(screen.queryByTestId("channel-save-composition")).not.toBeInTheDocument();
  });

  it("renders nothing when composition is omitted", () => {
    // Arrange / Act
    renderHint();

    // Assert
    expect(screen.queryByTestId("channel-save-composition")).not.toBeInTheDocument();
  });

  it("lists dirty channel sections", () => {
    // Arrange / Act
    renderHint({
      hasGeneral: true,
      hasOrders: true,
      hasPayments: true,
      hasInventory: true,
      hasDelivery: true,
    });

    // Assert
    const hint = screen.getByTestId("channel-save-composition");

    expect(hint).toHaveTextContent("Unsaved changes:");
    expect(hint).toHaveTextContent("general");
    expect(hint).toHaveTextContent("orders");
    expect(hint).toHaveTextContent("payments");
    expect(hint).toHaveTextContent("inventory");
    expect(hint).toHaveTextContent("delivery");
  });
});
