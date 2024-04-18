// @ts-strict-ignore
import { fireEvent, render } from "@testing-library/react";
import React from "react";

import { OrderManualTransactionFormProps } from "..";
import { OrderManualTransactionForm } from "../OrderManualTransactionForm";
import { Form } from "./Form";

const commonTransactionFormProps: Pick<
  OrderManualTransactionFormProps,
  "currency" | "submitState" | "error"
> = {
  currency: "USD",
  submitState: "default",
  error: undefined,
};

describe("OrderManualTrasactionForm / Form", () => {
  test("it handles submit event", () => {
    const submitFn = jest.fn();
    render(
      <OrderManualTransactionForm
        {...commonTransactionFormProps}
        onAddTransaction={submitFn}
        initialData={{
          amount: 1,
          description: "test",
          pspReference: "test-1234",
        }}
      >
        <Form />
      </OrderManualTransactionForm>,
    );

    const form = document.querySelector("form");
    fireEvent.submit(form);
    expect(submitFn).toHaveBeenCalledWith({
      amount: 1,
      description: "test",
      pspReference: "test-1234",
    });
  });
  test("it doesn't handle submit if amount is missing", () => {
    const submitFn = jest.fn();
    render(
      <OrderManualTransactionForm
        {...commonTransactionFormProps}
        onAddTransaction={submitFn}
        currency="USD"
        submitState="default"
        error={undefined}
        initialData={{
          amount: undefined,
          description: "test",
        }}
      >
        <Form />
      </OrderManualTransactionForm>,
    );

    const form = document.querySelector("form");
    fireEvent.submit(form);
    expect(submitFn).not.toHaveBeenCalled();
  });
});
