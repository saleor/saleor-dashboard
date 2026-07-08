import { Box } from "@saleor/macaw-ui-next";
import { type FC, useMemo } from "react";

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
import { areFilterContainersEqual } from "./ValueProvider/utils";

interface FiltersAreaProps {
  onConfirm: (value: FilterContainer) => void;
  errors?: ErrorEntry[];
  onCancel?: () => void;
  layout?: ConditionalFiltersLayout;
}

const MAX_VALUE_ITEMS = 12;

export const FiltersArea: FC<FiltersAreaProps> = ({
  onConfirm,
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
    updateAttribute,
    updateAvailableAttributesList,
  } = useFilterContainer(apiProvider);
  const filteredOperands = useFilteredOperands(leftOperandsProvider.operands, value);
  const containerBaseline = useMemo(
    () => getEditableFilterContainer(valueProvider.value),
    [valueProvider.value],
  );
  const hasUnsavedChanges = useMemo(
    () => !areFilterContainersEqual(value, containerBaseline),
    [value, containerBaseline],
  );
  const isConfirmDisabled = hasEmptyRows || !hasUnsavedChanges;
  const confirmLabel = layout === "inline" ? translations.applyFilters : translations.saveFilters;
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
        // Fetch list of attributes after user selects "Attribute" search
        updateAvailableAttributesList(event.path.split(".")[0], "");
      }
    }

    if (event.type === "condition.onChange") {
      updateCondition(event.path.split(".")[0], event.value);
    }

    if (event.type === "rightOperator.onChange") {
      updateRightOperator(event.path.split(".")[0], event.value);
    }

    if (event.type === "rightOperator.onFocus") {
      updateRightOptions(event.path.split(".")[0], "");
    }

    if (event.type === "rightOperator.onInputValueChange") {
      updateRightOptions(event.path.split(".")[0], event.value);
    }

    if (event.type === "attribute.onChange") {
      updateAttribute(event.path, event.value as LeftOperand);
    }

    if (event.type === "attribute.onInputValueChange") {
      updateAvailableAttributesList(event.path.split(".")[0], event.value);
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
        >
          {translations.addFilter}
        </Filters.AddRowButton>
        <Box display="flex" gap={3}>
          <Filters.ClearButton
            onClick={onCancel}
            variant="tertiary"
            data-test-id="reset-all-filters-button"
          >
            {translations.clearFilters}
          </Filters.ClearButton>
          <Filters.ConfirmButton
            onClick={() => onConfirm(value)}
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
