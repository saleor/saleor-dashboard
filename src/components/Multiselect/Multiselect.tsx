import useDebounce from "@dashboard/hooks/useDebounce";
import { commonMessages } from "@dashboard/intl";
import {
  DynamicMultiselect,
  DynamicMultiselectProps,
  Option,
} from "@saleor/macaw-ui/next";
import React, { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";
import { toWithCustomValues } from "./utils";

interface MultiselectProps extends DynamicMultiselectProps<Option> {
  fetchOptions: (data: string) => void;
  alwaysFetchOnFocus?: boolean;
  allowCustomValues?: boolean;
}

export const Multiselect = ({
  disabled,
  options,
  onChange,
  fetchOptions,
  value,
  alwaysFetchOnFocus = false,
  allowCustomValues = false,
  ...rest
}: MultiselectProps) => {
  const intl = useIntl();
  const inputValue = useRef("");
  const mounted = useRef(false);

  const [selectedValues, setSelectedValues] = useState(value);

  useEffect(() => {
    setSelectedValues(value);
  }, [value]);

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
        value: valuesWithCustom,
        name: rest.name,
      },
    });

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
        if (alwaysFetchOnFocus || !mounted.current) {
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
