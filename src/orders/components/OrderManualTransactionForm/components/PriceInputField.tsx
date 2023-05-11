import PriceField, { PriceFieldProps } from "@dashboard/components/PriceField";
import React from "react";

import { useManualTransactionContext } from "../context";

export const PriceInputField: React.FC<
  Omit<PriceFieldProps, "currencySymbol" | "onChange" | "value">
> = ({ disabled, ...props }) => {
  const { currency, submitState, handleChangeAmount, amount } =
    useManualTransactionContext();

  return (
    <PriceField
      {...props}
      currencySymbol={currency}
      disabled={submitState === "loading" || disabled}
      onChange={handleChangeAmount}
      value={amount?.toString() ?? ""}
      InputProps={{
        inputProps: {
          "data-test-id": "transactAmountInput",
        },
      }}
    />
  );
};
