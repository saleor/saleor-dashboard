import { ThemeProvider as LegacyThemeProvider } from "@saleor/macaw-ui";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { ReactNode } from "react";

import { singleRefundableTransaction } from "./fixtures";
import { TransactionSubmitCard } from "./TransactionSubmitCard";

const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <LegacyThemeProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </LegacyThemeProvider>
  );
};

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
  FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => (
    <>{defaultMessage}</>
  ),
}));

jest.mock("@dashboard/auth/hooks/useUserPermissions", () => ({
  useUserPermissions: jest.fn(() => [
    {
      __typename: "UserPermission",
      code: "HANDLE_PAYMENTS",
      name: "Handle payments",
    },
    {
      __typename: "UserPermission",
      code: "MANAGE_ORDERS",
      name: "Manage orders.",
    },
  ]),
}));

const transactionSubmitCardProps = {
  transactions: singleRefundableTransaction,
  grantRefundErrors: [],
  sendRefundErrors: [],
  autoGrantRefund: false,
  autoSendRefund: false,
  refundShipmentCosts: false,
  canRefundShipping: true,
  shippingCosts: { amount: 5, currency: "USD" },
  amountData: {
    refundTotalAmount: { amount: 0, currency: "USD" },
    shipmentCost: { amount: 0, currency: "USD" },
    authorizedAmount: { amount: 0, currency: "USD" },
    previouslyRefunded: { amount: 0, currency: "USD" },
    maxRefund: { amount: 0, currency: "USD" },
  },
  customRefundValue: undefined,
  disabled: false,
  submitStatus: "default" as const,
  onAmountChange: () => {},
  isAmountDirty: false,
};

describe("TransactionSubmitCard", () => {
  it("submits grant refund", async () => {
    // Arrange
    const submitFn = jest.fn();
    const onChangeFn = jest.fn();
    render(
      <TransactionSubmitCard
        {...transactionSubmitCardProps}
        onChange={onChangeFn}
        onSubmit={submitFn}
      />,
      { wrapper: Wrapper },
    );

    const autoGrantRefundCheckbox = screen.getByTestId(
      "auto-grant-refund-checkbox",
    );
    const submitBtn = screen.getByTestId("return-submit-button");

    // Act
    await userEvent.click(autoGrantRefundCheckbox);
    await userEvent.click(submitBtn);

    // Assert
    expect(onChangeFn).toHaveBeenCalledWith({
      target: {
        name: "autoGrantRefund",
        value: true,
      },
    });
    expect(submitFn).toHaveBeenCalled();
  });

  it("submits grant refund & send refund", async () => {
    // Arrange
    const submitFn = jest.fn();
    const onChangeFn = jest.fn();
    render(
      <TransactionSubmitCard
        {...transactionSubmitCardProps}
        // we assume grant refund has already been checked
        autoGrantRefund={true}
        onChange={onChangeFn}
        onSubmit={submitFn}
      />,
      { wrapper: Wrapper },
    );

    const autoSendRefundCheckbox = screen.getByTestId(
      "auto-send-refund-checkbox",
    );
    const submitBtn = screen.getByTestId("return-submit-button");

    // Act
    await userEvent.click(autoSendRefundCheckbox);
    await userEvent.click(submitBtn);

    // Assert
    expect(onChangeFn).toHaveBeenCalledWith({
      target: {
        name: "autoSendRefund",
        value: true,
      },
    });
    expect(submitFn).toHaveBeenCalled();
  });
  it("submits grant refund with shipment", async () => {
    // Arrange
    const submitFn = jest.fn();
    const onChangeFn = jest.fn();
    render(
      <TransactionSubmitCard
        {...transactionSubmitCardProps}
        // we assume grant refund has already been checked
        autoGrantRefund={true}
        onChange={onChangeFn}
        onSubmit={submitFn}
      />,
      { wrapper: Wrapper },
    );

    const refundShipmentCostCheckbox = screen.getByTestId(
      "refund-shipment-costs-checkbox",
    );
    const submitBtn = screen.getByTestId("return-submit-button");

    // Act
    await userEvent.click(refundShipmentCostCheckbox);
    await userEvent.click(submitBtn);

    // Assert
    expect(onChangeFn).toHaveBeenCalledWith({
      target: {
        name: "refundShipmentCosts",
        value: true,
      },
    });
    expect(submitFn).toHaveBeenCalled();
  });
  it("submits grant & send refund with custom price", async () => {
    // Arrange
    const submitFn = jest.fn();
    const onChangeFn = jest.fn();
    const onAmountChangeFn = jest.fn();
    const CUSTOM_PRICE = "5";
    render(
      <TransactionSubmitCard
        {...transactionSubmitCardProps}
        // we assume grant refund has already been checked
        autoGrantRefund={true}
        onChange={onChangeFn}
        onAmountChange={onAmountChangeFn}
        onSubmit={submitFn}
      />,
      { wrapper: Wrapper },
    );

    const priceField = screen.getByTestId("price-field");
    const submitBtn = screen.getByTestId("return-submit-button");

    // Act
    await userEvent.clear(priceField);
    await userEvent.type(priceField, CUSTOM_PRICE);
    await userEvent.click(submitBtn);

    // Assert
    expect(onAmountChangeFn).toHaveBeenCalledWith(5);
    expect(submitFn).toHaveBeenCalled();
  });
});
