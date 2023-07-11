import React from "react";

import { ConditionalFilters } from "./ConditionalFilters";
import { FilterContainer } from "./FilterElement";

export const ConditionalProductFilters = () => {
  // @ts-expect-error
  const handleConfirm = (value: FilterContainer) => {};

  return <ConditionalFilters onConfirm={handleConfirm} />;
};
