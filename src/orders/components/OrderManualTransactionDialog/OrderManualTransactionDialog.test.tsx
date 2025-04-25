import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { OrderManualTransactionDialog } from "./OrderManualTransactionDialog";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
  FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => <>{defaultMessage}</>,
}));

describe("OrderManualTransactionDialog", () => {
  it("should call onClose when click in close button", async () => {
    // Arrange
    const onClose = jest.fn();

    render(
      <OrderManualTransactionDialog
        error={undefined}
        dialogProps={{
          open: true,
          onClose,
        }}
        submitState="default"
        currency="USD"
        onAddTransaction={jest.fn()}
      />,
    );

    // Act
    await act(async () => {
      await userEvent.click(screen.getByTestId("close-button"));
    });

    // Assert
    expect(onClose).toHaveBeenCalled();
  });
});
