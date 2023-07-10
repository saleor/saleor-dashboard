import React from "react";

import { ConditionalFilters } from "./ConditionalFilters";
import { FilterContainer } from "./FilterElement";
import { useUrlValueProvider } from "./ValueProvider/useUrlValueProvider";

export const ConditionalProductFilters = () => {
  const provider = useUrlValueProvider();

  // @ts-expect-error
  const handleConfirm = (value: FilterContainer) => {
  }

  return <ConditionalFilters provider={provider} onConfirm={handleConfirm} />
}