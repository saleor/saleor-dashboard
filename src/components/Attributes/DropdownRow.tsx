import { BasicAttributeRow } from "@dashboard/components/Attributes/BasicAttributeRow";
import { getErrorMessage, getSingleDisplayValue } from "@dashboard/components/Attributes/utils";
import {
  AttributeValueFragment,
  PageErrorWithAttributesFragment,
  ProductErrorWithAttributesFragment,
} from "@dashboard/graphql";
import { DynamicCombobox, Option } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { useIntl } from "react-intl";

import { AttributeInput } from "./Attributes";
import { AttributeRowHandlers } from "./types";
import { useAttributeDropdown } from "./useAttributeDropdown";

type DropdownRowProps = Pick<
  AttributeRowHandlers,
  "onChange" | "fetchAttributeValues" | "fetchMoreAttributeValues"
> & {
  attribute: AttributeInput;
  attributeValues: AttributeValueFragment[];
  disabled: boolean;
  error: ProductErrorWithAttributesFragment | PageErrorWithAttributesFragment;
  onAttributeSelectBlur?: () => void;
};

export const DropdownRow = ({
  attribute,
  attributeValues,
  disabled,
  error,
  onChange,
  fetchAttributeValues,
  fetchMoreAttributeValues,
  onAttributeSelectBlur,
}: DropdownRowProps) => {
  const intl = useIntl();
  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState<Option | null>(
    attribute.value[0]
      ? {
          value: attribute.value[0],
          label: getSingleDisplayValue(attribute, attributeValues),
        }
      : null,
  );

  const { customValueOption, customValueLabel, handleFetchMore, handleInputChange, handleFocus } =
    useAttributeDropdown({
      inputValue,
      selectedValue,
      fetchOptions: query => fetchAttributeValues(query, attribute.id),
      fetchMore: fetchMoreAttributeValues,
    });

  const options: Option[] = attributeValues
    .filter(value => value.slug !== null)
    .map(value => ({
      value: value.slug as string,
      label: value.name ?? value.slug ?? "",
    }));

  const handleOnChange = (option: Option | null) => {
    if (!option) {
      setSelectedValue(null);
      onChange(attribute.id, "");

      return;
    }

    const isCustomValue = option.label.includes(customValueLabel);

    if (isCustomValue) {
      const newOption = { label: option.value, value: option.value };

      setSelectedValue(newOption);
      onChange(attribute.id, option.value);
      setInputValue("");
    } else {
      setSelectedValue(option);
      onChange(attribute.id, option.value);
    }
  };

  return (
    <BasicAttributeRow label={attribute.label}>
      <DynamicCombobox
        size="small"
        disabled={disabled}
        options={[...customValueOption, ...options]}
        value={selectedValue}
        error={!!error}
        helperText={getErrorMessage(error, intl)}
        name={`attribute:${attribute.label}`}
        id={`attribute:${attribute.label}`}
        label=""
        onChange={handleOnChange}
        onInputValueChange={value => {
          setInputValue(value);
          handleInputChange(value);
        }}
        onFocus={handleFocus}
        onBlur={onAttributeSelectBlur}
        onScrollEnd={handleFetchMore}
        loading={fetchMoreAttributeValues?.hasMore || fetchMoreAttributeValues?.loading}
      />
    </BasicAttributeRow>
  );
};
