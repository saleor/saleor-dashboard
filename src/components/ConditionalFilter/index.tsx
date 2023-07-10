import React from "react";
import { useUrlValueProvider } from "./ValueProvider/useUrlValueProvider";
import { ConditionalFilters } from "./ConditionalFilters";
import { FilterContainer } from "./FilterElement";

export const ConditionalProductFilters = () => {
  const provider = useUrlValueProvider();

  const handleConfirm = (value: FilterContainer) => {
    console.log("confirm", value)
  }

  return <ConditionalFilters provider={provider} onConfirm={handleConfirm} />
}