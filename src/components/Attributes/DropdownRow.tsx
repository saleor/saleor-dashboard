import { BasicAttributeRow } from "@dashboard/components/Attributes/BasicAttributeRow";
import {
  getAttributeRowLabelProps,
  getErrorMessage,
  getSingleDisplayValue,
} from "@dashboard/components/Attributes/utils";
import { isAddNewValueOption } from "@dashboard/components/Combobox/utils";
import {
  type AttributeValueFragment,
  type PageErrorWithAttributesFragment,
  type ProductErrorWithAttributesFragment,
} from "@dashboard/graphql";
import { DynamicCombobox, type Option } from "@saleor/macaw-ui-next";
import { useMemo, useState } from "react";
import { defineMessages, useIntl } from "react-intl";

import { type AttributeInput } from "./Attributes";
import { type AttributeRowHandlers } from "./types";
import { useAttributeDropdown } from "./useAttributeDropdown";

const messages = defineMessages({
  searchValues: {
    id: "mQib3Y",
    defaultMessage: "Search values",
    description: "placeholder for attribute dropdown combobox",
  },
});

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

const toOptions = (values: Array<Pick<AttributeValueFragment, "name" | "slug">>): Option[] =>
  values
    .filter((value): value is typeof value & { slug: string } => value.slug !== null)
    .map(value => ({
      value: value.slug,
      label: value.name ?? value.slug,
    }));

const mergeOptions = (seed: Option[], remote: Option[]): Option[] => {
  const byValue = new Map<string, Option>();

  seed.forEach(option => byValue.set(option.value, option));
  remote.forEach(option => byValue.set(option.value, option));

  return Array.from(byValue.values());
};

const filterOptions = (options: Option[], query: string): Option[] => {
  const normalized = query.trim().toLocaleLowerCase();

  if (!normalized) {
    return options;
  }

  return options.filter(option => option.label.toLocaleLowerCase().includes(normalized));
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
}: DropdownRowProps): JSX.Element => {
  const intl = useIntl();
  const fieldId = `attribute:${attribute.label}`;
  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState<Option | null>(
    attribute.value[0]
      ? {
          value: attribute.value[0],
          label: getSingleDisplayValue(attribute, attributeValues),
        }
      : null,
  );

  const {
    customValueOption,
    customValueLabel,
    handleFetchMore,
    handleInputChange,
    handleFocus,
    transformCustomValue,
  } = useAttributeDropdown({
    inputValue,
    selectedValue,
    fetchOptions: query => fetchAttributeValues(query, attribute.id),
    fetchMore: fetchMoreAttributeValues,
  });

  const options = useMemo(() => {
    const merged = mergeOptions(toOptions(attribute.data.values), toOptions(attributeValues));

    return filterOptions(merged, inputValue);
  }, [attribute.data.values, attributeValues, inputValue]);

  const handleOnChange = (option: Option | null) => {
    if (!option) {
      setSelectedValue(null);
      onChange(attribute.id, "");

      return;
    }

    const transformedOption = transformCustomValue(option);

    setSelectedValue(transformedOption);
    onChange(attribute.id, transformedOption.value);

    if (isAddNewValueOption(option, customValueLabel)) {
      setInputValue("");
    }
  };

  return (
    <BasicAttributeRow
      id={fieldId}
      label={attribute.label}
      {...getAttributeRowLabelProps(attribute)}
    >
      <DynamicCombobox
        size="small"
        disabled={disabled}
        options={[...customValueOption, ...options]}
        value={selectedValue}
        error={!!error}
        helperText={getErrorMessage(error, intl)}
        name={fieldId}
        id={fieldId}
        label=""
        placeholder={intl.formatMessage(messages.searchValues)}
        onChange={handleOnChange}
        onInputValueChange={value => {
          setInputValue(value);
          handleInputChange(value);
        }}
        onFocus={handleFocus}
        onBlur={onAttributeSelectBlur}
        onScrollEnd={handleFetchMore}
        loading={!!fetchMoreAttributeValues?.loading}
      />
    </BasicAttributeRow>
  );
};
