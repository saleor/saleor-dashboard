import { useMemo } from "react";

import { FilterContainer } from "./FilterElement";
import { OccurrenceLimiter } from "./FilterElement/OccurrenceLimiter";
import { LeftOperand } from "./LeftOperandsProvider";

export const useFilteredOperands = (
  operands: LeftOperand[],
  container: FilterContainer,
): LeftOperand[] => {
  return useMemo(
    () => OccurrenceLimiter.filterAvailableOperands(operands, container),
    [operands, container],
  );
};
