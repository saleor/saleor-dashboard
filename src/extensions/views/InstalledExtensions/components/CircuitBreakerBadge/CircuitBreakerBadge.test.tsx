import { CircuitBreakerStateEnum } from "@dashboard/graphql";
import { fireEvent, render, screen } from "@testing-library/react";

import { CircuitBreakerBadge } from "./CircuitBreakerBadge";

describe("CircuitBreakerBadge", () => {
  beforeEach(() => {
    global.ResizeObserver = jest.fn(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  it("renders nothing when the breaker is closed", () => {
    // Arrange & Act
    const { container } = render(<CircuitBreakerBadge state={CircuitBreakerStateEnum.CLOSED} />);

    // Assert
    expect(container).toBeEmptyDOMElement();
  });

  it.each([
    [CircuitBreakerStateEnum.HALF_OPEN, "Webhooks recovering", /checking whether/],
    [CircuitBreakerStateEnum.OPEN, "Webhooks paused", /stopped sending/],
  ])("shows %s label with explanation on focus", async (state, label, description) => {
    // Arrange
    render(<CircuitBreakerBadge state={state} />);

    const badge = screen.getByText(label);

    // Act
    fireEvent.focus(badge);

    // Assert
    expect(await screen.findByRole("tooltip")).toHaveTextContent(description);
  });
});
