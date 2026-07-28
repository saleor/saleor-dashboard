import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { OrderErrorCode, type OrderErrorFragment } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import OrderPaymentVoidDialog from "./OrderPaymentVoidDialog";

describe("OrderPaymentVoidDialog", () => {
  const defaultProps = {
    confirmButtonState: "default" as ConfirmButtonTransitionState,
    errors: [],
    open: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
  };

  it("renders title and confirmation text", () => {
    // Arrange // Act
    render(
      <Wrapper>
        <OrderPaymentVoidDialog {...defaultProps} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByText("Void Payment")).toBeInTheDocument();
    expect(screen.getByText("Are you sure you want to void this payment?")).toBeInTheDocument();
  });

  it("displays error messages when provided", () => {
    // Arrange
    const errors = [{ code: OrderErrorCode.GRAPHQL_ERROR }] as unknown as OrderErrorFragment[];

    // Act
    render(
      <Wrapper>
        <OrderPaymentVoidDialog {...defaultProps} errors={errors} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getAllByTestId("dialog-error")).toHaveLength(1);
  });
});
