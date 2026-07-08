import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { OrderDraftLineRemoveDialog } from "./OrderDraftLineRemoveDialog";

const defaultProps = {
  confirmButtonState: "default" as ConfirmButtonTransitionState,
  open: true,
  productName: "T-Shirt",
  onClose: jest.fn(),
  onConfirm: jest.fn(),
};

describe("OrderDraftLineRemoveDialog", () => {
  it("displays remove product confirmation copy", () => {
    // Arrange // Act
    render(
      <Wrapper>
        <OrderDraftLineRemoveDialog {...defaultProps} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByText("Keep product")).toBeInTheDocument();
    expect(screen.getByTestId("submit")).toHaveTextContent("Remove product");
  });

  it("calls onConfirm when remove is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onConfirm = jest.fn();

    render(
      <Wrapper>
        <OrderDraftLineRemoveDialog {...defaultProps} onConfirm={onConfirm} />
      </Wrapper>,
    );

    // Act
    await user.click(screen.getByTestId("submit"));

    // Assert
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
