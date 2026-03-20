import { useMemo } from "react";

import { type FilterContainer } from "./FilterElement";
import { OccurrenceLimiter } from "./FilterElement/OccurrenceLimiter";
import { type LeftOperand } from "./LeftOperandsProvider";

export const useFilteredOperands = (
  operands: LeftOperand[],
  container: FilterContainer,
): LeftOperand[] => {
  return useMemo(
    () => OccurrenceLimiter.filterAvailableOperands(operands, container),
    [operands, container],
  );
};
