import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ProductBulkDeleteDialog } from "./ProductBulkDeleteDialog";

const defaultProps = {
  confirmButtonState: "default" as ConfirmButtonTransitionState,
  count: 3,
  open: true,
  onClose: jest.fn(),
  onConfirm: jest.fn(),
};

describe("ProductBulkDeleteDialog", () => {
  it("displays bulk delete confirmation copy", () => {
    // Arrange // Act
    render(
      <Wrapper>
        <ProductBulkDeleteDialog {...defaultProps} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByText("Delete Products")).toBeInTheDocument();
    expect(screen.getByTestId("submit")).toHaveTextContent("Delete");
  });

  it("calls onConfirm when delete is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onConfirm = jest.fn();

    render(
      <Wrapper>
        <ProductBulkDeleteDialog {...defaultProps} onConfirm={onConfirm} />
      </Wrapper>,
    );

    // Act
    await user.click(screen.getByTestId("submit"));

    // Assert
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
