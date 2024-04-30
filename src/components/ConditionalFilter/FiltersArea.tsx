import { Box } from "@saleor/macaw-ui-next";
import React, { FC } from "react";

import { useConditionalFilterContext } from "./context";
import { FilterContainer } from "./FilterElement";
import { LeftOperand } from "./LeftOperandsProvider";
import { useFiltersAreaTranslations } from "./messages";
import { FilterEvent, Filters, Row } from "./UI";
import { useFilterContainer } from "./useFilterContainer";
import { useTranslate } from "./useTranslate";
import { ErrorEntry } from "./Validation";

interface FiltersAreaProps {
  onConfirm: (value: FilterContainer) => void;
  errors?: ErrorEntry[];
  onCancel?: () => void;
}

const MAX_VALUE_ITEMS = 12;

export const FiltersArea: FC<FiltersAreaProps> = ({ onConfirm, onCancel, errors }) => {
  const { apiProvider, leftOperandsProvider } = useConditionalFilterContext();
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
    updateLeftOptions,
  } = useFilterContainer(apiProvider, leftOperandsProvider);
  const handleStateChange = async (event: FilterEvent["detail"]) => {
    if (!event) return;

    if (event.type === "row.add") {
      addEmpty();
    }

    if (event.type === "row.remove") {
      removeAt(event.path);
    }

    if (event.type === "leftOperator.onChange") {
      updateLeftOperator(event.path, event.value as LeftOperand);
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

    if (event.type === "leftOperator.onInputValueChange") {
      updateLeftOptions(event.path.split(".")[0], event.value);
    }
  };

  return (
    <Filters
      leftOptions={translateOperandOptions(leftOperandsProvider.operands)}
      value={translateSelectedOperands(value) as Array<string | Row>}
      onChange={handleStateChange}
      error={errors}
      locale={translations.locale}
    >
      <Filters.Footer>
        <Filters.AddRowButton
          variant="tertiary"
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
            disabled={hasEmptyRows}
            data-test-id="save-filters-button"
          >
            {translations.saveFilters}
          </Filters.ConfirmButton>
        </Box>
      </Filters.Footer>
    </Filters>
  );
};
