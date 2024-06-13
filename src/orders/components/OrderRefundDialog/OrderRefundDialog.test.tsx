import { PermissionEnum } from "@dashboard/graphql";
import { order as orderMock } from "@dashboard/orders/fixtures";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { OrderRefundDialog } from "./OrderRefundDialog";

const order = orderMock("");

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
  FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => <>{defaultMessage}</>,
}));
jest.mock("@dashboard/auth/hooks/useUserPermissions", () => ({
  useUserPermissions: jest.fn(() => [{ code: PermissionEnum.HANDLE_PAYMENTS }]),
}));

describe("OrderRefundDialog", () => {
  it("renders the dialog when open is true", () => {
    // Arrange
    const props = {
      open: true,
      onClose: jest.fn(),
      onStandardRefund: jest.fn(),
      onManualRefund: jest.fn(),
      order,
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
      onStandardRefund: jest.fn(),
      onManualRefund: jest.fn(),
      order,
    };

    // Act
    render(<OrderRefundDialog {...props} />);

    // Assert
    const dialog = screen.queryByRole("dialog");

    expect(dialog).not.toBeInTheDocument();
  });

  it("closes the modal when user clicks on back", () => {
    // Arrange
    const props = {
      open: true,
      onClose: jest.fn(),
      onStandardRefund: jest.fn(),
      onManualRefund: jest.fn(),
      order,
    };

    // Act
    render(<OrderRefundDialog {...props} />);

    const backButton = screen.getByRole("button", { name: /back/i });

    fireEvent.click(backButton);
    // Assert
    expect(props.onClose).toHaveBeenCalled();
  });

  it("makes a standard refund (with order lines) when user confirms it", () => {
    // Arrange
    const props = {
      open: true,
      onClose: jest.fn(),
      onStandardRefund: jest.fn(),
      onManualRefund: jest.fn(),
      order,
    };

    // Act
    render(<OrderRefundDialog {...props} />);

    const confirmButton = screen.getByRole("button", { name: /proceed/i });

    fireEvent.click(confirmButton);
    // Assert
    expect(props.onStandardRefund).toHaveBeenCalled();
  });
  it("makes a manual refund when user confirms it", async () => {
    // Arrange
    const props = {
      open: true,
      onClose: jest.fn(),
      onStandardRefund: jest.fn(),
      onManualRefund: jest.fn(),
      order,
    };

    // Act
    render(<OrderRefundDialog {...props} />);

    const confirmButton = screen.getByRole("button", { name: /proceed/i });
    const manualRefundRadio = screen.getByTestId("manual-refund");

    await fireEvent.click(manualRefundRadio);
    await fireEvent.click(confirmButton);

    // Assert
    expect(props.onManualRefund).toHaveBeenCalled();
  });
});
