import { Input, type InputProps } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { type FocusEvent } from "react";

import styles from "./PriceFieldV2.module.css";
import { type PriceFieldV2ChangeHandler, usePriceFieldV2 } from "./usePriceFieldV2";

/**
 * Preferred money/amount input for the Dashboard.
 * Currency-aware typing + blur padding; pair with spreadsheet paste helpers for row lists.
 * See saleor-dashboard-styles skill → "Price inputs (PriceFieldV2)".
 */
export interface PriceFieldV2Props
  extends Omit<InputProps, "onChange" | "value" | "type" | "inputMode"> {
  /** Currency code (e.g. USD) — used for adornment and decimal precision. */
  currencySymbol: string;
  value: string;
  onChange: PriceFieldV2ChangeHandler;
  padDecimalsOnBlur?: boolean;
}

export const PriceFieldV2 = ({
  className,
  currencySymbol,
  value,
  onChange,
  endAdornment,
  onBlur,
  padDecimalsOnBlur = true,
  ...inputProps
}: PriceFieldV2Props) => {
  const { handleBlur: handlePriceBlur, handleChange } = usePriceFieldV2(currencySymbol, onChange, {
    padDecimalsOnBlur,
  });

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    handlePriceBlur(event);
    onBlur?.(event);
  };

  return (
    <Input
      className={clsx(styles.priceFieldV2, className)}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      data-test-id="price-field-v2"
      endAdornment={endAdornment ?? currencySymbol}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      {...inputProps}
    />
  );
};

PriceFieldV2.displayName = "PriceFieldV2";
