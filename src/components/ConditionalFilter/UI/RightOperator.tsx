import {
  DynamicCombobox,
  DynamicMultiselect,
  Input,
  RangeInput,
  Select,
} from "@saleor/macaw-ui-next";
import React from "react";

import { FilterEventEmitter } from "./EventEmitter";
import {
  isCombobox,
  isDate,
  isDateRange,
  isDateTime,
  isDateTimeRange,
  isMultiselect,
  isNumberInput,
  isNumberRange,
  isSelect,
  isTextInput,
} from "./operators";
import { RangeInputWrapper } from "./RangeInputWrapper";
import { SelectedOperator } from "./types";

interface RightOperatorProps {
  index: number;
  selected: SelectedOperator;
  emitter: FilterEventEmitter;
  error: boolean;
  helperText: string;
  disabled: boolean;
}

export const RightOperator = ({
  index,
  selected,
  emitter,
  error,
  disabled,
  helperText,
}: RightOperatorProps) => {
  if (isTextInput(selected)) {
    return (
      <Input
        data-test-id={`right-${index}`}
        value={typeof selected.value === "object" ? selected.value.value : selected.value}
        onChange={e => {
          emitter.changeRightOperator(index, e.target.value);
        }}
        onFocus={() => {
          emitter.focusRightOperator(index);
        }}
        onBlur={() => {
          emitter.blurRightOperator(index);
        }}
        error={error}
        helperText={helperText}
        disabled={disabled}
      />
    );
  }

  if (isNumberInput(selected)) {
    return (
      <Input
        data-test-id={`right-${index}`}
        type="number"
        value={typeof selected.value === "object" ? selected.value.value : selected.value}
        onChange={e => {
          emitter.changeRightOperator(index, e.target.value);
        }}
        onFocus={() => {
          emitter.focusRightOperator(index);
        }}
        onBlur={() => {
          emitter.blurRightOperator(index);
        }}
        error={error}
        helperText={helperText}
        disabled={disabled}
      />
    );
  }

  if (isMultiselect(selected)) {
    return (
      <DynamicMultiselect
        data-test-id={`right-${index}`}
        value={selected.value}
        options={selected.options ?? []}
        loading={selected.loading}
        onChange={value => emitter.changeRightOperator(index, value)}
        onInputValueChange={value => {
          emitter.inputChangeRightOperator(index, value);
        }}
        onFocus={() => {
          emitter.focusRightOperator(index);
        }}
        onBlur={() => {
          emitter.blurRightOperator(index);
        }}
        error={error}
        helperText={helperText}
        disabled={disabled}
      />
    );
  }

  if (isCombobox(selected)) {
    return (
      <DynamicCombobox
        data-test-id={`right-${index}`}
        value={selected.value}
        options={selected.options ?? []}
        loading={selected.loading}
        onChange={value => {
          if (!value) return;

          emitter.changeRightOperator(index, value);
        }}
        onInputValueChange={value => emitter.inputChangeRightOperator(index, value)}
        onFocus={() => {
          emitter.focusRightOperator(index);
        }}
        onBlur={() => {
          emitter.blurRightOperator(index);
        }}
        error={error}
        helperText={helperText}
        disabled={disabled}
      />
    );
  }

  if (isSelect(selected)) {
    return (
      <Select
        data-test-id={`right-${index}`}
        value={selected.value}
        options={selected.options ?? []}
        onChange={value => emitter.changeRightOperator(index, value)}
        onFocus={() => {
          emitter.focusRightOperator(index);
        }}
        onBlur={() => {
          emitter.blurRightOperator(index);
        }}
        error={error}
        helperText={helperText}
        disabled={disabled}
      />
    );
  }

  if (isNumberRange(selected)) {
    return (
      <RangeInputWrapper>
        <RangeInput
          data-test-id={`right-${index}`}
          value={selected.value}
          onChange={value => {
            emitter.changeRightOperator(index, value);
          }}
          type="number"
          error={!!error}
          helperText={helperText}
          disabled={disabled}
          width="100%"
        />
      </RangeInputWrapper>
    );
  }

  if (isDate(selected)) {
    return (
      <Input
        data-test-id={`right-${index}`}
        type="date"
        value={selected.value}
        onChange={e => {
          emitter.changeRightOperator(index, e.target.value);
        }}
        error={error}
        helperText={helperText}
        disabled={disabled}
      />
    );
  }

  if (isDateTime(selected)) {
    return (
      <Input
        data-test-id={`right-${index}`}
        type="datetime-local"
        value={selected.value}
        onChange={e => {
          emitter.changeRightOperator(index, e.target.value);
        }}
        error={error}
        helperText={helperText}
        disabled={disabled}
      />
    );
  }

  if (isDateRange(selected)) {
    return (
      <RangeInputWrapper>
        <RangeInput
          data-test-id={`right-${index}`}
          value={selected.value}
          onChange={value => {
            emitter.changeRightOperator(index, value);
          }}
          type="date"
          error={!!error}
          helperText={helperText}
          disabled={disabled}
          width="100%"
        />
      </RangeInputWrapper>
    );
  }

  if (isDateTimeRange(selected)) {
    return (
      <RangeInputWrapper>
        <RangeInput
          data-test-id={`right-${index}`}
          value={selected.value}
          onChange={value => {
            emitter.changeRightOperator(index, value);
          }}
          type="datetime-local"
          error={!!error}
          helperText={helperText}
          disabled={disabled}
          width="100%"
        />
      </RangeInputWrapper>
    );
  }

  return <Input disabled value={selected.value} data-test-id={`right-${index}`} />;
};
