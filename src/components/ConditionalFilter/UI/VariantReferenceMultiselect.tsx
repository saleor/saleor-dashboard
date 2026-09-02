import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { DynamicMultiselect, Text } from "@saleor/macaw-ui-next";
import { Check } from "lucide-react";
import { useCallback, useState } from "react";
import { FormattedMessage } from "react-intl";

import {
  filterVariantReferenceOptions,
  getVariantReferenceGroups,
  resolveVariantReferenceFields,
  toVariantReferencePill,
} from "../API/variantReferenceOption";
import { type FilterEventEmitter } from "./EventEmitter";
import { getFilterControlId } from "./filterControlId";
import { isFlatFilterLayout } from "./filterLayout";
import {
  ReferenceChipField,
  ReferenceThumbnail,
  restoreReferenceOptions,
  toVariantDisplayChip,
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
  type VariantReferenceListItem,
} from "./useVariantReferenceCombobox";
import styles from "./VariantReferenceMultiselect.module.css";

interface VariantReferenceMultiselectProps {
  index: number;
  selected: MultiselectOperator;
  emitter: FilterEventEmitter;
  error: boolean;
  helperText: string;
  disabled: boolean;
  layout?: ConditionalFiltersLayout;
}

export const VariantReferenceMultiselect = ({
  index,
  selected,
  emitter,
  error,
  helperText,
  disabled,
  layout,
}: VariantReferenceMultiselectProps): JSX.Element => {
  const [query, setQuery] = useState("");
  const options = includeSelectedComboboxOptions(selected.options ?? [], selected.value);
  const variantOptions = filterVariantReferenceOptions(
    options.flatMap(option => {
      const fields = resolveVariantReferenceFields(option);

      return fields ? [fields] : [];
    }),
    query,
  );
  const groups = getVariantReferenceGroups(variantOptions);
  const listItems: VariantReferenceListItem[] = groups.flatMap(group => group.variants);
  const itemIndexByValue = new Map(listItems.map((item, index) => [item.value, index]));
  const selectedIds = new Set(selected.value.map(option => option.value));
  const pills = selected.value.map(toVariantReferencePill);
  const displayChips = pills.map(toVariantDisplayChip);
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
        : [...selected.value, toVariantReferencePill(option)];

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
        data-variant-reference=""
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
              restoreReferenceOptions(value, pills).map(toVariantReferencePill),
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
            {groups.map(group => (
              <div
                key={group.productId ?? group.productName}
                className={styles.group}
                role="group"
                aria-label={group.productName}
              >
                <div className={styles.groupHeader}>
                  <ReferenceThumbnail
                    url={group.productThumbnailUrl}
                    testId="variant-reference-thumbnail"
                  />
                  <Text
                    size={3}
                    color="default2"
                    className={styles.groupLabel}
                    title={group.productName}
                  >
                    {group.productName}
                  </Text>
                </div>
                {group.variants.map(variant => {
                  const itemIndex = itemIndexByValue.get(variant.value);
                  const item = itemIndex === undefined ? variant : listItems[itemIndex];
                  const isSelected = selectedIds.has(variant.value);
                  const isHighlighted = itemIndex !== undefined && highlightedIndex === itemIndex;
                  const itemProps =
                    itemIndex === undefined
                      ? {}
                      : getItemProps({
                          item,
                          index: itemIndex,
                        });

                  return (
                    <div
                      key={variant.value}
                      {...itemProps}
                      role="option"
                      aria-selected={isSelected}
                      data-test-id="select-option"
                      data-highlighted={isHighlighted ? "" : undefined}
                      className={isSelected ? styles.variantSelected : styles.variant}
                      onMouseDown={event => {
                        itemProps.onMouseDown?.(event);
                        event.preventDefault();
                      }}
                    >
                      <Text size={3} color="default1" className={styles.variantLabel}>
                        {variant.variantName}
                      </Text>
                      {isSelected ? (
                        <Check size={iconSize.small} strokeWidth={iconStrokeWidth} />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ))}
            {groups.length === 0 ? (
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
