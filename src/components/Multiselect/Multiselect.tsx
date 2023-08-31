import useDebounce from "@dashboard/hooks/useDebounce";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { DynamicMultiselect, Option } from "@saleor/macaw-ui/next";
import React, { useRef, useState } from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";
import { toValue, toWithCustomValues } from "./utils";

interface MultiselectProps {
  disabled: boolean;
  options: Option[];
  name: string;
  label: string;
  value: Option[];
  error?: boolean;
  loading?: boolean;
  helperText?: string;
  dataTestId?: string;
  fetchOptions: (data: string) => void;
  onChange: (event: ChangeEvent<string[]>) => void;
  onBlur?: () => void;
  allowCustomValues?: boolean;
}

export const Multiselect = ({
  disabled,
  options,
  onChange,
  fetchOptions,
  value,
  allowCustomValues = false,
  ...rest
}: MultiselectProps) => {
  const intl = useIntl();
  const inputValue = useRef("");
  const mounted = useRef(false);

  const [selectedValues, setSelectedValues] = useState(value);

  const debouncedFetchOptions = useRef(
    useDebounce(async (value: string) => {
      fetchOptions(value);
    }, 500),
  ).current;

  const addNewValueLabel = intl.formatMessage(messages.addNewValue, {
    value: inputValue.current,
  });

  const showAddNewValueOption =
    inputValue.current &&
    allowCustomValues &&
    !options.find(
      option => option.label.toLowerCase() === inputValue.current.toLowerCase(),
    );

  const handleOnChange = (values: Option[]) => {
    const hasCustomValue = values.find(value =>
      value.label.includes(addNewValueLabel),
    );
    const valuesWithCustom = values.map(toWithCustomValues(addNewValueLabel));

    onChange({
      target: {
        value: valuesWithCustom.map(toValue),
        name: rest.name,
      },
    });

    setSelectedValues(valuesWithCustom);
    inputValue.current = "";

    if (hasCustomValue) {
      fetchOptions("");
    }
  };

  return (
    <DynamicMultiselect
      options={[
        ...(showAddNewValueOption
          ? [
              {
                label: addNewValueLabel,
                value: inputValue.current,
              },
            ]
          : []),
        ...options,
      ]}
      disabled={disabled}
      onChange={handleOnChange}
      value={selectedValues}
      onInputValueChange={value => {
        inputValue.current = value;
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
