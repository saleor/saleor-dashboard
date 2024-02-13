import { OrderErrorCode, OrderErrorFragment } from "@dashboard/graphql";
import { render, screen } from "@testing-library/react";
import React from "react";
import { FormattedMessageProps } from "react-intl";

import { OrderCancelDialog } from "./OrderCancelDialog";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
  FormattedMessage: ({ defaultMessage, values }: FormattedMessageProps) => {
    let formattedMessage = defaultMessage;

    // Replace placeholders with corresponding values if values are provided
    if (values) {
      Object.keys(values).forEach(key => {
        const valueRegex = new RegExp(`#{${key}}`, "g");
        formattedMessage = formattedMessage.replace(
          valueRegex,
          values[key] as string,
        );
      });
    }

    return <>{formattedMessage}</>;
  },
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
  it("displays the order number in the dialog title", () => {
    // Arrange
    const orderNumber = "456";

    // Act
    render(<OrderCancelDialog {...defaultProps} number={orderNumber} />);

    // Assert
    const dialogTitle = screen.getByTestId("dialog-title");
    expect(dialogTitle).toHaveTextContent(orderNumber);
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
