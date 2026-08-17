import { type ChangeEvent, type FocusEvent, useCallback, useMemo } from "react";

import { formatPriceInput, getCurrencyDecimalPoints, padPriceToDecimalPlaces } from "./utils";

export type PriceFieldV2ChangeHandler = (value: string) => void;

interface UsePriceFieldV2Options {
  padDecimalsOnBlur?: boolean;
}

/**
 * Hook for handling price input with currency-aware decimal validation.
 * - Filters non-numeric input
 * - Limits decimal places based on currency (e.g., 2 for USD, 0 for JPY)
 * - Normalizes decimal separator to dot (10,50 → 10.50)
 * - Optionally pads to currency decimals on blur (10.2 → 10.20)
 */
export function usePriceFieldV2(
  currencySymbol: string | undefined,
  onChange: PriceFieldV2ChangeHandler,
  { padDecimalsOnBlur = true }: UsePriceFieldV2Options = {},
) {
  const maxDecimalPlaces = useMemo(
    () => getCurrencyDecimalPoints(currencySymbol),
    [currencySymbol],
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const rawValue = String(event.target.value ?? "");
      const formattedValue = formatPriceInput(rawValue, maxDecimalPlaces);

      if (!formattedValue && rawValue) return;

      onChange(formattedValue);
    },
    [maxDecimalPlaces, onChange],
  );

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      if (!padDecimalsOnBlur) {
        return;
      }

      const rawValue = String(event.target.value ?? "");
      const paddedValue = padPriceToDecimalPlaces(rawValue, maxDecimalPlaces);

      if (paddedValue !== rawValue) {
        onChange(paddedValue);
      }
    },
    [maxDecimalPlaces, onChange, padDecimalsOnBlur],
  );

  return {
    handleBlur,
    handleChange,
    maxDecimalPlaces,
  };
}
