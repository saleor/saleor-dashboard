import { _ExperimentalFilters, Box, FilterEvent } from "@saleor/macaw-ui/next";
import React from "react";

import { useConditionalFilterContext } from "./context";
import { FilterContainer } from "./FilterElement";
import { useFilterContainer } from "./useFilterContainer";

interface FiltersAreaProps {
  onConfirm: (value: FilterContainer) => void;
}

export const FiltersArea = ({ onConfirm }: FiltersAreaProps) => {
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
    console.log("event", event)

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
      console.log("rightOperator.onChange", event.value)
      updateRightOperator(event.path.split(".")[0], event.value);
    }

    if (event.type === "rightOperator.onFocus") {
      updateRightOptions(event.path.split(".")[0], "");
    }

    if (event.type === "rightOperator.onInputValueChange") {
      console.log("rightOperator.onInputValueChange", event.value)

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
