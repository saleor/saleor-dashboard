// @ts-strict-ignore
import {
  _ExperimentalFilters,
  Box,
  FilterEvent,
  Text,
} from "@saleor/macaw-ui/next";
import React from "react";

import { useProductFilterAPIProvider } from "./API/ProductFilterAPIProvider";
import { useFilterContainer } from "./useFilterContainer";
import { useFilterLeftOperandsProvider } from "./useFilterLeftOperands";
import { useUrlValueProvider } from "./ValueProvider/useUrlValueProvider";

const FiltersArea = ({ provider, onConfirm }) => {
  const apiProvider = useProductFilterAPIProvider();
  const leftOperandsProvider = useFilterLeftOperandsProvider();

  const {
    value,
    addEmpty,
    removeAt,
    updateLeftOperator,
    updateRightOperator,
    updateCondition,
    updateRightOptions,
    updateLeftOptions,
  } = useFilterContainer(provider, apiProvider, leftOperandsProvider);

  const handleStateChange = async (event: FilterEvent["detail"]) => {
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

  const handleConfirm = () => onConfirm(value);

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
          <_ExperimentalFilters.ConfirmButton onClick={handleConfirm}>
            Confirm
          </_ExperimentalFilters.ConfirmButton>
        </_ExperimentalFilters.Footer>
      </_ExperimentalFilters>
    </Box>
  );
};

export const ConditionalFilters = () => {
  const provider = useUrlValueProvider();

  return (
    <Box>
      {provider.loading ? (
        <Text>Loading...</Text>
      ) : (
        <FiltersArea provider={provider.value} onConfirm={provider.persist} />
      )}
    </Box>
  );
};
