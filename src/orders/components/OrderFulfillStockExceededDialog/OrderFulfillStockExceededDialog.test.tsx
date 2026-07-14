import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { OrderFulfillStockExceededDialog } from "./OrderFulfillStockExceededDialog";

describe("OrderFulfillStockExceededDialog", () => {
  const defaultProps = {
    confirmButtonState: "default" as ConfirmButtonTransitionState,
    open: true,
    lines: [],
    formsetData: [],
    onClose: jest.fn(),
    onSubmit: jest.fn(),
  };

  it("renders title, summary, table headers, and actions", () => {
    // Arrange // Act
    render(
      <Wrapper>
        <OrderFulfillStockExceededDialog {...defaultProps} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Not enough stock")).toBeInTheDocument();
    expect(
      screen.getByText(/Go back to adjust quantities, or fulfill anyway to oversell/),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go back" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fulfill anyway" })).toBeInTheDocument();
  });

  it("renders when lines are undefined", () => {
    // Arrange // Act
    render(
      <Wrapper>
        <OrderFulfillStockExceededDialog {...defaultProps} lines={undefined} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Not enough stock")).toBeInTheDocument();
  });

  it("calls onSubmit when fulfill anyway is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(
      <Wrapper>
        <OrderFulfillStockExceededDialog {...defaultProps} onSubmit={onSubmit} />
      </Wrapper>,
    );

    // Act
    await user.click(screen.getByTestId("submit"));

    // Assert
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
