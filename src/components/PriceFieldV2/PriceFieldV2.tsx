import { Input, type InputProps } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { type FocusEvent } from "react";

import styles from "./PriceFieldV2.module.css";
import { type PriceFieldV2ChangeHandler, usePriceFieldV2 } from "./usePriceFieldV2";

export interface PriceFieldV2Props
  extends Omit<InputProps, "onChange" | "value" | "type" | "inputMode"> {
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
