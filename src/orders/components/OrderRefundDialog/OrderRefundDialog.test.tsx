import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { OrderRefundDialog } from "./OrderRefundDialog";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
}));
describe("OrderRefundDialog", () => {
  it("renders the dialog when open is true", () => {
    // Arrange
    const props = {
      open: true,
      onClose: jest.fn(),
      onConfirm: jest.fn(),
    };

    // Act
    render(<OrderRefundDialog {...props} />);

    // Assert
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
  });
  it("does not render the dialog when open is false", () => {
    // Arrange
    const props = {
      open: false,
      onClose: jest.fn(),
      onConfirm: jest.fn(),
    };

    // Act
    render(<OrderRefundDialog {...props} />);

    // Assert
    const dialog = screen.queryByRole("dialog");
    expect(dialog).not.toBeInTheDocument();
  });
  it("calls onClose when the cancel button is clicked", () => {
    // Arrange
    const props = {
      open: true,
      onClose: jest.fn(),
      onConfirm: jest.fn(),
    };

    // Act
    render(<OrderRefundDialog {...props} />);
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);
    // Assert
    expect(props.onClose).toHaveBeenCalled();
  });
  it("calls onConfirm when the confirm button is clicked", () => {
    // Arrange
    const props = {
      open: true,
      onClose: jest.fn(),
      onConfirm: jest.fn(),
    };

    // Act
    render(<OrderRefundDialog {...props} />);
    const confirmButton = screen.getByRole("button", { name: /confirm/i });
    fireEvent.click(confirmButton);
    // Assert
    expect(props.onConfirm).toHaveBeenCalled();
  });
});
