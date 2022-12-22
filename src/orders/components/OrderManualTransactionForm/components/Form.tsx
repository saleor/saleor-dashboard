import React from "react";

import { useManualTransactionContext } from "../context";

export const Form: React.FC<React.HTMLProps<HTMLFormElement>> = ({
  children,
  ...props
}) => {
  const {
    amount,
    description,
    onAddTransaction,
  } = useManualTransactionContext();

  return (
    <form
      {...props}
      onSubmit={e => {
        e.preventDefault();
        if (amount) {
          onAddTransaction({ amount, description });
        }
      }}
    >
      {children}
    </form>
  );
};
