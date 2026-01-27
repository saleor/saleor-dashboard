import { AttributeInputTypeEnum } from "@dashboard/graphql";
import { Box, DynamicMultiselect, Option, Text } from "@saleor/macaw-ui-next";
import { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import { messages } from "../messages";
import { AttributeData } from "../types";
import { AttributeHeader } from "./AttributeHeader";
import styles from "./AttributeValueChips.module.css";

interface AttributeValueMultiselectProps {
  attribute: AttributeData;
  selectedIds: Set<string>;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onSetSelected: (valueIds: Set<string>) => void;
}

export const AttributeValueMultiselect = ({
  attribute,
  selectedIds,
  onSelectAll,
  onDeselectAll,
  onSetSelected,
}: AttributeValueMultiselectProps) => {
  const intl = useIntl();
  const isSwatch = attribute.inputType === AttributeInputTypeEnum.SWATCH;

  const options: Option[] = useMemo(
    () =>
      attribute.values.map(v => ({
        value: v.id,
        label: v.name ?? "",
        ...(isSwatch && (v.file?.url || v.value)
          ? {
              startAdornment: (
                <Box
                  as="span"
                  __width="14px"
                  __height="14px"
                  borderRadius={3}
                  __flexShrink={0}
                  style={
                    v.file?.url
                      ? {
                          backgroundImage: `url(${v.file.url})`,
                          backgroundSize: "cover",
                        }
                      : { backgroundColor: v.value ?? undefined }
                  }
                />
              ),
            }
          : {}),
      })),
    [attribute.values, isSwatch],
  );

  const selectedValues: Option[] = useMemo(
    () =>
      attribute.values
        .filter(v => selectedIds.has(v.id))
        .map(v => ({
          value: v.id,
          label: v.name ?? "",
        })),
    [attribute.values, selectedIds],
  );

  const allSelected = selectedIds.size === attribute.values.length;
  const noneSelected = selectedIds.size === 0;

  // Simple: just set the new selection directly
  const handleChange = useCallback(
    (newValues: Option[]) => {
      onSetSelected(new Set(newValues.map(v => v.value)));
    },
    [onSetSelected],
  );

  return (
    <div className={styles.container}>
      <AttributeHeader
        name={attribute.name}
        allSelected={allSelected}
        noneSelected={noneSelected}
        onSelectAll={onSelectAll}
        onDeselectAll={onDeselectAll}
      />
      <Box __maxWidth="100%">
        <DynamicMultiselect
          size="small"
          value={selectedValues}
          options={options}
          onChange={handleChange}
          placeholder={intl.formatMessage(messages.selectValuesPlaceholder)}
        />
        {noneSelected && (
          <Text size={1} color="default2" paddingTop={1}>
            {intl.formatMessage(messages.selectValuesHint, { count: attribute.values.length })}
          </Text>
        )}
      </Box>
    </div>
  );
};
