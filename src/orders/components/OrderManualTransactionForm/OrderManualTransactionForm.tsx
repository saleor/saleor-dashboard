import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { ReactNode } from "react";

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
  children?: ReactNode;
}

export const OrderManualTransactionForm = ({
  children,
  ...props
}: OrderManualTransactionFormProps) => {
  const { submitState, initialData } = props;
  const hookData = useManualRefund({ submitState, initialData });

  return (
    <ManualTransactionContext.Provider
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      value={{
        ...hookData,
        ...props,
      }}
    >
      {children}
    </ManualTransactionContext.Provider>
  );
};
