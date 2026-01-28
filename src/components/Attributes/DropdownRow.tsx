import { commonMessages } from "@dashboard/intl";
import { DynamicCombobox, Option } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { BasicAttributeRow } from "./BasicAttributeRow";
import { AttributeRowProps } from "./types";
import { useAttributeDropdown } from "./useAttributeDropdown";
import { getErrorMessage, getSingleChoices, getSingleDisplayValue } from "./utils";

type DropdownRowProps = Pick<
  AttributeRowProps,
  | "attribute"
  | "attributeValues"
  | "disabled"
  | "error"
  | "onChange"
  | "fetchAttributeValues"
  | "fetchMoreAttributeValues"
  | "onAttributeSelectBlur"
>;

export const DropdownRow: React.FC<DropdownRowProps> = ({
  attribute,
  attributeValues,
  disabled,
  error,
  onChange,
  fetchAttributeValues,
  fetchMoreAttributeValues,
  onAttributeSelectBlur,
}) => {
  const intl = useIntl();
  const options = getSingleChoices(attributeValues);

  const {
    displayOptions,
    handleInputChange,
    handleFocus,
    handleScrollEnd,
    loading,
    setInputValue,
  } = useAttributeDropdown({
    attributeId: attribute.id,
    options,
    fetchAttributeValues,
    fetchMoreAttributeValues,
  });

  const handleChange = (option: Option | null) => {
    onChange(attribute.id, option?.value ?? null);
    setInputValue("");
  };

  const currentValue = attribute.value[0]
    ? {
        value: attribute.value[0],
        label: getSingleDisplayValue(attribute, attributeValues),
      }
    : null;

  return (
    <BasicAttributeRow label={attribute.label}>
      <DynamicCombobox
        disabled={disabled}
        options={displayOptions}
        value={currentValue}
        error={!!error}
        helperText={getErrorMessage(error, intl)}
        name={`attribute:${attribute.label}`}
        id={`attribute:${attribute.label}`}
        label=""
        onChange={handleChange}
        onInputValueChange={handleInputChange}
        onFocus={handleFocus}
        onScrollEnd={handleScrollEnd}
        onBlur={onAttributeSelectBlur}
        loading={loading}
        locale={{
          loadingText: intl.formatMessage(commonMessages.loading),
        }}
        size="small"
      />
    </BasicAttributeRow>
  );
};
