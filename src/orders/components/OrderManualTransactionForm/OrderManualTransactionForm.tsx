import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";

import { ManualTransactionContext } from "./context";
import { useManualRefund } from "./hooks";

interface OrderManualTransactionSubmitVariables {
  amount: number;
  description: string;
  pspReference: string | undefined;
}

export interface OrderManualTransactionFormProps {
  onAddTransaction: (vars: OrderManualTransactionSubmitVariables) => void;
  currency: string;
  submitState: ConfirmButtonTransitionState;
  error: string | undefined;
  initialData?: Partial<OrderManualTransactionSubmitVariables>;
}

export const OrderManualTransactionForm: React.FC<
  OrderManualTransactionFormProps
> = ({ children, ...props }) => {
  const { submitState, initialData } = props;
  const hookData = useManualRefund({ submitState, initialData });

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
