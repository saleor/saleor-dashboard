// @ts-strict-ignore
import { useApolloClient } from "@apollo/client";
import useDebounce from "@dashboard/hooks/useDebounce";
import { _ExperimentalFilters, Box, Text } from "@saleor/macaw-ui/next";
import React from "react";

import {
  getInitialRightOperatorOptions,
  getLeftOperatorOptions,
  getRightOperatorOptionsByQuery,
} from "./API/getAPIOptions";
import { ConditionValue } from "./FilterElement/ConditionSelected";
import { useFilterContainer } from "./useFilterContainer";
import { useLeftOperands } from "./useLeftOperands";
import { useUrlValueProvider } from "./ValueProvider/useUrlValueProvider";

type FilterEvent =
  | {
      type: "row.add";
      rowType: string;
    }
  | {
      type: "row.remove";
      path: string;
    }
  | {
      type: "leftOperator.onChange";
      path: string;
      value: { label: string; value: string; type: string };
      rowType: string;
    }
  | {
      type: "leftOperator.onFocus";
      path: string;
    }
  | {
      type: "leftOperator.onBlur";
      path: string;
    }
  | {
      type: "leftOperator.onInputValueChange";
      path: string;
      value: string;
    }
  | {
      type: "condition.onChange";
      path: string;
      value: { label: string; value: string; type: string };
    }
  | {
      type: "condition.onFocus";
      path: string;
    }
  | {
      type: "condition.onBlur";
      path: string;
    }
  | {
      type: "rightOperator.onChange";
      path: string;
      value: ConditionValue;
    }
  | {
      type: "rightOperator.onFocus";
      path: string;
    }
  | {
      type: "rightOperator.onBlur";
      path: string;
    }
  | {
      type: "rightOperator.onInputValueChange";
      path: string;
      value: string;
    };

const FiltersArea = ({ provider, onConfirm }) => {
  const client = useApolloClient();

  const {
    value,
    addEmpty,
    removeAt,
    updateLeftOperator,
    updateRightOperator,
    updateCondition,
    updateRightOptions,
    updateRightLoadingState,
    updateLeftLoadingState,
  } = useFilterContainer(provider);

  const { operands, setOperands } = useLeftOperands();

  const handleLeftOperatorInputValueChange = (event: any) => {
    const fetchAPI = async () => {
      const options = await getLeftOperatorOptions(client, event.value);
      setOperands(options);
    };
    updateLeftLoadingState(event.path, true);
    fetchAPI();
    updateLeftLoadingState(event.path, false);
  };

  const handleLeftOperatorInputValueChangeDebounced = useDebounce(
    handleLeftOperatorInputValueChange,
    500,
  );

  const handleRightOperatorInputValueChange = (event: any) => {
    const fetchAPI = async () => {
      const options = await getRightOperatorOptionsByQuery(
        client,
        event.path.split(".")[0],
        value,
        event.value,
      );
      updateRightOptions(event.path.split(".")[0], options);
    };
    updateRightLoadingState(event.path.split(".")[0], true);
    fetchAPI();
    updateRightLoadingState(event.path.split(".")[0], false);
  };

  const handleRightOperatorInputValueChangeDebounced = useDebounce(
    handleRightOperatorInputValueChange,
    500,
  );

  const handleStateChange = async (event: FilterEvent) => {
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
      const path = event.path.split(".")[0];
      updateRightLoadingState(path, true);
      const options = await getInitialRightOperatorOptions(client, path, value);
      updateRightOptions(path, options);
      updateRightLoadingState(path, false);
    }

    if (event.type === "rightOperator.onInputValueChange") {
      handleRightOperatorInputValueChangeDebounced(event);
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
        // TODO: add proper types in Macaw UI
        // @ts-expect-error
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
