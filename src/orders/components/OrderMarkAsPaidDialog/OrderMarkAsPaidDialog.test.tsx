import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { OrderErrorCode, type OrderErrorFragment } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { OrderMarkAsPaidDialog } from "./OrderMarkAsPaidDialog";

describe("OrderMarkAsPaidDialog", () => {
  const defaultProps = {
    confirmButtonState: "default" as ConfirmButtonTransitionState,
    errors: [],
    open: true,
    transactionReference: "",
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    handleTransactionReference: jest.fn(),
  };

  it("renders title, description, and transaction reference input", () => {
    // Arrange // Act
    render(
      <Wrapper>
        <OrderMarkAsPaidDialog {...defaultProps} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Mark Order as Paid")).toBeInTheDocument();
    expect(screen.getByText(/You're going to mark this order as paid/)).toBeInTheDocument();
    expect(screen.getByTestId("transaction-reference-input")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mark as Paid" })).toBeInTheDocument();
  });

  it("calls onConfirm when submit is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onConfirm = jest.fn();

    render(
      <Wrapper>
        <OrderMarkAsPaidDialog {...defaultProps} onConfirm={onConfirm} />
      </Wrapper>,
    );

    // Act
    await user.click(screen.getByTestId("submit"));

    // Assert
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("displays order-level error messages when provided", () => {
    // Arrange
    const errors = [
      {
        code: OrderErrorCode.TRANSACTION_ERROR,
        field: null,
        message: "Orders with transactions can not be manually marked as paid.",
      },
    ] as unknown as OrderErrorFragment[];

    // Act
    render(
      <Wrapper>
        <OrderMarkAsPaidDialog {...defaultProps} errors={errors} />
      </Wrapper>,
    );

    // Assert
    expect(
      screen.getByText("Orders with transactions can not be manually marked as paid."),
    ).toBeInTheDocument();
    expect(screen.getByTestId("transaction-reference-input")).not.toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("displays field-specific errors on other fields below the input", () => {
    // Arrange
    const errors = [
      { code: OrderErrorCode.GRAPHQL_ERROR, field: "channel" },
    ] as unknown as OrderErrorFragment[];

    // Act
    render(
      <Wrapper>
        <OrderMarkAsPaidDialog {...defaultProps} errors={errors} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getAllByTestId("dialog-error")).toHaveLength(1);
  });

  it("shows transaction reference field errors on the input only", () => {
    // Arrange
    const errors = [
      {
        code: OrderErrorCode.INVALID,
        field: "transactionReference",
        message: "Reference is too long.",
      },
    ] as unknown as OrderErrorFragment[];

    // Act
    render(
      <Wrapper>
        <OrderMarkAsPaidDialog {...defaultProps} errors={errors} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByText("Invalid value")).toBeInTheDocument();
    expect(screen.queryAllByTestId("dialog-error")).toHaveLength(0);
  });
});
