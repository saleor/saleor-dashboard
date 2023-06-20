import { useApolloClient } from "@apollo/client";
import { _ExperimentalFilters, Box, Text } from "@saleor/macaw-ui/next";
import React from "react";

import {
  getInitialRightOperatorOptions,
  getLeftOperatorOptions,
  getRightOperatorOptionsByQuery,
} from "./API/getAPIOptions";
import { useFilterContainer } from "./useFilterContainer";
import { useLeftOperands } from "./useLeftOperands";
import { useUrlValueProvider } from "./ValueProvider/useUrlValueProvider";

const demoValue = [
  {
    value: { value: "price", label: "Price", type: "1" },
    condition: {
      options: [
        { type: "number", label: "is", value: "input-1", min: 0, max: 10 },
        { type: "multiselect", label: "has", value: "input-2" },
      ],
      selected: {
        value: "3.13",
        conditionValue: { type: "number", label: "is", value: "input-1" },
      },
    },
  },
  "AND",
  {
    value: { value: "category", label: "Category", type: "2" },
    condition: {
      options: [{ value: "input-1", label: "are", type: "multiselect" }],
      selected: {
        conditionValue: { value: "input-1", label: "are", type: "multiselect" },
        value: [],
        options: [
          { value: "electronics", label: "Electronics" },
          { value: "clothing", label: "Clothing" },
        ],
      },
    },
  },
  "OR",
  {
    value: { value: "rating", label: "Rating", type: "3" },
    condition: {
      options: [{ value: "input-1", label: "is", type: "combobox" }],
      selected: {
        conditionValue: { value: "input-1", label: "is", type: "combobox" },
        value: null,
        options: [
          { value: "1", label: "1" },
          { value: "2", label: "2" },
        ],
      },
    },
  },
  "AND",
  {
    value: { value: "discount", label: "Discount", type: "4" },
    condition: {
      options: [{ value: "input-1", label: "is", type: "select" }],
      selected: {
        conditionValue: { value: "input-1", label: "is", type: "select" },
        value: "",
        options: [
          { value: "100%", label: "100%" },
          { value: "50%", label: "50%" },
        ],
      },
    },
  },
  "OR",
  {
    value: { value: "discount", label: "Discount", type: "4" },
    condition: {
      options: [{ value: "input-1", label: "between", type: "number.range" }],
      selected: {
        conditionValue: {
          value: "input-1",
          label: "between",
          type: "number.range",
        },
        value: {
          start: "0",
          end: "1",
        },
      },
    },
  },
];

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

  const handleStateChange = async event => {
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
      const path = event.path.split(".")[0];
      updateRightLoadingState(path, true);
      const options = await getRightOperatorOptionsByQuery(
        client,
        event.path.split(".")[0],
        value,
        event.value,
      );
      updateRightOptions(path, options);
      updateRightLoadingState(path, false);
    }

    if (event.type === "leftOperator.onInputValueChange") {
      updateLeftLoadingState(event.path, true);
      const options = await getLeftOperatorOptions(client, event.value);
      setOperands(options);
      updateLeftLoadingState(event.path, false);
    }

    // console.log(event);
  };

  const handleConfirm = () => {
    onConfirm(value);
  };

  console.log("Render with:", value);

  return (
    <Box __height={500}>
      <_ExperimentalFilters
        leftOptions={operands}
        value={value}
        onChange={handleStateChange}
      />
      <button onClick={handleConfirm}>Confirm</button>
    </Box>
  );
};

export const ConditionalFilters = () => {
  const provider = useUrlValueProvider();

  return (
    <Box __height={500}>
      {provider.loading ? (
        <Text>Loading...</Text>
      ) : (
        <FiltersArea provider={provider.value} onConfirm={provider.persist} />
      )}
    </Box>
  );
};
