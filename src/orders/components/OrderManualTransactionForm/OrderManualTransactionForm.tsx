import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";

import { ManualTransactionContext } from "./context";
import { useManualRefund } from "./hooks";

interface OrderManualTransactionSubmitVariables {
  amount: number;
  description: string;
}

export interface OrderManualTransactionFormProps {
  onAddTransaction: (vars: OrderManualTransactionSubmitVariables) => void;
  currency: string;
  submitState: ConfirmButtonTransitionState;
  error: string | undefined;
}

export const OrderManualTransactionForm: React.FC<OrderManualTransactionFormProps> = ({
  children,
  ...props
}) => {
  const hookData = useManualRefund({ submitState: props.submitState });

  return (
    <ManualTransactionContext.Provider
      value={{
        ...hookData,
        ...props,
      }}
    >
      {children}
    </ManualTransactionContext.Provider>
  );
};
