import unionBy from "lodash/unionBy";
import { useState } from "react";

import { LeftOperand, LeftOperandsProvider } from "./LeftOperandsProvider";

export const useFilterLeftOperandsProvider = (options: LeftOperand[]): LeftOperandsProvider => {
  const [operands, setOperands] = useState<LeftOperand[]>(options);

  return {
    operands,
    setOperands: (options: LeftOperand[]) =>
      setOperands(prev => unionBy([...prev, ...options], "value")),
  };
};
