import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { TransactionActionEnum } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { OrderTransactionActionDialog } from "./OrderTransactionActionDialog";

describe("OrderTransactionActionDialog", () => {
  const defaultProps = {
    confirmButtonState: "default" as ConfirmButtonTransitionState,
    open: true,
    onClose: jest.fn(),
    onSubmit: jest.fn(),
    action: TransactionActionEnum.CANCEL,
  };

  it("renders dialog with void action label", () => {
    // Arrange // Act
    render(
      <Wrapper>
        <OrderTransactionActionDialog {...defaultProps} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Void transaction")).toBeInTheDocument();
    expect(screen.getByText("Are you sure you want to void this transaction?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Void" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
  });
});
