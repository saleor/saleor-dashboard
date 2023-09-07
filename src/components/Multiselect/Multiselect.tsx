import useDebounce from "@dashboard/hooks/useDebounce";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { FetchMoreProps } from "@dashboard/types";
import {
  DynamicMultiselect,
  DynamicMultiselectProps,
  Option,
} from "@saleor/macaw-ui/next";
import React, { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";
import { toWithCustomValues } from "./utils";

type MultiselectProps = Omit<DynamicMultiselectProps<Option>, "onChange"> & {
  options: Option[];
  fetchOptions: (data: string) => void;
  alwaysFetchOnFocus?: boolean;
  allowCustomValues?: boolean;
  fetchMore?: FetchMoreProps;
  onChange: (event: ChangeEvent) => void;
};

export const Multiselect = ({
  disabled,
  options,
  onChange,
  fetchOptions,
  value,
  alwaysFetchOnFocus = false,
  allowCustomValues = false,
  loading,
  fetchMore,
  size = "small",
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

  const handleFetchMore = () => {
    if (fetchMore?.hasMore) {
      fetchMore?.onFetchMore();
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
      onScrollEnd={handleFetchMore}
      loading={loading || fetchMore?.hasMore || fetchMore?.loading}
      locale={{
        loadingText: intl.formatMessage(commonMessages.loading),
      }}
      size={size}
      {...rest}
    />
  );
};
