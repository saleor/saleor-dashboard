import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { OrderDraftBulkDeleteDialog } from "./OrderDraftBulkDeleteDialog";

const defaultProps = {
  confirmButtonState: "default" as ConfirmButtonTransitionState,
  count: 2,
  open: true,
  onClose: jest.fn(),
  onConfirm: jest.fn(),
};

describe("OrderDraftBulkDeleteDialog", () => {
  it("displays bulk delete confirmation copy", () => {
    // Arrange // Act
    render(
      <Wrapper>
        <OrderDraftBulkDeleteDialog {...defaultProps} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByText("Delete Order Drafts")).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete.*order drafts\?/)).toBeInTheDocument();
    expect(screen.getByTestId("submit")).toHaveTextContent("Delete");
  });

  it("calls onConfirm when delete is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onConfirm = jest.fn();

    render(
      <Wrapper>
        <OrderDraftBulkDeleteDialog {...defaultProps} onConfirm={onConfirm} />
      </Wrapper>,
    );

    // Act
    await user.click(screen.getByTestId("submit"));

    // Assert
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
