import useDebounce from "@dashboard/hooks/useDebounce";
import { commonMessages } from "@dashboard/intl";
import { FetchMoreProps } from "@dashboard/types";
import {
  DynamicCombobox,
  DynamicComboboxProps,
  Option,
} from "@saleor/macaw-ui/next";
import React, { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";

import { messages } from "../Multiselect/messages";

interface ComboboxProps extends DynamicComboboxProps<Option | null> {
  value: string;
  displayValue: string;
  fetchOptions: (data: string) => void;
  allowCustomValues?: boolean;
  alwaysFetchOnFocus?: boolean;
  fetchMore?: FetchMoreProps;
}

export const Combobox = ({
  value,
  displayValue,
  fetchOptions,
  onChange,
  options,
  alwaysFetchOnFocus = false,
  allowCustomValues = false,
  fetchMore,
  loading,
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

  const handleFetchMore = () => {
    if (fetchMore?.hasMore) {
      fetchMore?.onFetchMore();
    }
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
      onScrollEnd={handleFetchMore}
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
      loading={loading || fetchMore?.loading}
      locale={{
        loadingText: intl.formatMessage(commonMessages.loading),
      }}
      {...rest}
    />
  );
};
