import {
  enrichAttributeComboboxOption,
  enrichAttributeComboboxOptions,
} from "@dashboard/components/AttributeInputTypeIcon/enrichAttributeComboboxOptions";
import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { Box, Button, DynamicCombobox, Select, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { X } from "lucide-react";
import { useMemo } from "react";

import { getItemConstraint } from "./constrains";
import { ConstraintReasonHint } from "./ConstraintReasonHint";
import { type ErrorLookup } from "./errors";
import { type FilterEventEmitter } from "./EventEmitter";
import { getFilterControlId } from "./filterControlId";
import { isFlatFilterLayout } from "./filterLayout";
import { getConstraintReasonLabels } from "./getConstraintReasonLabels";
import { isSelectedComboboxLabel } from "./resolveAsyncComboboxState";
import {
  resolveAttributeComboboxOptions,
  resolveAttributeComboboxValue,
} from "./resolveAttributeComboboxState";
import { RightOperator } from "./RightOperator";
import { type ConditionalFiltersLayout, type ExperimentalFiltersProps } from "./Root";
import styles from "./Row.module.css";
import { getGridTemplateColumns } from "./rowGrid";
import { type LeftOperatorOption, type Row } from "./types";

interface RowProps {
  item: Row;
  index: number;
  rows: ExperimentalFiltersProps["value"];
  leftOptions: ExperimentalFiltersProps["leftOptions"];
  emitter: FilterEventEmitter;
  error: ErrorLookup[number];
  layout?: ConditionalFiltersLayout;
}

export const RowComponent = ({
  item,
  index,
  rows,
  leftOptions,
  emitter,
  error,
  layout = "popover",
}: RowProps): JSX.Element => {
  const constrain = getItemConstraint(item.constraint);
  const reasonLabels = getConstraintReasonLabels(item, rows);
  const isAttribute = item.isAttribute;
  const attributeList = useMemo(
    () =>
      resolveAttributeComboboxOptions(item.availableAttributesList ?? [], item.selectedAttribute),
    [item.availableAttributesList, item.selectedAttribute],
  );
  const attributeOptions = useMemo(
    () => enrichAttributeComboboxOptions(attributeList),
    [attributeList],
  );
  const selectedAttributeValue = useMemo(() => {
    const selected = resolveAttributeComboboxValue(attributeList, item.selectedAttribute);

    return selected ? enrichAttributeComboboxOption(selected) : null;
  }, [attributeList, item.selectedAttribute]);
  const isFlat = isFlatFilterLayout(layout);
  const inlineControlProps = isFlat ? { backgroundColor: "default1" as const } : {};

  return (
    <Box
      className={clsx(styles.row, isFlat && styles.inlineRow)}
      display="grid"
      gap={isFlat ? 2 : 0.5}
      __gridTemplateColumns={getGridTemplateColumns(layout, isAttribute)}
      placeItems="flex-start"
      alignItems="center"
      width="100%"
      __minWidth="0"
    >
      <Box display="flex" alignItems="center" gap={1.5} width="100%" __minWidth="0">
        <ConstraintReasonHint fields={reasonLabels} testId={`constraint-reason-${index}`} />
        <Box flexGrow="1" width="100%" __minWidth="0">
          <DynamicCombobox
            {...inlineControlProps}
            id={getFilterControlId("left", index)}
            data-test-id={`left-${index}`}
            value={item.value}
            options={leftOptions}
            loading={item.loading}
            onChange={value => {
              if (!value) return;

              emitter.changeLeftOperator(
                index,
                value,
                leftOptions.find(option => option.value === value.value)?.type,
              );
            }}
            onInputValueChange={value => {
              emitter.inputChangeLeftOperator(index, value);
            }}
            onFocus={() => {
              emitter.focusLeftOperator(index);
            }}
            onBlur={() => {
              emitter.blurLeftOperator(index);
            }}
            error={error.left.show}
            helperText={error.left.text}
            disabled={constrain.disableLeftOperator}
          />
        </Box>
      </Box>

      {isAttribute && (
        <DynamicCombobox
          {...inlineControlProps}
          id={getFilterControlId("attribute", index)}
          data-test-id={`attribute-value-${index}`}
          value={selectedAttributeValue}
          options={attributeOptions}
          loading={item.attributeLoading}
          onChange={value => {
            if (!value) return;

            emitter.changeAttribute(index, value as LeftOperatorOption);
          }}
          onInputValueChange={value => {
            if (isSelectedComboboxLabel(item.selectedAttribute, value)) {
              return;
            }

            emitter.inputChangeAttribute(index, value);
          }}
          onFocus={() => {
            emitter.focusAttribute(index);
          }}
          onScrollEnd={() => {
            emitter.scrollEndAttribute(index);
          }}
          onBlur={() => {
            emitter.blurAttribute(index);
          }}
        />
      )}

      <Select
        {...inlineControlProps}
        id={getFilterControlId("condition", index)}
        data-test-id={`condition-${index}`}
        value={item.condition.selected.conditionValue}
        options={item.condition.options}
        disabled={constrain.disableCondition}
        onChange={value => {
          emitter.changeCondition(index, value);
        }}
        onFocus={() => {
          emitter.focusCondition(index);
        }}
        onBlur={() => {
          emitter.blurCondition(index);
        }}
        error={error.condition.show}
        helperText={error.condition.text}
      />

      <div className={styles.valueField}>
        <RightOperator
          selected={item.condition?.selected}
          index={index}
          emitter={emitter}
          error={error.right.show}
          helperText={error.right.text}
          disabled={constrain.disableRightOperator}
          layout={layout}
          entityType={item.selectedAttribute?.entityType}
          attributeType={item.selectedAttribute?.type}
          leftType={item.value?.type}
        />
      </div>

      {isFlat ? (
        <button
          className={styles.inlineRemoveButton}
          data-test-id={`remove-row-${index}`}
          disabled={constrain.disableRemoveButton}
          onClick={() => emitter.removeRow(index)}
          type="button"
        >
          <Text size={1}>✕</Text>
        </button>
      ) : (
        <Button
          marginLeft="auto"
          variant="tertiary"
          icon={<X size={iconSize.medium} strokeWidth={iconStrokeWidth} />}
          onClick={() => emitter.removeRow(index)}
          disabled={constrain.disableRemoveButton}
        />
      )}
    </Box>
  );
};
