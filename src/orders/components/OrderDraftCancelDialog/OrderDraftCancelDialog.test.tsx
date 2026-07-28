import { OrderErrorCode, type OrderErrorFragment } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormattedMessage } from "react-intl";

import { orderDraftCancelDialogMessages as messages } from "./messages";
import { OrderDraftCancelDialog } from "./OrderDraftCancelDialog";

const defaultProps = {
  confirmButtonState: "default" as const,
  errors: [],
  open: true,
  onClose: jest.fn(),
  onConfirm: jest.fn(),
  orderNumber: "123",
};

describe("OrderDraftCancelDialog", () => {
  it("displays confirmation copy with order number", () => {
    // Arrange
    const orderNumber = "456";

    // Act
    render(
      <Wrapper>
        <OrderDraftCancelDialog {...defaultProps} orderNumber={orderNumber} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByText("Delete Draft Order")).toBeInTheDocument();
    expect(FormattedMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        ...messages.dialogContent,
        values: expect.objectContaining({ orderNumber }),
      }),
      {},
    );
  });

  it("calls onConfirm when delete is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onConfirm = jest.fn();

    render(
      <Wrapper>
        <OrderDraftCancelDialog {...defaultProps} onConfirm={onConfirm} />
      </Wrapper>,
    );

    // Act
    await user.click(screen.getByTestId("submit"));

    // Assert
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("displays error messages when provided", () => {
    // Arrange
    const errors = [
      { code: OrderErrorCode.GRAPHQL_ERROR },
      { code: OrderErrorCode.INVALID },
    ] as unknown as OrderErrorFragment[];

    // Act
    render(
      <Wrapper>
        <OrderDraftCancelDialog {...defaultProps} errors={errors} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getAllByTestId("dialog-error")).toHaveLength(errors.length);
  });

  it("does not display error messages when none are provided", () => {
    // Arrange // Act
    render(
      <Wrapper>
        <OrderDraftCancelDialog {...defaultProps} errors={[]} />
      </Wrapper>,
    );

    // Assert
    expect(screen.queryAllByTestId("dialog-error")).toHaveLength(0);
  });
});
