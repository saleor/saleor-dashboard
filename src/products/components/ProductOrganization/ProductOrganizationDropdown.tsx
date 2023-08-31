import { ChangeEvent } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { DynamicCombobox, Option } from "@saleor/macaw-ui/next";
import debounce from "lodash/debounce";
import React, { useRef, useState } from "react";
import { useIntl } from "react-intl";

interface ProductOrganizationDropdownProps {
  disabled: boolean;
  options: Option[];
  name: string;
  label: string;
  value: string;
  displayValue: string;
  error?: boolean;
  loading: boolean;
  helperText?: string;
  dataTestId?: string;
  fetchOptions: (data: string) => void;
  onChange: (event: ChangeEvent) => void;
}

export const ProductOrganizationDropdown = ({
  disabled,
  options,
  value,
  displayValue,
  error,
  helperText,
  loading,
  dataTestId,
  name,
  label,
  fetchOptions,
  onChange,
}: ProductOrganizationDropdownProps) => {
  const intl = useIntl();
  const mounted = useRef(false);
  const [selectedValue, setSelectedValue] = useState(
    value
      ? {
          label: displayValue,
          value,
        }
      : null,
  );

  const debouncedFetchOptions = useRef(
    debounce(async value => {
      fetchOptions(value);
    }, 300),
  ).current;

  return (
    <DynamicCombobox
      data-test-id={dataTestId}
      disabled={disabled}
      options={options}
      value={selectedValue}
      error={!!error}
      helperText={helperText}
      name={name}
      label={label}
      onChange={value => {
        onChange({
          target: { value: value?.value ?? null, name },
        });
        setSelectedValue(value);
      }}
      onInputValueChange={value => {
        debouncedFetchOptions(value);
      }}
      onFocus={() => {
        if (!mounted.current) {
          mounted.current = true;
          fetchOptions("");
        }
      }}
      loading={loading}
      locale={{
        loadingText: intl.formatMessage(commonMessages.loading),
      }}
    />
  );
};
