import useDebounce from "@dashboard/hooks/useDebounce";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { DynamicCombobox, Option } from "@saleor/macaw-ui/next";
import React, { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";

import { messages } from "../Multiselect/messages";

interface ComboboxProps {
  disabled: boolean;
  options: Option[];
  name: string;
  label: string;
  id?: string;
  value: string;
  displayValue: string;
  error?: boolean;
  loading?: boolean;
  helperText?: string;
  dataTestId?: string;
  fetchOptions: (data: string) => void;
  onChange: (event: ChangeEvent<string | null>) => void;
  onBlur?: () => void;
  allowCustomValues?: boolean;
  alwaysFetchOnFocus?: boolean;
}

export const Combobox = ({
  value,
  displayValue,
  fetchOptions,
  onChange,
  options,
  alwaysFetchOnFocus = false,
  allowCustomValues = false,
  ...rest
}: ComboboxProps) => {
  const intl = useIntl();
  const inputValue = useRef("");
  const mounted = useRef(false);

  const [selectedValue, setSelectedValue] = useState(
    value
      ? {
          label: displayValue,
          value,
        }
      : null,
  );

  useEffect(() => {
    setSelectedValue(
      value
        ? {
            label: displayValue,
            value,
          }
        : null,
    );
  }, [value]);

  const addNewValueLabel = intl.formatMessage(messages.addNewValue, {
    value: inputValue.current,
  });

  const showAddCustomValue =
    inputValue.current &&
    allowCustomValues &&
    selectedValue?.label.toLocaleLowerCase() !==
      inputValue.current.toLocaleLowerCase();

  const debouncedFetchOptions = useRef(
    useDebounce(async (value: string) => {
      fetchOptions(value);
    }, 500),
  ).current;

  const handleOnChange = (value: Option | null) => {
    onChange({
      target: { value: value?.value ?? null, name: rest.name },
    });
  };

  return (
    <DynamicCombobox
      value={selectedValue}
      options={[
        ...(showAddCustomValue
          ? [
              {
                label: addNewValueLabel,
                value: inputValue.current,
              },
            ]
          : []),
        ...options,
      ]}
      onChange={handleOnChange}
      onInputValueChange={value => {
        inputValue.current = value;
        debouncedFetchOptions(value);
      }}
      onFocus={() => {
        if (alwaysFetchOnFocus || !mounted.current) {
          mounted.current = true;
          fetchOptions("");
        }
      }}
      size="small"
      locale={{
        loadingText: intl.formatMessage(commonMessages.loading),
      }}
      {...rest}
    />
  );
};
