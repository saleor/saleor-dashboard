import useDebounce from "@dashboard/hooks/useDebounce";
import { ChangeEvent } from "@dashboard/hooks/useForm";
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

type ComboboxProps = Omit<
  DynamicComboboxProps<Option | null>,
  "value" | "onChange"
> & {
  fetchOptions: (data: string) => void;
  allowCustomValues?: boolean;
  alwaysFetchOnFocus?: boolean;
  fetchMore?: FetchMoreProps;
  value: Option | null;
  onChange: (event: ChangeEvent) => void;
};

export const Combobox = ({
  value,
  fetchOptions,
  onChange,
  options,
  alwaysFetchOnFocus = false,
  allowCustomValues = false,
  fetchMore,
  loading,
  size = "small",
  ...rest
}: ComboboxProps) => {
  const intl = useIntl();
  const inputValue = useRef("");
  const mounted = useRef(false);

  const [selectedValue, setSelectedValue] = useState(value);

  useEffect(() => {
    if (value?.value !== selectedValue?.value) {
      setSelectedValue(value);
    }
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
      target: { value: value?.value ?? null, name: rest.name ?? "" },
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
      options={
        [
          ...(showAddCustomValue
            ? [
                {
                  label: addNewValueLabel,
                  value: inputValue.current,
                },
              ]
            : []),
          ...options,
        ] as Option[]
      }
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
      loading={loading || fetchMore?.hasMore || fetchMore?.loading}
      locale={{
        loadingText: intl.formatMessage(commonMessages.loading),
      }}
      size={size}
      {...rest}
    />
  );
};
