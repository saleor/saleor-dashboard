import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { OrderFulfillmentApproveDialog } from "./OrderFulfillmentApproveDialog";

describe("OrderFulfillmentApproveDialog", () => {
  const defaultProps = {
    confirmButtonState: "default" as ConfirmButtonTransitionState,
    errors: [],
    open: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
  };

  it("calls onConfirm when approve is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onConfirm = jest.fn();

    render(
      <Wrapper>
        <OrderFulfillmentApproveDialog {...defaultProps} onConfirm={onConfirm} />
      </Wrapper>,
    );

    // Act
    await user.click(screen.getByTestId("submit"));

    // Assert
    expect(onConfirm).toHaveBeenCalledWith({ notifyCustomer: true });
  });
});
