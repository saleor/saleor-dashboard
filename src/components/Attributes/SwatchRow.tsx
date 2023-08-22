// @ts-strict-ignore
import { BasicAttributeRow } from "@dashboard/components/Attributes/BasicAttributeRow";
import {
  getErrorMessage,
  getSingleDisplayValue,
} from "@dashboard/components/Attributes/utils";
import { DynamicCombobox } from "@saleor/macaw-ui/next";
import { debounce } from "lodash-es";
import React from "react";
import { useIntl } from "react-intl";

import { AttributeRowProps } from "./types";

type SwatchRowProps = Pick<
  AttributeRowProps,
  | "attribute"
  | "attributeValues"
  | "disabled"
  | "error"
  | "onChange"
  | "fetchAttributeValues"
  | "fetchMoreAttributeValues"
>;

export const SwatchRow: React.FC<SwatchRowProps> = ({
  attributeValues,
  fetchAttributeValues,
  fetchMoreAttributeValues,
  attribute,
  disabled,
  error,
  onChange,
}) => {
  const intl = useIntl();
  // const value = attribute.data.values.find(getBySlug(attribute.value[0]));

  const debouncedFetchAttributeValues = debounce((inputValue: string) => {
    if (!inputValue) {
      onChange(attribute.id, null);
      fetchAttributeValues("", attribute.id);
      return;
    }

    fetchAttributeValues(inputValue, attribute.id);
  }, 600);

  return (
    <BasicAttributeRow
      label={attribute.label}
      id={`attribute:${attribute.label}`}
    >
      <DynamicCombobox
        disabled={disabled}
        options={attributeValues.map(({ file, value, slug, name }) => ({
          label: name,
          value: slug,
        }))}
        value={
          attribute.value[0]
            ? {
                label: getSingleDisplayValue(attribute, attributeValues),
                value: attribute.value[0],
              }
            : null
        }
        error={!!error}
        helperText={getErrorMessage(error, intl)}
        name={`attribute:${attribute.label}`}
        id={`attribute:${attribute.label}`}
        label={"Swatch"}
        onChange={value => onChange(attribute.id, value.value)}
        onInputValueChange={debouncedFetchAttributeValues}
        onFocus={() => {
          fetchAttributeValues("", attribute.id);
        }}
        loading={fetchMoreAttributeValues.loading}
        locale={{
          loadingText: "Loading...",
        }}
      />
    </BasicAttributeRow>
  );
};
