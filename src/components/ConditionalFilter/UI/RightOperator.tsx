import {
  DynamicCombobox,
  DynamicMultiselect,
  Input,
  RangeInput,
  Select,
} from "@saleor/macaw-ui-next";

import {
  isProductReferenceEntity,
  isVariantReferenceEntity,
  isVariantReferenceOption,
} from "../API/variantReferenceOption";
import BulkSelect from "./BulkSelect";
import { type FilterEventEmitter } from "./EventEmitter";
import { getFilterControlId } from "./filterControlId";
import { isFlatFilterLayout } from "./filterLayout";
import { MetadataInput } from "./MetadataInput";
import {
  isBulkSelect,
  isCombobox,
  isDate,
  isDateRange,
  isDateTime,
  isDateTimeRange,
  isDoubleText,
  isMultiselect,
  isNumberInput,
  isNumberRange,
  isSelect,
  isTextInput,
} from "./operators";
import { ProductReferenceMultiselect } from "./ProductReferenceMultiselect";
import { RangeInputWrapper } from "./RangeInputWrapper";
import {
  includeSelectedComboboxOptions,
  isSelectedComboboxLabel,
  isSelectedMultiselectLabel,
  resolveComboboxValue,
} from "./resolveAsyncComboboxState";
import { type ConditionalFiltersLayout } from "./Root";
import { type SelectedOperator } from "./types";
import { VariantReferenceMultiselect } from "./VariantReferenceMultiselect";

interface RightOperatorProps {
  index: number;
  selected: SelectedOperator;
  emitter: FilterEventEmitter;
  error: boolean;
  helperText: string;
  disabled: boolean;
  layout?: ConditionalFiltersLayout;
  entityType?: string | null;
}

const getInlineControlProps = (layout: ConditionalFiltersLayout | undefined) => ({
  width: "100%" as const,
  ...(isFlatFilterLayout(layout) ? { backgroundColor: "default1" as const } : {}),
});

export const RightOperator = ({
  index,
  selected,
  emitter,
  error,
  disabled,
  helperText,
  layout = "popover",
  entityType,
}: RightOperatorProps) => {
  const inlineControlProps = getInlineControlProps(layout);

  if (isTextInput(selected)) {
    return (
      <Input
        {...inlineControlProps}
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
        {...inlineControlProps}
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

  if (isBulkSelect(selected)) {
    return (
      <BulkSelect
        selected={selected}
        error={error}
        helperText={helperText}
        disabled={disabled}
        dataTestId={`right-${index}`}
        onFocus={() => emitter.focusRightOperator(index)}
        onBlur={() => emitter.blurRightOperator(index)}
        onOptionsChange={options => emitter.changeRightOperator(index, options)}
      />
    );
  }

  if (isMultiselect(selected)) {
    const isVariantReference =
      isVariantReferenceEntity(entityType) ||
      selected.options.some(isVariantReferenceOption) ||
      selected.value.some(isVariantReferenceOption);

    if (isVariantReference) {
      return (
        <VariantReferenceMultiselect
          index={index}
          selected={selected}
          emitter={emitter}
          error={error}
          helperText={helperText}
          disabled={disabled}
          layout={layout}
        />
      );
    }

    if (isProductReferenceEntity(entityType)) {
      return (
        <ProductReferenceMultiselect
          index={index}
          selected={selected}
          emitter={emitter}
          error={error}
          helperText={helperText}
          disabled={disabled}
          layout={layout}
        />
      );
    }

    const options = includeSelectedComboboxOptions(selected.options ?? [], selected.value);

    return (
      <DynamicMultiselect
        {...inlineControlProps}
        id={getFilterControlId("right", index)}
        data-test-id={`right-${index}`}
        value={selected.value}
        options={options}
        loading={selected.loading}
        onChange={value => {
          emitter.changeRightOperator(index, value);
        }}
        onInputValueChange={value => {
          if (isSelectedMultiselectLabel(selected.value, value)) {
            return;
          }

          emitter.inputChangeRightOperator(index, value);
        }}
        onScrollEnd={() => {
          emitter.scrollEndRightOperator(index);
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
    const options = includeSelectedComboboxOptions(selected.options ?? [], selected.value);
    const value = resolveComboboxValue(options, selected.value);

    return (
      <DynamicCombobox
        {...inlineControlProps}
        id={getFilterControlId("right", index)}
        data-test-id={`right-${index}`}
        value={value}
        options={options}
        loading={selected.loading}
        onChange={nextValue => {
          if (!nextValue) return;

          emitter.changeRightOperator(index, nextValue);
        }}
        onInputValueChange={inputValue => {
          if (isSelectedComboboxLabel(selected.value, inputValue)) {
            return;
          }

          emitter.inputChangeRightOperator(index, inputValue);
        }}
        onScrollEnd={() => {
          emitter.scrollEndRightOperator(index);
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

  if (isSelect(selected)) {
    const options = includeSelectedComboboxOptions(selected.options ?? [], selected.value);
    const value = resolveComboboxValue(options, selected.value) ?? selected.value;

    return (
      <Select
        {...inlineControlProps}
        id={getFilterControlId("right", index)}
        data-test-id={`right-${index}`}
        value={value}
        options={options}
        onChange={nextValue => emitter.changeRightOperator(index, nextValue)}
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
          {...inlineControlProps}
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
        {...inlineControlProps}
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
        {...inlineControlProps}
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
          {...inlineControlProps}
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
          {...inlineControlProps}
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

  if (isDoubleText(selected)) {
    return (
      <MetadataInput
        index={index}
        selected={selected}
        emitter={emitter}
        error={error}
        disabled={disabled}
      />
    );
  }

  return (
    <Input
      {...inlineControlProps}
      disabled
      value={selected.value}
      data-test-id={`right-${index}`}
    />
  );
};
