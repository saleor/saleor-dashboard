import { Box, _ExperimentalFilters } from "@saleor/macaw-ui/next"
import { parse, stringify } from "qs";
import React, { useEffect, useState } from "react";
import { useAttributeListLazyQuery, useCategoryDetailsLazyQuery, useCategoryDetailsQuery } from "@dashboard/graphql";
import useCategorySearch from "@dashboard/searches/useCategorySearch";
import { useFilterContainer } from "./useFilterContainer";
import { useLeftOperands } from "./useLeftOperands";
import useRouter from "use-react-router";
import { UrlValueProvider, useUrlValueProvider } from "./FilterValueProvider";


const demoValue = [
  {
    value: "price",
    type: 1,
    condition: {
      options: [
        { type: "input.number", label: "is", value: "input-1" },
        { type: "multiselect", label: "has", value: "input-2" },
      ],
      selected: {
        value: "3.13",
        conditionValue: "input-1",
      },
    },
  },
  "AND",
  {
    value: "category",
    type: 1,
    condition: {
      options: [{ value: "input-1", label: "are", type: "multiselect" }],
      selected: {
        conditionValue: "input-1",
        value: ["clothing"],
        options: [
          { value: "electronics", label: "Electronics" },
          { value: "clothing", label: "Clothing" },
        ],
      },
    },
  },
  "OR",
  {
    value: "rating",
    type: 1,
    condition: {
      options: [{ value: "input-1", label: "is", type: "combobox" }],
      selected: {
        conditionValue: "input-1",
        value: "2",
        options: [
          { value: "1", label: "1" },
          { value: "2", label: "2" },
        ],
      },
    },
  },
  "AND",
  {
    value: "discount",
    type: 1,
    condition: {
      options: [{ value: "input-1", label: "is", type: "select" }],
      selected: {
        conditionValue: "input-1",
        value: "50%",
        options: [
          { value: "100%", label: "100%" },
          { value: "50%", label: "50%" },
        ],
      },
    },
  },
  "OR",
  {
    value: "color",
    type: 2,

    condition: {
      options: [{ value: "input-1", label: "is", type: "select" }],
      selected: {
        conditionValue: "input-1",
        value: "green",
        options: [
          { value: "red", label: "Red" },
          { value: "green", label: "Green" },
          { value: "blue", label: "Blue" },
        ],
      },
    },
  },
];



// const useFilterCollection = () => {

//   const [load, result] = useAttributeListLazyQuery()
  
//   useEffect(() => {
//     load({
//       variables: {
//         first: 100
//       }
//     })
  
//   }, [])
  
//   console.log(result.data)

// }

export const ConditionalFilters = () => {
  const provider = useUrlValueProvider()
  const leftOptions = useLeftOperands()
  const {
    value,
    persist,
    addEmpty,
    removeAt,
    updateLeftOperator,
    updateRightOperator,
    updateCondition
  } = useFilterContainer(provider)

  const handleStateChange = (event) => {
    if (event.type === "add") {
      addEmpty()
    }

    if (event.type === "remove") {
      removeAt(event.path)
    }

    if (event.type === "update.leftOperator") {
      updateLeftOperator(event.path.split('.')[0], event.value)
    }

    if (event.type === "update.conditon") {
      updateCondition(event.path.split('.')[0], event.value)
    }

    if (event.type === "update.rightOperator") {
      updateRightOperator(event.path.split('.')[0], event.value)
    }


    console.log(event)
  }

  const handleConfirm = () => {
    console.log("handleConfirm")
    persist()
  }

  console.log("Render with:", value)

  return (
    <Box __height={500}>
      <_ExperimentalFilters
        leftOptions={leftOptions}
        value={value}
        onChange={handleStateChange} />
      <button onClick={handleConfirm}>Confirm</button>
    </Box>
  )
}