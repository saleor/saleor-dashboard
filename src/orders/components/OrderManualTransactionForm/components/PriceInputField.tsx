// @ts-strict-ignore
import PriceField, { PriceFieldProps } from "@dashboard/components/PriceField";

import { useManualTransactionContext } from "../context";

export const PriceInputField = ({
  disabled,
  ...props
}: Omit<PriceFieldProps, "currencySymbol" | "onChange" | "value">) => {
  const { currency, submitState, handleChangeAmount, amount } = useManualTransactionContext();

  return (
    <PriceField
      {...props}
      currencySymbol={currency}
      disabled={submitState === "loading" || disabled}
      onChange={handleChangeAmount}
      value={amount?.toString() ?? ""}
      data-test-id="transactAmountInput"
    />
  );
};
