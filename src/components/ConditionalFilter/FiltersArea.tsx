import { _ExperimentalFilters, Box, FilterEvent } from "@saleor/macaw-ui/next";
import React, { FC } from "react";

import { useConditionalFilterContext } from "./context";
import { FilterContainer } from "./FilterElement";
import { LeftOperand } from "./LeftOperandsProvider";
import { useFilterContainer } from "./useFilterContainer";

interface FiltersAreaProps {
  onConfirm: (value: FilterContainer) => void;
  onCancel?: () => void;
}

export const FiltersArea: FC<FiltersAreaProps> = ({ onConfirm, onCancel }) => {
  const { apiProvider, leftOperandsProvider } = useConditionalFilterContext();

  const {
    value,
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
    <_ExperimentalFilters
      leftOptions={leftOperandsProvider.operands}
      // @ts-expect-error
      value={value}
      onChange={handleStateChange}
    >
      <_ExperimentalFilters.Footer>
        <_ExperimentalFilters.AddRowButton>
          + Add row
        </_ExperimentalFilters.AddRowButton>
        <Box display="flex" gap={3}>
          <_ExperimentalFilters.ClearButton onClick={onCancel}>
            Clear
          </_ExperimentalFilters.ClearButton>
          <_ExperimentalFilters.ConfirmButton onClick={() => onConfirm(value)}>
            Save
          </_ExperimentalFilters.ConfirmButton>
        </Box>
      </_ExperimentalFilters.Footer>
    </_ExperimentalFilters>
  );
};
