import React from "react";

import { useProductFilterAPIProvider } from "./API/ProductFilterAPIProvider";
import { ConditionalFilters } from "./ConditionalFilters";
import { FilterContainer } from "./FilterElement";
import { useFilterLeftOperandsProvider } from "./useFilterLeftOperands";
import { useUrlValueProvider } from "./ValueProvider/useUrlValueProvider";

export const ConditionalProductFilters = () => {
  const provider = useUrlValueProvider();
  const apiProvider = useProductFilterAPIProvider();
  const leftOperandsProvider = useFilterLeftOperandsProvider();

  // @ts-expect-error
  const handleConfirm = (value: FilterContainer) => {
  }

  return <ConditionalFilters
    valueProvider={provider}
    apiProvider={apiProvider}
    leftOperandsProvider={leftOperandsProvider}
    onConfirm={handleConfirm}
  />
}