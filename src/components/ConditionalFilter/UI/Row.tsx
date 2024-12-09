import { Box, Button, DynamicCombobox, RemoveIcon, Select } from "@saleor/macaw-ui-next";

import { getItemConstraint } from "./constrains";
import { ErrorLookup } from "./errors";
import { FilterEventEmitter } from "./EventEmitter";
import { RightOperator } from "./RightOperator";
import { ExperimentalFiltersProps } from "./Root";
import { Row } from "./types";

interface RowProps {
  item: Row;
  index: number;
  leftOptions: ExperimentalFiltersProps["leftOptions"];
  emitter: FilterEventEmitter;
  error: ErrorLookup[number];
}

export const RowComponent = ({ item, index, leftOptions, emitter, error }: RowProps) => {
  const constrain = getItemConstraint(item.constraint);

  return (
    <Box
      display="grid"
      gap={0.5}
      __gridTemplateColumns="200px 120px 200px auto"
      placeItems="center"
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
        variant="tertiary"
        icon={<RemoveIcon />}
        onClick={() => emitter.removeRow(index)}
        disabled={constrain.disableRemoveButton}
      />
    </Box>
  );
};
