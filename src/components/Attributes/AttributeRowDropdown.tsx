import {
  AttributeValueFragment,
  PageErrorWithAttributesFragment,
  ProductErrorWithAttributesFragment,
} from "@dashboard/graphql";
import { FormsetChange } from "@dashboard/hooks/useFormset";
import { commonMessages } from "@dashboard/intl";
import { DynamicCombobox } from "@saleor/macaw-ui/next";
import debounce from "lodash/debounce";
import React, { useRef, useState } from "react";
import { useIntl } from "react-intl";

import { AttributeInput } from "./Attributes";
import { attributeRowMessages } from "./messages";
import {
  getErrorMessage,
  getSingleChoices,
  getSingleDisplayValue,
} from "./utils";

interface AttributeRowDropdownProps {
  disabled: boolean;
  attributeValues: AttributeValueFragment[];
  attribute: AttributeInput;
  error: ProductErrorWithAttributesFragment | PageErrorWithAttributesFragment;
  loading: boolean;
  onChange: FormsetChange<string | null>;
  fetchAttributeValues: (query: string, attributeId: string) => void;
  onBlur: () => void;
}

export const AttributeRowDropdown = ({
  disabled,
  attributeValues,
  attribute,
  error,
  loading,
  onChange,
  fetchAttributeValues,
  onBlur,
}: AttributeRowDropdownProps) => {
  const intl = useIntl();
  const inputValue = useRef("");
  const mounted = useRef(false);

  const [value, setValue] = useState(
    attribute.value[0]
      ? {
          label: getSingleDisplayValue(attribute, attributeValues),
          value: attribute.value[0],
        }
      : null,
  );

  const addNewValueLabel = intl.formatMessage(attributeRowMessages.addNewValue);
  const showAddNewValueOption =
    inputValue.current && !loading && attribute.value[0] !== inputValue.current;

  const debouncedFetchAttributeValues = useRef(
    debounce(async value => {
      fetchAttributeValues(value, attribute.id);
    }, 500),
  ).current;

  return (
    <DynamicCombobox
      disabled={disabled}
      options={[
        ...(showAddNewValueOption
          ? [
              {
                label: `${addNewValueLabel}: ${inputValue.current}`,
                value: inputValue.current,
              },
            ]
          : []),
        ...getSingleChoices(attributeValues),
      ]}
      value={value}
      error={!!error}
      helperText={getErrorMessage(error, intl)}
      name={`attribute:${attribute.label}`}
      id={`attribute:${attribute.label}`}
      label={intl.formatMessage(attributeRowMessages.valueLabel)}
      onChange={value => {
        onChange(attribute.id, value?.value ?? null);

        if (value?.label.includes(addNewValueLabel)) {
          setValue({ label: value.value, value: value.value });
        } else {
          setValue(value);
        }
      }}
      onInputValueChange={value => {
        inputValue.current = value;
        debouncedFetchAttributeValues(value);
      }}
      onFocus={() => {
        if (!mounted.current) {
          mounted.current = true;
          fetchAttributeValues(inputValue.current, attribute.id);
        }
      }}
      onBlur={onBlur}
      loading={loading}
      locale={{
        loadingText: intl.formatMessage(commonMessages.loading),
      }}
    />
  );
};
