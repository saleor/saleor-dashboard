import { useState } from "react";

import { STATIC_OPTIONS } from "./constants";
import { LeftOperand, LeftOperandsProvider } from "./LeftOperandsProvider";


export const useFilterLeftOperandsProvider = (): LeftOperandsProvider => {
  const [operands, setOperands] = useState<LeftOperand[]>(STATIC_OPTIONS);

  return {
    operands,
    setOperands: (options: LeftOperand[]) =>
      setOperands(prev => [...prev, ...options]),
  };
};
