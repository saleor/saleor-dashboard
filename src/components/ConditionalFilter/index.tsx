import React from "react";
import { useUrlValueProvider } from "./ValueProvider/useUrlValueProvider";
import { ConditionalFilters } from "./ConditionalFilters";
import { FilterContainer } from "./FilterElement";

export const ConditionalProductFilters = () => {
  const provider = useUrlValueProvider();

  // @ts-ignore
  const handleConfirm = (value: FilterContainer) => {

  }

  return <ConditionalFilters provider={provider} onConfirm={handleConfirm} />
}