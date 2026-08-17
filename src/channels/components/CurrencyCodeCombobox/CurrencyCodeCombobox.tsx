import {
  getCurrencyCodeSources,
  getCurrencyCountriesForSearch,
  getCurrencySearchLabel,
  getCurrencySymbol,
} from "@dashboard/channels/utils/currencyCodeOptions";
import { Box, DynamicCombobox, type Option } from "@saleor/macaw-ui-next";
import { useEffect, useMemo, useRef } from "react";
import { useIntl } from "react-intl";

import styles from "./CurrencyCodeCombobox.module.css";

const currencyCodeSources = getCurrencyCodeSources();

interface CurrencyCodeComboboxProps {
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  label: string;
  name?: string;
  value: string;
  onChange: (currencyCode: string) => void;
  "data-test-id"?: string;
}

export const CurrencyCodeCombobox = ({
  disabled = false,
  error = false,
  helperText,
  label,
  name,
  value,
  onChange,
  "data-test-id": dataTestId,
}: CurrencyCodeComboboxProps): JSX.Element => {
  const intl = useIntl();
  // Macaw fires onChange(null) while syncing inputValue on mount/remount. Ignore that
  // so country→currency autosuggest is not immediately cleared.
  const suppressEmptyChangeRef = useRef(true);

  useEffect(
    function suppressEmptyChangeAfterValueSync() {
      suppressEmptyChangeRef.current = true;

      const frameId = requestAnimationFrame(() => {
        suppressEmptyChangeRef.current = false;
      });

      return () => cancelAnimationFrame(frameId);
    },
    [value],
  );

  const options: Option[] = useMemo(() => {
    return currencyCodeSources.map(source => {
      const symbol = getCurrencySymbol(source.code, intl.locale);
      const showSymbol = symbol !== source.code;
      const countries = getCurrencyCountriesForSearch(source.countries).join(", ");

      return {
        // Label is visually hidden; kept for Macaw's built-in filter (code, symbol, countries).
        label: getCurrencySearchLabel(source, symbol),
        value: source.code,
        startAdornment: (
          <Box
            as="span"
            className={styles.leading}
            data-currency-option-leading=""
            aria-hidden="true"
          >
            <span className={styles.code}>{source.code}</span>
            <span className={styles.symbol}>{showSymbol ? symbol : ""}</span>
          </Box>
        ),
        endAdornment: (
          <Box
            as="span"
            className={styles.countries}
            title={countries}
            aria-hidden="true"
            __flex="1 1 0"
            __minWidth="0"
          >
            {countries}
          </Box>
        ),
      };
    });
  }, [intl.locale]);

  // Resolve by code so country→currency autosuggest updates the closed input.
  // Keep a short label in the field (code only), not the full search string.
  const selectedValue: Option | null = value
    ? {
        label: value,
        value,
      }
    : null;

  return (
    <DynamicCombobox
      // Remount when autosuggest/programmatic value changes — Macaw may not
      // sync the input from an external value update alone.
      key={value || "currency-empty"}
      data-test-id={dataTestId}
      disabled={disabled}
      error={error}
      label={label}
      helperText={helperText}
      options={options}
      name={name}
      value={selectedValue}
      onChange={option => {
        const nextValue = option?.value ?? "";

        if (!nextValue && suppressEmptyChangeRef.current) {
          return;
        }

        onChange(nextValue);
      }}
    />
  );
};
