import { useState } from "react";

import { LeftOperand, LeftOperandsProvider } from "./LeftOperandsProvider";
import { STATIC_OPTIONS } from "./constants";


export const useFilterLeftOperandsProvider = (): LeftOperandsProvider => {
  const [operands, setOperands] = useState<LeftOperand[]>(STATIC_OPTIONS);

  return {
    operands,
    setOperands: (options: LeftOperand[]) =>
      setOperands(prev => [...prev, ...options]),
  };
};
