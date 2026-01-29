import { getBooleanDropdownOptions } from "@dashboard/components/Attributes/utils";
import { AttributeInputTypeEnum, VariantAttributeFragment } from "@dashboard/graphql";
import { Box, DynamicCombobox, Input, Option, Select, Text } from "@saleor/macaw-ui-next";
import { ReactNode, useMemo, useState } from "react";
import { useIntl } from "react-intl";

import { messages } from "../messages";
import styles from "../ProductVariantGenerator.module.css";
import { AttributeError, NonSelectionAttributeValues } from "../types";

interface RequiredAttributesSectionProps {
  attributes: VariantAttributeFragment[];
  values: NonSelectionAttributeValues;
  errors: AttributeError[];
  onChange: (attributeId: string, values: string[]) => void;
  onAttributeValuesSearch: (attributeId: string, query: string) => Promise<Option[]>;
}

interface AttributeInputProps {
  attribute: VariantAttributeFragment;
  value: string[];
  onChange: (values: string[]) => void;
  onSearch: (query: string) => Promise<Option[]>;
}

const AttributeInput = ({
  attribute,
  value,
  onChange,
  onSearch,
}: AttributeInputProps): ReactNode => {
  const intl = useIntl();
  const inputType = attribute.inputType;
  const [searchedOptions, setSearchedOptions] = useState<Option[]>([]);

  // Memoize choices extraction
  const choices = useMemo(
    () => attribute.choices?.edges?.map(e => e.node) ?? [],
    [attribute.choices],
  );

  // Memoize initial options for DROPDOWN/SWATCH
  const initialOptions = useMemo<Option[]>(
    () =>
      choices.map(choice => ({
        value: choice.slug ?? choice.id,
        label: choice.name ?? choice.slug ?? choice.id,
      })),
    [choices],
  );

  // Memoize display value computation
  const displayValue = useMemo(() => {
    if (!value[0]) return null;

    // First check in initial choices
    const choice = choices.find(c => c.slug === value[0]);

    if (choice) {
      return { label: choice.name ?? choice.slug ?? "", value: choice.slug ?? "" };
    }

    // Then check in searched options
    const searchedOption = searchedOptions.find(o => o.value === value[0]);

    if (searchedOption) {
      return { label: String(searchedOption.label), value: String(searchedOption.value) };
    }

    return { label: value[0], value: value[0] };
  }, [value, choices, searchedOptions]);

  // Memoize boolean options (filtered to exclude "unset" for required attributes)
  const booleanOptions = useMemo(
    () => getBooleanDropdownOptions(intl).filter(opt => opt.value !== "unset"),
    [intl],
  );

  // DROPDOWN and SWATCH - use DynamicCombobox with search
  if (
    inputType === AttributeInputTypeEnum.DROPDOWN ||
    inputType === AttributeInputTypeEnum.SWATCH
  ) {
    return (
      <DynamicCombobox
        size="small"
        value={displayValue}
        options={searchedOptions.length > 0 ? searchedOptions : initialOptions}
        onChange={option => onChange(option?.value ? [String(option.value)] : [])}
        onInputValueChange={async query => {
          if (query) {
            const results = await onSearch(query);

            setSearchedOptions(results);
          } else {
            setSearchedOptions([]);
          }
        }}
        onFocus={async () => {
          // Load initial options on focus
          const results = await onSearch("");

          setSearchedOptions(results);
        }}
      />
    );
  }

  // BOOLEAN - True/False only (no "Unset" for required attributes)
  // The API rejects null for required Boolean attributes
  if (inputType === AttributeInputTypeEnum.BOOLEAN) {
    return (
      <Select
        size="small"
        value={value[0] ?? ""}
        onChange={v => onChange(v ? [String(v)] : [])}
        options={booleanOptions}
        placeholder={intl.formatMessage(messages.selectValue)}
      />
    );
  }

  // PLAIN_TEXT - text input
  if (inputType === AttributeInputTypeEnum.PLAIN_TEXT) {
    return (
      <Input
        size="small"
        type="text"
        value={value[0] ?? ""}
        onChange={e => onChange(e.target.value ? [e.target.value] : [])}
      />
    );
  }

  // NUMERIC - number input
  if (inputType === AttributeInputTypeEnum.NUMERIC) {
    return (
      <Input
        size="small"
        type="number"
        value={value[0] ?? ""}
        onChange={e => onChange(e.target.value ? [e.target.value] : [])}
      />
    );
  }

  // DATE - date input
  if (inputType === AttributeInputTypeEnum.DATE) {
    return (
      <Input
        size="small"
        type="date"
        value={value[0] ?? ""}
        onChange={e => onChange(e.target.value ? [e.target.value] : [])}
      />
    );
  }

  // DATE_TIME - datetime-local input
  if (inputType === AttributeInputTypeEnum.DATE_TIME) {
    return (
      <Input
        size="small"
        type="datetime-local"
        value={value[0] ?? ""}
        onChange={e => onChange(e.target.value ? [e.target.value] : [])}
      />
    );
  }

  return null;
};

export const RequiredAttributesSection = ({
  attributes,
  values,
  errors,
  onChange,
  onAttributeValuesSearch,
}: RequiredAttributesSectionProps): ReactNode => {
  const intl = useIntl();

  // Create a map of attribute ID to error for quick lookup
  const errorsByAttribute = useMemo(() => {
    const map = new Map<string, AttributeError>();

    errors.forEach(error => {
      if (!map.has(error.attributeId)) {
        map.set(error.attributeId, error);
      }
    });

    return map;
  }, [errors]);

  if (attributes.length === 0) {
    return null;
  }

  return (
    <div className={styles.requiredAttributesSectionWrapper}>
      <Box
        className={styles.requiredAttributesSection}
        borderStyle="solid"
        borderColor="default1"
        borderWidth={1}
        borderRadius={4}
      >
        <Box display="flex" flexDirection="column" gap={1}>
          <Text size={2} fontWeight="medium" color="default1">
            {intl.formatMessage(messages.requiredAttributesTitle)}
          </Text>
          <Text size={2} color="default2">
            {intl.formatMessage(messages.requiredAttributesDescription)}
          </Text>
        </Box>

        <Box display="flex" flexDirection="column" gap={3}>
          {attributes.map(attr => {
            const error = errorsByAttribute.get(attr.id);

            return (
              <Box key={attr.id} display="flex" flexDirection="column" gap={1}>
                <Text size={2} color="default1">
                  {attr.name}
                  <Text as="span" color="critical1">
                    {" "}
                    *
                  </Text>
                </Text>
                <AttributeInput
                  attribute={attr}
                  value={values[attr.id] ?? []}
                  onChange={newValues => onChange(attr.id, newValues)}
                  onSearch={query => onAttributeValuesSearch(attr.id, query)}
                />
                {error && (
                  <Text size={1} color="critical1">
                    {error.message || intl.formatMessage(messages.missingRequiredAttributes)}
                  </Text>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    </div>
  );
};
