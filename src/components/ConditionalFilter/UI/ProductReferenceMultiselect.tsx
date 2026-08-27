import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { DynamicMultiselect, Text } from "@saleor/macaw-ui-next";
import { Check } from "lucide-react";
import { useCallback, useState } from "react";
import { FormattedMessage } from "react-intl";

import { filterProductReferenceOptions } from "../API/variantReferenceOption";
import { type FilterEventEmitter } from "./EventEmitter";
import { getFilterControlId } from "./filterControlId";
import { isFlatFilterLayout } from "./filterLayout";
import styles from "./ProductReferenceMultiselect.module.css";
import {
  ReferenceChipField,
  ReferenceThumbnail,
  restoreReferenceOptions,
  toProductDisplayChip,
} from "./ReferenceChip";
import {
  includeSelectedComboboxOptions,
  isSelectedMultiselectLabel,
} from "./resolveAsyncComboboxState";
import { type ConditionalFiltersLayout } from "./Root";
import { type MultiselectOperator, type RightOperatorOption } from "./types";
import {
  getVariantReferenceOptionId,
  useVariantReferenceCombobox,
} from "./useVariantReferenceCombobox";

interface ProductReferenceMultiselectProps {
  index: number;
  selected: MultiselectOperator;
  emitter: FilterEventEmitter;
  error: boolean;
  helperText: string;
  disabled: boolean;
  layout?: ConditionalFiltersLayout;
}

export const ProductReferenceMultiselect = ({
  index,
  selected,
  emitter,
  error,
  helperText,
  disabled,
  layout,
}: ProductReferenceMultiselectProps): JSX.Element => {
  const [query, setQuery] = useState("");
  const options = includeSelectedComboboxOptions(selected.options ?? [], selected.value);
  const listItems = filterProductReferenceOptions(options, query);
  const selectedIds = new Set(selected.value.map(option => option.value));
  const displayChips = selected.value.map(toProductDisplayChip);
  const inlineControlProps = isFlatFilterLayout(layout)
    ? { backgroundColor: "default1" as const }
    : {};
  const isInitialLoading = !!selected.loading && (selected.options ?? []).length === 0;
  const controlId = getFilterControlId("right", index);
  const listboxId = `${controlId}-listbox`;
  const handleToggle = useCallback(
    (option: RightOperatorOption) => {
      const exists = selected.value.some(item => item.value === option.value);
      const next = exists
        ? selected.value.filter(item => item.value !== option.value)
        : [...selected.value, option];

      emitter.changeRightOperator(index, next);
    },
    [emitter, index, selected.value],
  );
  const { highlightedIndex, getMenuProps, getItemProps, handleKeyDownCapture } =
    useVariantReferenceCombobox({
      items: listItems,
      controlId,
      menuId: listboxId,
      onToggle: handleToggle,
    });
  const highlightedOption = highlightedIndex >= 0 ? listItems[highlightedIndex] : undefined;

  return (
    <ReferenceChipField>
      <div
        className={styles.root}
        data-product-reference=""
        onKeyDownCapture={handleKeyDownCapture}
      >
        <DynamicMultiselect
          {...inlineControlProps}
          width="100%"
          id={controlId}
          data-test-id={`right-${index}`}
          value={displayChips}
          options={[]}
          loading={isInitialLoading}
          aria-controls={listboxId}
          aria-activedescendant={
            highlightedOption
              ? getVariantReferenceOptionId(controlId, highlightedOption.value)
              : undefined
          }
          onChange={value => {
            emitter.changeRightOperator(
              index,
              restoreReferenceOptions(value, [...selected.value, ...options]),
            );
          }}
          onInputValueChange={value => {
            if (isSelectedMultiselectLabel(selected.value, value)) {
              return;
            }

            setQuery(value);
            emitter.inputChangeRightOperator(index, value);
          }}
          onScrollEnd={() => {
            emitter.scrollEndRightOperator(index);
          }}
          onFocus={() => {
            emitter.focusRightOperator(index);
          }}
          onBlur={() => {
            setQuery("");
            emitter.blurRightOperator(index);
          }}
          error={error}
          helperText={helperText}
          disabled={disabled}
        >
          <DynamicMultiselect.NoOptions
            as="div"
            padding={0}
            textAlign="left"
            {...getMenuProps({ id: listboxId }, { suppressRefError: true })}
            className={styles.menu}
            aria-multiselectable="true"
            aria-labelledby={controlId}
          >
            {listItems.map((option, itemIndex) => {
              const isSelected = selectedIds.has(option.value);
              const isHighlighted = highlightedIndex === itemIndex;
              const itemProps = getItemProps({ item: option, index: itemIndex });

              return (
                <div
                  key={option.value}
                  {...itemProps}
                  role="option"
                  aria-selected={isSelected}
                  data-test-id="select-option"
                  data-highlighted={isHighlighted ? "" : undefined}
                  className={isSelected ? styles.optionSelected : styles.option}
                  onMouseDown={event => {
                    itemProps.onMouseDown?.(event);
                    event.preventDefault();
                  }}
                >
                  <ReferenceThumbnail
                    url={option.productThumbnailUrl}
                    testId="product-reference-thumbnail"
                  />
                  <Text
                    size={3}
                    color="default1"
                    className={styles.optionLabel}
                    title={option.label}
                  >
                    {option.label}
                  </Text>
                  {isSelected ? (
                    <Check size={iconSize.small} strokeWidth={iconStrokeWidth} />
                  ) : null}
                </div>
              );
            })}
            {listItems.length === 0 ? (
              <Text size={2} color="default2" padding={2}>
                <FormattedMessage defaultMessage="No options to select" id="xTyg+p" />
              </Text>
            ) : null}
          </DynamicMultiselect.NoOptions>
        </DynamicMultiselect>
      </div>
    </ReferenceChipField>
  );
};
