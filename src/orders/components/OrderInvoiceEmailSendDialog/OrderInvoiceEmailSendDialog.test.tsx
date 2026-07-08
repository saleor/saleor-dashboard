import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { InvoiceErrorCode, type InvoiceErrorFragment } from "@dashboard/graphql";
import { invoices } from "@dashboard/orders/fixtures";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import OrderInvoiceEmailSendDialog from "./OrderInvoiceEmailSendDialog";

describe("OrderInvoiceEmailSendDialog", () => {
  const invoice = invoices[0];

  const defaultProps = {
    confirmButtonState: "default" as ConfirmButtonTransitionState,
    errors: [],
    open: true,
    invoice,
    onClose: jest.fn(),
    onSend: jest.fn(),
  };

  it("renders title and confirmation text with invoice number", () => {
    // Arrange // Act
    render(
      <Wrapper>
        <OrderInvoiceEmailSendDialog {...defaultProps} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Send Invoice")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
  });

  it("displays error messages when provided", () => {
    // Arrange
    const errors = [{ code: InvoiceErrorCode.EMAIL_NOT_SET }] as unknown as InvoiceErrorFragment[];

    // Act
    render(
      <Wrapper>
        <OrderInvoiceEmailSendDialog {...defaultProps} errors={errors} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getAllByTestId("dialog-error")).toHaveLength(1);
  });
});
