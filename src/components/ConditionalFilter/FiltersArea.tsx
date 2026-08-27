import { Box } from "@saleor/macaw-ui-next";
import { type FC, useMemo, useState } from "react";

import { useConditionalFilterContext } from "./context";
import { type FilterContainer } from "./FilterElement";
import { getEditableFilterContainer } from "./globalConstraints";
import { type LeftOperand } from "./LeftOperandsProvider";
import { useFiltersAreaTranslations } from "./messages";
import { type ConditionalFiltersLayout, type FilterEvent, Filters, type Row } from "./UI";
import { useFilterContainer } from "./useFilterContainer";
import { useFilteredOperands } from "./useFilteredOperands";
import { useTranslate } from "./useTranslate";
import { type ErrorEntry } from "./Validation";
import { getFilterContainerKey, hasUnsavedFilterChanges } from "./ValueProvider/utils";

interface FiltersAreaProps {
  onConfirm: (value: FilterContainer) => boolean | void;
  errors?: ErrorEntry[];
  onClear?: () => void;
  onCancel?: () => void;
  layout?: ConditionalFiltersLayout;
}

const MAX_VALUE_ITEMS = 12;

export const FiltersArea: FC<FiltersAreaProps> = ({
  onConfirm,
  onClear,
  onCancel,
  errors,
  layout = "popover",
}) => {
  const { apiProvider, leftOperandsProvider, valueProvider } = useConditionalFilterContext();
  const translations = useFiltersAreaTranslations();
  const { translateOperandOptions, translateSelectedOperands } = useTranslate();
  const {
    value,
    hasEmptyRows,
    addEmpty,
    removeAt,
    updateLeftOperator,
    updateRightOperator,
    updateCondition,
    updateRightOptions,
    fetchRightOptionsList,
    fetchMoreRightOptions,
    updateAttribute,
    fetchAvailableAttributesList,
    fetchMoreAttributeOptions,
    updateAvailableAttributesList,
  } = useFilterContainer(apiProvider);
  const filteredOperands = useFilteredOperands(leftOperandsProvider.operands, value);
  const [committedKey, setCommittedKey] = useState(() =>
    getFilterContainerKey(getEditableFilterContainer(valueProvider.value)),
  );
  const hasUnsavedChanges = useMemo(
    () => hasUnsavedFilterChanges(getEditableFilterContainer(value), committedKey),
    [value, committedKey],
  );
  const isConfirmDisabled = hasEmptyRows || !hasUnsavedChanges;
  const commitCurrentValue = (next: FilterContainer): void => {
    setCommittedKey(getFilterContainerKey(getEditableFilterContainer(next)));
  };
  const addLabel = layout === "panel" ? translations.addCondition : translations.addFilter;
  const confirmLabel =
    layout === "panel"
      ? translations.applyPanelFilters
      : layout === "inline"
        ? translations.applyFilters
        : translations.saveFilters;
  const handleStateChange = async (event: FilterEvent["detail"]) => {
    if (!event) return;

    if (event.type === "row.add") {
      addEmpty();
    }

    if (event.type === "row.remove") {
      removeAt(event.path);
    }

    if (event.type === "leftOperator.onChange") {
      const leftOperand = event.value as LeftOperand;

      updateLeftOperator(event.path, leftOperand);

      if (leftOperand.value === "attribute") {
        fetchAvailableAttributesList(event.path.split(".")[0], "");
      }
    }

    if (event.type === "condition.onChange") {
      updateCondition(event.path.split(".")[0], event.value);
    }

    if (event.type === "rightOperator.onChange") {
      updateRightOperator(event.path.split(".")[0], event.value);
    }

    if (event.type === "rightOperator.onFocus") {
      fetchRightOptionsList(event.path.split(".")[0], "");
    }

    if (event.type === "rightOperator.onInputValueChange") {
      updateRightOptions(event.path.split(".")[0], event.value);
    }

    if (event.type === "rightOperator.onScrollEnd") {
      fetchMoreRightOptions(event.path.split(".")[0]);
    }

    if (event.type === "attribute.onChange") {
      updateAttribute(event.path, event.value as LeftOperand);
    }

    if (event.type === "attribute.onFocus") {
      fetchAvailableAttributesList(event.path.split(".")[0], "");
    }

    if (event.type === "attribute.onInputValueChange") {
      updateAvailableAttributesList(event.path.split(".")[0], event.value);
    }

    if (event.type === "attribute.onScrollEnd") {
      fetchMoreAttributeOptions(event.path.split(".")[0]);
    }
  };

  return (
    <Filters
      layout={layout}
      leftOptions={translateOperandOptions(filteredOperands)}
      value={translateSelectedOperands(value) as Array<string | Row>}
      onChange={handleStateChange}
      error={errors}
      locale={translations.locale}
    >
      <Filters.Footer layout={layout}>
        <Filters.AddRowButton
          disabled={value.length > MAX_VALUE_ITEMS}
          data-test-id="add-filter-button"
          variant={layout === "panel" ? "tertiary" : "secondary"}
        >
          {addLabel}
        </Filters.AddRowButton>
        <Box display="flex" gap={3}>
          <Filters.ClearButton
            onClick={() => {
              onClear?.();
              commitCurrentValue([]);
            }}
            variant="tertiary"
            data-test-id="reset-all-filters-button"
          >
            {translations.clearFilters}
          </Filters.ClearButton>
          {layout === "panel" ? (
            <Filters.CloseButton onClick={onCancel} data-test-id="close-filters-button">
              {translations.closePanel}
            </Filters.CloseButton>
          ) : null}
          <Filters.ConfirmButton
            onClick={() => {
              if (onConfirm(value) !== false) {
                commitCurrentValue(value);
              }
            }}
            disabled={isConfirmDisabled}
            data-test-id="save-filters-button"
          >
            {confirmLabel}
          </Filters.ConfirmButton>
        </Box>
      </Filters.Footer>
    </Filters>
  );
};
