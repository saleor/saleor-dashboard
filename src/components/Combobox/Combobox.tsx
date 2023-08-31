import { ChangeEvent } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { DynamicCombobox, Option } from "@saleor/macaw-ui/next";
import debounce from "lodash/debounce";
import React, { useRef, useState } from "react";
import { useIntl } from "react-intl";

interface ComboboxProps {
  disabled: boolean;
  options: Option[];
  name: string;
  label: string;
  id?: string;
  value: string;
  displayValue: string;
  error?: boolean;
  loading: boolean;
  helperText?: string;
  dataTestId?: string;
  fetchOptions: (data: string) => void;
  onChange: (event: ChangeEvent) => void;
  onBlur?: () => void;
}

export const Combobox = ({
  value,
  displayValue,
  fetchOptions,
  onChange,
  ...rest
}: ComboboxProps) => {
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
      value={selectedValue}
      onChange={value => {
        onChange({
          target: { value: value?.value ?? null, name: rest.name },
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
      locale={{
        loadingText: intl.formatMessage(commonMessages.loading),
      }}
      {...rest}
    />
  );
};
