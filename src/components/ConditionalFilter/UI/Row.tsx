import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { Box, Button, DynamicCombobox, Select } from "@saleor/macaw-ui-next";
import { X } from "lucide-react";

import { getItemConstraint } from "./constrains";
import { ErrorLookup } from "./errors";
import { FilterEventEmitter } from "./EventEmitter";
import { RightOperator } from "./RightOperator";
import { ExperimentalFiltersProps } from "./Root";
import { LeftOperatorOption, Row } from "./types";

interface RowProps {
  item: Row;
  index: number;
  leftOptions: ExperimentalFiltersProps["leftOptions"];
  emitter: FilterEventEmitter;
  error: ErrorLookup[number];
}

export const RowComponent = ({ item, index, leftOptions, emitter, error }: RowProps) => {
  const constrain = getItemConstraint(item.constraint);
  const isAttribute = item.isAttribute;

  return (
    <Box
      display="grid"
      gap={0.5}
      __gridTemplateColumns={isAttribute ? "200px 200px 120px 200px 1fr" : "200px 120px 200px 1fr"}
      placeItems="flex-start"
      alignItems="center"
    >
      <DynamicCombobox
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

      {isAttribute && (
        <DynamicCombobox
          data-test-id={`attribute-value-${index}`}
          value={item.selectedAttribute ?? null}
          options={item.availableAttributesList ?? []}
          loading={item.attributeLoading}
          onChange={value => {
            if (!value) return;

            emitter.changeAttribute(index, value as LeftOperatorOption);
          }}
          onInputValueChange={value => {
            emitter.inputChangeAttribute(index, value);
          }}
          onFocus={() => {
            emitter.focusAttribute(index);
          }}
          onBlur={() => {
            emitter.blurAttribute(index);
          }}
        />
      )}

      <Select
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

      <RightOperator
        selected={item.condition?.selected}
        index={index}
        emitter={emitter}
        error={error.right.show}
        helperText={error.right.text}
        disabled={constrain.disableRightOperator}
      />

      <Button
        marginLeft="auto"
        variant="tertiary"
        icon={<X size={iconSize.medium} strokeWidth={iconStrokeWidth} />}
        onClick={() => emitter.removeRow(index)}
        disabled={constrain.disableRemoveButton}
      />
    </Box>
  );
};
