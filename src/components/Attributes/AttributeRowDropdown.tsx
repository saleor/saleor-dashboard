import {
  AttributeValueFragment,
  PageErrorWithAttributesFragment,
  ProductErrorWithAttributesFragment,
} from "@dashboard/graphql";
import { FormsetChange } from "@dashboard/hooks/useFormset";
import { commonMessages } from "@dashboard/intl";
import { DynamicCombobox } from "@saleor/macaw-ui/next";
import debounce from "lodash/debounce";
import React, { useEffect, useRef } from "react";
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
  allowCustomValue?: boolean;
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
  allowCustomValue = true,
}: AttributeRowDropdownProps) => {
  const intl = useIntl();
  const inputValue = useRef("");
  const value = attribute.value[0];

  const debouncedFetchAttributeValues = useRef(
    debounce(async value => {
      fetchAttributeValues(value, attribute.id);
    }, 300),
  ).current;

  useEffect(() => {
    if (allowCustomValue) {
      if (inputValue.current.length > 0 && attributeValues.length === 0) {
        onChange(attribute.id, inputValue.current);
      }
    }
  }, [attributeValues, allowCustomValue]);

  return (
    <DynamicCombobox
      disabled={disabled}
      options={getSingleChoices(attributeValues)}
      value={
        value
          ? {
              label: getSingleDisplayValue(attribute, attributeValues),
              value,
            }
          : null
      }
      error={!!error}
      helperText={getErrorMessage(error, intl)}
      name={`attribute:${attribute.label}`}
      id={`attribute:${attribute.label}`}
      label={intl.formatMessage(attributeRowMessages.valueLabel)}
      onChange={value => {
        onChange(attribute.id, value?.value ?? null);
      }}
      onInputValueChange={value => {
        inputValue.current = value;
        debouncedFetchAttributeValues(value);
      }}
      onFocus={() => {
        fetchAttributeValues("", attribute.id);
      }}
      onBlur={onBlur}
      loading={loading}
      locale={{
        loadingText: intl.formatMessage(commonMessages.loading),
      }}
    />
  );
};
