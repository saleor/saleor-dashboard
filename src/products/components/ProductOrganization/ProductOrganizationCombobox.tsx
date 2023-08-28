import { ChangeEvent } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { DynamicCombobox, Option } from "@saleor/macaw-ui/next";
import debounce from "lodash/debounce";
import React, { useEffect, useRef } from "react";
import { useIntl } from "react-intl";

interface ProductOrganizationProductTypeProps {
  disabled: boolean;
  options: Option[];
  name: string;
  label: string;
  value: string;
  valueLabel: string;
  error?: boolean;
  loading: boolean;
  helperText?: string;
  dataTestId?: string;
  fetchOptions: (data: string) => void;
  onChange: (event: ChangeEvent) => void;
}

export const ProductOrganizationProductType = ({
  disabled,
  options,
  value,
  valueLabel,
  error,
  helperText,
  loading,
  dataTestId,
  name,
  label,
  fetchOptions,
  onChange,
}: ProductOrganizationProductTypeProps) => {
  const intl = useIntl();

  const debouncedFetchOptions = useRef(
    debounce(async value => {
      fetchOptions(value);
    }, 300),
  ).current;

  const refValue = useRef(
    value
      ? {
          label: valueLabel,
          value,
        }
      : null,
  );

  useEffect(() => {
    if (refValue.current?.value !== value) {
      refValue.current = value
        ? {
            label: valueLabel,
            value,
          }
        : null;
    }
  }, [value]);

  return (
    <DynamicCombobox
      data-test-id={dataTestId}
      disabled={disabled}
      options={options}
      value={refValue.current}
      error={!!error}
      helperText={helperText}
      name={name}
      label={label}
      onChange={value => {
        onChange({
          target: { value: value?.value ?? null, name },
        });
      }}
      onInputValueChange={value => {
        debouncedFetchOptions(value);
      }}
      onFocus={() => {
        fetchOptions("");
      }}
      loading={loading}
      locale={{
        loadingText: intl.formatMessage(commonMessages.loading),
      }}
    />
  );
};
