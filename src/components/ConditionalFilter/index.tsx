// @ts-strict-ignore
import { useApolloClient } from "@apollo/client";
import useDebounce from "@dashboard/hooks/useDebounce";
import {
  _ExperimentalFilters,
  Box,
  FilterEvent,
  Text,
} from "@saleor/macaw-ui/next";
import React from "react";

import { getLeftOperatorOptions } from "./API/getAPIOptions";
import { useProductFilterAPIProvider } from "./API/ProductFilterAPIProvider";
import { useFilterContainer } from "./useFilterContainer";
import { useLeftOperands } from "./useLeftOperands";
import { useUrlValueProvider } from "./ValueProvider/useUrlValueProvider";

const FiltersArea = ({ provider, onConfirm }) => {
  const client = useApolloClient();
  const apiProvider = useProductFilterAPIProvider();

  const {
    value,
    addEmpty,
    removeAt,
    updateLeftOperator,
    updateRightOperator,
    updateCondition,
    updateLeftLoadingState,
    fetchRightOptions,
  } = useFilterContainer(provider, apiProvider);

  const { operands, setOperands } = useLeftOperands();

  const handleLeftOperatorInputValueChange = (event: any) => {
    const fetchAPI = async () => {
      updateLeftLoadingState(event.path, true);
      const options = await getLeftOperatorOptions(client, event.value);
      updateLeftLoadingState(event.path, false);
      setOperands(prev => [...prev, ...options]);
    };
    fetchAPI();
  };

  const handleLeftOperatorInputValueChangeDebounced = useDebounce(
    handleLeftOperatorInputValueChange,
    500,
  );

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
      fetchRightOptions(event.path.split(".")[0], "");
    }

    if (event.type === "rightOperator.onInputValueChange") {
      fetchRightOptions(event.path.split(".")[0], event.value);
    }

    if (event.type === "leftOperator.onInputValueChange") {
      handleLeftOperatorInputValueChangeDebounced(event);
    }
  };

  const handleConfirm = () => onConfirm(value);

  return (
    <Box>
      <_ExperimentalFilters
        leftOptions={operands}
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
