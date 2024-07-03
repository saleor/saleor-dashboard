import { ChangeEvent } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { FetchMoreProps } from "@dashboard/types";
import { DynamicCombobox, DynamicComboboxProps, Option } from "@saleor/macaw-ui-next";
import React, { ReactNode, useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { useCombbobxCustomOption } from "../hooks/useCombbobxCustomOption";
import { useComboboxEmptyOption } from "../hooks/useComboboxEmptyOption";
import { useComboboxHandlers } from "../hooks/useComboboxHandlers";

type HandleOnChangeValue = Option | null;

type ComboboxProps = Omit<DynamicComboboxProps<Option | null>, "value" | "onChange"> & {
  children?: ReactNode;
  fetchOptions: (data: string) => void;
  allowCustomValues?: boolean;
  alwaysFetchOnFocus?: boolean;
  allowEmptyValue?: boolean;
  fetchMore?: FetchMoreProps;
  value: Option | null;
  onChange: (event: ChangeEvent) => void;
};

const ComboboxRoot = ({
  value,
  fetchOptions,
  onChange,
  options,
  alwaysFetchOnFocus = false,
  allowCustomValues = false,
  allowEmptyValue = false,
  fetchMore,
  loading,
  children,
  size = "small",
  ...rest
}: ComboboxProps) => {
  const intl = useIntl();
  const [selectedValue, setSelectedValue] = useState(value);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (value?.value !== selectedValue?.value) {
      setSelectedValue(value);
    }
  }, [value]);

  const { handleFetchMore, handleFocus, handleInputChange } = useComboboxHandlers({
    fetchOptions,
    alwaysFetchOnFocus,
    fetchMore,
  });
  const { customValueOption } = useCombbobxCustomOption({
    query: inputValue,
    allowCustomValues,
    selectedValue,
  });

  const { emptyOption } = useComboboxEmptyOption();

  const handleOnChange = (value: HandleOnChangeValue) => {
    onChange({
      target: { value: value?.value ?? null, name: rest.name ?? "" },
    });
  };

  return (
    <DynamicCombobox
      value={selectedValue}
      options={
        [...(allowEmptyValue ? [emptyOption] : []), ...customValueOption, ...options] as Option[]
      }
      onChange={handleOnChange}
      onScrollEnd={handleFetchMore}
      onInputValueChange={value => {
        setInputValue(value);
        handleInputChange(value);
      }}
      onFocus={handleFocus}
      loading={loading || fetchMore?.hasMore || fetchMore?.loading}
      locale={{
        loadingText: intl.formatMessage(commonMessages.loading),
      }}
      size={size}
      {...rest}
    >
      {children}
    </DynamicCombobox>
  );
};

export const Combobox = Object.assign(ComboboxRoot, {
  NoOptions: DynamicCombobox.NoOptions,
});
