import { useContext } from "react";

import { discountRulesContext } from "./context";

export const useDiscountRulesContext = () => {
  const context = useContext(discountRulesContext);

  if (!context) {
    throw new Error("DiscountRulesContext is null");
  }

  return context;
};
