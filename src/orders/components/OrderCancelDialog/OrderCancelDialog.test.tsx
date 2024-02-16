import { OrderErrorCode, OrderErrorFragment } from "@dashboard/graphql";
import { render, screen } from "@testing-library/react";
import React from "react";

import { OrderCancelDialog } from "./OrderCancelDialog";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
  FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => (
    <>{defaultMessage}</>
  ),
}));

const defaultProps = {
  confirmButtonState: "default" as const,
  errors: [],
  open: true,
  onClose: jest.fn(),
  onSubmit: jest.fn(),
  number: "123",
};

describe("OrderCancelDialog", () => {
  it("displays cancel order in the dialog title", () => {
    // Arrange & Act
    render(<OrderCancelDialog {...defaultProps} />);

    // Assert
    const dialogTitle = screen.getByTestId("dialog-title");
    expect(dialogTitle).toHaveTextContent("Cancel order");
  });

  it("displays error messages when provided", () => {
    // Arrange
    const errors = [
      { code: OrderErrorCode.CANNOT_CANCEL_ORDER },
      { code: OrderErrorCode.GRAPHQL_ERROR },
    ] as unknown as OrderErrorFragment[];

    // Act
    render(<OrderCancelDialog {...defaultProps} errors={errors} />);

    // Assert
    const errorMessages = screen.getAllByTestId("dialog-error");
    expect(errorMessages).toHaveLength(errors.length);
  });

  it("does not display error messages when none are provided", () => {
    // Act
    render(<OrderCancelDialog {...defaultProps} errors={[]} />);

    // Assert
    const errorMessages = screen.queryAllByTestId("dialog-error");
    expect(errorMessages).toHaveLength(0);
  });
});
