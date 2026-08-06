import { Input, type InputProps } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { type FocusEvent, useMemo, useState } from "react";

import styles from "./PriceFieldV2.module.css";
import { type PriceFieldV2ChangeHandler, usePriceFieldV2 } from "./usePriceFieldV2";
import { getPriceFieldDisplayValue } from "./utils";

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
  onFocus,
  ...inputProps
}: PriceFieldV2Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const {
    handleBlur: handlePriceBlur,
    handleChange,
    maxDecimalPlaces,
  } = usePriceFieldV2(currencySymbol, onChange, {
    padDecimalsOnBlur,
  });
  const displayValue = useMemo(
    () =>
      getPriceFieldDisplayValue(value, maxDecimalPlaces, {
        isFocused,
        padDecimals: padDecimalsOnBlur,
      }),
    [value, maxDecimalPlaces, isFocused, padDecimalsOnBlur],
  );

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
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
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...inputProps}
    />
  );
};

PriceFieldV2.displayName = "PriceFieldV2";
