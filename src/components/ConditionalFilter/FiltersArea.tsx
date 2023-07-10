import {
  _ExperimentalFilters,
  Box,
  FilterEvent,
} from "@saleor/macaw-ui/next";
import React from "react";

import { FilterAPIProvider } from "./API/FilterAPIProvider";
import { FilterContainer } from "./FilterElement";
import { LeftOperandsProvider } from "./LeftOperandsProvider";
import { useFilterContainer } from "./useFilterContainer";

interface FiltersAreaProps {
  filterValue: FilterContainer
  apiProvider: FilterAPIProvider
  leftOperandsProvider: LeftOperandsProvider
  onConfirm: (value: FilterContainer) => void
}

export const FiltersArea = ({ filterValue, apiProvider, leftOperandsProvider, onConfirm }: FiltersAreaProps) => {
  const {
    value,
    addEmpty,
    removeAt,
    updateLeftOperator,
    updateRightOperator,
    updateCondition,
    updateRightOptions,
    updateLeftOptions,
  } = useFilterContainer(filterValue, apiProvider, leftOperandsProvider);

  const handleStateChange = async (event: FilterEvent["detail"]) => {
    if (!event) return

    if (event.type === "row.add") {
      addEmpty();
    }

    if (event.type === "row.remove") {
      removeAt(event.path);
    }

    if (event.type === "leftOperator.onChange") {
      updateLeftOperator(event.path, event.value);
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
    <Box>
      <_ExperimentalFilters
        leftOptions={leftOperandsProvider.operands}
        // @ts-expect-error
        value={value}
        onChange={handleStateChange}
      >
        <_ExperimentalFilters.Footer>
          <_ExperimentalFilters.AddRowButton>
            Add new row
          </_ExperimentalFilters.AddRowButton>
          <_ExperimentalFilters.ConfirmButton onClick={() => onConfirm(value)}>
            Confirm
          </_ExperimentalFilters.ConfirmButton>
        </_ExperimentalFilters.Footer>
      </_ExperimentalFilters>
    </Box>
  );
};
