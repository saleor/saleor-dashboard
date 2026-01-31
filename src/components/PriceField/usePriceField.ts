import { FormChange } from "@dashboard/hooks/useForm";
import { useMemo } from "react";

import { formatPriceInput, getCurrencyDecimalPoints } from "./utils";

/**
 * Hook for handling price input with currency-aware decimal validation.
 * - Filters non-numeric input
 * - Limits decimal places based on currency (e.g., 2 for USD, 0 for JPY)
 * - Normalizes decimal separator to dot (10,50 → 10.50)
 */
export function usePriceField(currency: string | undefined, onChange: FormChange) {
  const maxDecimalPlaces = useMemo(() => getCurrencyDecimalPoints(currency), [currency]);

  const handleChange: FormChange = e => {
    const rawValue = String(e.target.value ?? "");
    const formattedValue = formatPriceInput(rawValue, maxDecimalPlaces ?? 2);

    onChange({
      target: {
        name: e.target.name,
        value: formattedValue || null,
      },
    });
  };

  return {
    onChange: handleChange,
  };
}
