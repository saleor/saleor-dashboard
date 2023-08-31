import useDebounce from "@dashboard/hooks/useDebounce";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { DynamicMultiselect, Option } from "@saleor/macaw-ui/next";
import React, { useRef } from "react";
import { useIntl } from "react-intl";

interface MultiselectProps {
  disabled: boolean;
  options: Option[];
  name: string;
  label: string;
  value: Option[];
  error?: boolean;
  loading: boolean;
  helperText?: string;
  dataTestId?: string;
  fetchOptions: (data: string) => void;
  onChange: (event: ChangeEvent) => void;
}

export const Multiselect = ({
  disabled,
  options,
  onChange,
  fetchOptions,
  ...rest
}: MultiselectProps) => {
  const intl = useIntl();
  const mounted = useRef(false);

  const debouncedFetchOptions = useRef(
    useDebounce(async (value: string) => {
      fetchOptions(value);
    }, 500),
  ).current;

  return (
    <DynamicMultiselect
      options={disabled ? [] : options}
      disabled={disabled}
      onChange={newValue => {
        onChange({
          target: {
            value: newValue,
            name: rest.name,
          },
        });
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
