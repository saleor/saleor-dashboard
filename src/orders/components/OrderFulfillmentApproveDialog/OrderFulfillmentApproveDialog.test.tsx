import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Wrapper from "@test/wrapper";
import { fireEvent, render, screen } from "@testing-library/react";

import { OrderFulfillmentApproveDialog } from "./OrderFulfillmentApproveDialog";

describe("OrderFulfillmentApproveDialog", () => {
  const defaultProps = {
    confirmButtonState: "default" as ConfirmButtonTransitionState,
    errors: [],
    open: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
  };

  it("calls onConfirm when approve is clicked", () => {
    // Arrange
    const onConfirm = jest.fn();

    render(
      <Wrapper>
        <OrderFulfillmentApproveDialog {...defaultProps} onConfirm={onConfirm} />
      </Wrapper>,
    );

    // Act
    fireEvent.click(screen.getByTestId("submit"));

    // Assert
    expect(onConfirm).toHaveBeenCalledWith({ notifyCustomer: true });
  });
});
