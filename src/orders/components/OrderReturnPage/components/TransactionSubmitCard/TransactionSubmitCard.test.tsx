import { ThemeProvider as LegacyThemeProvider } from "@saleor/macaw-ui";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { ReactNode } from "react";

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

describe("TransactionSubmitCard", () => {
  it("submits on click", async () => {
    const submitFn = jest.fn();
    render(
      <TransactionSubmitCard
        transactions={[]}
        grantRefundErrors={[]}
        sendRefundErrors={[]}
        autoGrantRefund={false}
        autoSendRefund={false}
        refundShipmentCosts={false}
        canRefundShipping={false}
        shippingCosts={{ amount: 0, currency: "USD" }}
        amountData={{
          refundTotalAmount: { amount: 0, currency: "USD" },
          shipmentCost: { amount: 0, currency: "USD" },
          authorizedAmount: { amount: 0, currency: "USD" },
          previouslyRefunded: { amount: 0, currency: "USD" },
          maxRefund: { amount: 0, currency: "USD" },
        }}
        onChange={() => {}}
        customRefundValue={0}
        onSubmit={submitFn}
        disabled={false}
        submitStatus="default"
        onAmountChange={() => {}}
        isAmountDirty={false}
      />,
      { wrapper: Wrapper },
    );

    const submitBtn = screen.getByTestId("return-submit-button");

    await userEvent.click(submitBtn);

    expect(submitFn).toHaveBeenCalled();
  });
});
