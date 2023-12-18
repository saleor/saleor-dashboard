import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { TransactionSubmitCard } from "./TransactionSubmitCard";

describe("SubmitCard", () => {
  it("submits on click", async () => {
    const submitFn = jest.fn();
    render(
      <Wrapper>
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
        />
      </Wrapper>,
    );

    const submitBtn = screen.getByTestId("return-submit-button");

    await userEvent.click(submitBtn);

    expect(submitFn).toHaveBeenCalled();
  });
});
