import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { ChannelRemoveUnlinkMessage } from "./ChannelRemoveUnlinkMessage";

describe("ChannelRemoveUnlinkMessage", () => {
  it("names five zones and counts the rest", () => {
    // Arrange
    const zoneNames: string[] = ["A", "B", "C", "D", "E", "F", "G"];

    // Act
    render(
      <Wrapper>
        <ChannelRemoveUnlinkMessage zoneNames={zoneNames} />
      </Wrapper>,
    );

    // Assert
    expect(
      screen.getByText(
        "A, B, C, D, E, and 2 other shipping zones will also be unlinked from this warehouse, because they share no other channel with it.",
      ),
    ).toBeInTheDocument();
  });

  it("says the check failed instead of naming zones", () => {
    // Arrange
    const zoneNames = null;

    // Act
    render(
      <Wrapper>
        <ChannelRemoveUnlinkMessage zoneNames={zoneNames} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByText(/We couldn't check which shipping zones/)).toBeInTheDocument();
  });
});
