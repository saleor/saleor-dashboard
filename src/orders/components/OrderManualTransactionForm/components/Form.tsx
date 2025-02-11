// @ts-strict-ignore
import * as React from "react";

import { useManualTransactionContext } from "../context";

export const Form = ({ children, ...props }: React.HTMLProps<HTMLFormElement>) => {
  const { amount, description, pspReference, onAddTransaction } = useManualTransactionContext();

  return (
    <form
      {...props}
      onSubmit={e => {
        e.preventDefault();

        if (amount) {
          onAddTransaction({ amount, description, pspReference });
        }
      }}
    >
      {children}
    </form>
  );
};
